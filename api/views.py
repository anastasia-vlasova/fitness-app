from django.contrib import auth
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.handlers.wsgi import WSGIRequest
from .models import User, TrainingData
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import pandas as pd
from io import StringIO
from datetime import datetime
from decimal import Decimal
from scipy import stats
import numpy as np

def front(request: WSGIRequest):
    context = { }
    return render(request, 'index.html', context)
    
@csrf_exempt
def register(request: WSGIRequest):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    body = json.loads(request.body)
    username = body.get('username')

    # Ensure password matches confirmation
    password = body.get('password')
    confirmation = body.get('confirmation')
    if password != confirmation:
        return JsonResponse({"error": "Password and password confirmation didn't match"}, status=400)  # TODO: check status

    # Attempt to create new user
    try:
        user = User.objects.create_user(username=username, password=password)
        user.save()
    except IntegrityError:
        return JsonResponse({"error": "Username already taken"}, status=400)  # TODO: check status

    auth.login(request, user)
    return JsonResponse({'message': "The new user is successfully created and logged in"}, status=200)

@csrf_exempt
def login(request: WSGIRequest):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    body = json.loads(request.body)

    # Attempt to sign user in
    username = body.get('username')
    password = body.get('password')
    user = auth.authenticate(request, username=username, password=password)

    # Check if authentication successful
    if user is not None:
        auth.login(request, user)
        return JsonResponse({
            "message": "User is successfully loged in",
            "username": username
            }, status=200)
    else:
         return JsonResponse({"error": "Invalid username and/or password"}, status=400)

def logout(request: WSGIRequest):
    auth.logout(request)
    return JsonResponse({"message": "User is logged out"}, status=200)

def current_user(request: WSGIRequest):
    return JsonResponse(
        {'user_name': request.user.username,
         'user_id': request.user.id,
         'is_authenticated': request.user.is_authenticated}
    )

@login_required
def add_training_data(request: WSGIRequest):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    data_str = str(request.body)
    track_id = request.GET.get('track_id')
    data_lines = data_str.split('\\n')
    del data_str
    print(f'Amount of rows in the payload {len(data_lines)}')
    meta_start = 4
    data_start = 6
    data_end = -3

    data_meta = data_lines[meta_start:data_start]
    data_data = data_lines[data_start:data_end]
    
    del data_lines
    
    data_data_str = '\n'.join(data_data)
    data = pd.read_csv(StringIO(data_data_str), sep=',')
    columns_to_del = ['Sample rate']
    for c in data.columns:
        if all(pd.isna(data[c])) :
            columns_to_del.append(c)
    
    data_cleaned = data.drop(columns=columns_to_del)


    data_renamed = data_cleaned.rename(columns={
        'Sample rate': 'sample_rate',
        'Time': 'time',
        'HR (bpm)': 'hr',
        'Speed (km/h)':'speed',
        'Pace (min/km)':'pace',
        'Cadence': 'cadence',
        'Altitude (m)':'altitude',
        'Stride length (m)':'stride',
        'Distances (m)':'distance',
        'Temperatures (C)': 'temperature',
        'Power (W)': 'power'
        })

    data_no_nans = data_renamed.where(pd.notnull(data_renamed), 0)

    print(f'Data columns: {data_no_nans.columns}')
    data_meta_str = '\n'.join(data_meta)
    meta = pd.read_csv(StringIO(data_meta_str), sep=',')
    print(f'Meta columns: {meta.columns}')
    user = request.user

    training_data = TrainingData(
        data=data_no_nans,
        user=user,
        track_id=track_id if track_id != 'undefined' else '',
        sport=meta['Sport'][0],
        date=datetime.strptime(meta['Date'][0], '%d-%m-%Y'),
        start_time=meta['Start time'][0],
        duration=meta['Duration'][0],
        distance=Decimal(meta['Total distance (km)'][0].item()),
        average_hr=Decimal(meta['Average heart rate (bpm)'][0].item()),
        average_speed=Decimal(meta['Average speed (km/h)'][0].item()),
        max_speed=Decimal(meta['Max speed (km/h)'][0].item()),
        average_pace=meta['Average pace (min/km)'][0],
        max_pace=meta['Max pace (min/km)'][0],
        calories=Decimal(meta['Calories'][0].item()),
        fat_percentage=Decimal(meta['Fat percentage of calories(%)'][0].item()),
        average_cadence=None if pd.isna(meta['Average cadence (rpm)'][0]) else Decimal(meta['Average cadence (rpm)'][0].item()) ,
        running_index=None if pd.isna(meta['Running index'][0]) else Decimal(meta['Running index'][0].item()),
        training_load=Decimal(meta['Training load'][0].item()),
        ascent=Decimal(meta['Ascent (m)'][0].item()),
        descent=Decimal(meta['Descent (m)'][0].item()),
    )
    training_data.save()
    return JsonResponse({'message': 'New training data was added successfully.',
                         'metadata': training_data.serialize()}, status=201)

@login_required
def delete_training_data(request: WSGIRequest):
    if request.method != 'DELETE':
        return JsonResponse({"error": "DELETE request required."}, status=400)

    user_id = request.user.id
    training_id = request.GET.get('id')
    entry = TrainingData.objects.get(user_id=user_id, id=training_id)
    entry.delete()
    return JsonResponse({"message": f'Training data with id {training_id} was successfully deleted'}, status=200)

@login_required
def get_training_metadata(request: WSGIRequest):
    if request.method != "GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    user_id = request.user.id

    training_id = request.GET.get('training_id')
    sport = request.GET.get('sport')
    track_id = request.GET.get('track_id')

    filter = { 'user_id': user_id }
    if sport is not None: filter['sport'] = sport
    if track_id is not None: filter['track_id'] = track_id
    if training_id is not None: filter['id'] = training_id

    entries = TrainingData.objects.filter(**filter).defer('data')
    entries = entries.order_by('-date').all()
    return JsonResponse([entry.serialize() for entry in entries], safe=False)

@login_required
def get_training_metadatum(request: WSGIRequest):
    if request.method != "GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    user_id = request.user.id
    training_id = request.GET.get('training_id')
    entry = TrainingData.objects.get(user_id=user_id, id=training_id)
    return JsonResponse(entry.serialize())

@login_required
def get_training_datum(request: WSGIRequest):
    if request.method != "GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    user_id = request.user.id
    training_id = request.GET.get('training_id')
    entry = TrainingData.objects.get(user_id=user_id, id=training_id)
    return JsonResponse(entry.serialize_data())

@login_required
def remove_outliers(request: WSGIRequest):
    def remove_outliers(column):
        """ Use interpolation and padding """
        z = np.where(np.abs(stats.zscore(column)) > 2)[0]
        column.loc[z] = np.nan
        column_interpolated = column.interpolate()
        column_padded_end = column_interpolated.fillna(method='ffill')
        column_padded_start = column_padded_end.fillna(method='bfill')

        return column_padded_start

    if request.method != "GET":
        return JsonResponse({"error": "GET request required."}, status=400)
    user_id = request.user.id
    training_id = request.GET.get('training_id')
    entry = TrainingData.objects.get(user_id=user_id, id=training_id)
    altitude = entry.data.get('altitude')
    cadence = entry.data.get('cadence')
    speed = entry.data.get('speed')
    hr = entry.data.get('hr')

    entry.data.altitude = remove_outliers(altitude)
    if cadence is not None: 
        entry.data.cadence = remove_outliers(cadence)
    entry.data.speed = remove_outliers(speed)
    entry.data.hr = remove_outliers(hr)

    return JsonResponse(entry.serialize_data())
