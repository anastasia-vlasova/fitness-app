export const SERVER = 'http://127.0.0.1:8000/api';

//TODO: Refactor and move all the fetches into here
//TODO: Refactor remove all the state setting functions from here
//TODO: Remove from utils

function getCookie(name) {
  // source: https://medium.com/analytics-vidhya/how-to-use-react-in-django-the-hard-way-6ef2bf8c5d6f
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export function getCsrfToken() {

  const token = getCookie('csrftoken');
  console.log(`Token cookie ${token}`);
  return token;
}

export async function fetchAuthUserData() {
  const response = await fetch(`${SERVER}/current_user`, {
    method: 'GET'
  });
  const data = await response.json();
  return data;
}

export async function fetchTrainingMetaData(sport, track_id, training_id) {
  console.log('Entered fetchTrainingMetaData');
  let params = {}

  if (sport !== undefined) params['sport'] = sport;
  if (track_id !== undefined) params['track_id'] = track_id;
  if (training_id !== undefined)  params['training_id'] = training_id;

  let params_str = ''
  for (const [key, value] of Object.entries(params)) {
    params_str += params_str.length === 0 ? `${key}=${value}` : `&${key}=${value}`
  }
  const url = params_str.length === 0 ? `${SERVER}/get_training_metadata`:
    `${SERVER}/get_training_metadata?${params_str}`;

  const res = await fetch(url, {
    method: 'GET'
  });
  const status = res.status;
  const data = await res.json();
  if (status === 200) {
    console.log(`Getting user training metadata for ${sport} track id ${track_id} training id ${training_id}`);
    console.log(data);
  }
  return (data);
}

export async function fetchTrainingMetaDatum(training_id) {
  console.log('Entered fetchTrainingData');
  const res = await fetch(`${SERVER}/get_training_metadatum?training_id=${training_id}`, {
    method: 'GET',
  });
  const status = res.status;
  const data = await res.json();
  if (status === 200) {
    console.log(`Getting training data for ${training_id}`);
  };
  return (data);
}

export async function fetchTrainingData(training_id){
  console.log('Entered fetchTrainingData');
  const res = await fetch(`${SERVER}/get_training_datum?training_id=${training_id}`, {
    method: 'GET',
  });
  const status = res.status;
  const data = await res.json();
  if (status === 200) {
    console.log(`Getting training data for ${training_id}`);
  } 
  
  return (data);
};

export async function fetchRemoveOutliers( training_id){
  console.log('Entered fetchRemoveOutliers');
  const res = await fetch(`${SERVER}/remove_outliers?training_id=${training_id}`, {
    method: 'GET',
  });
  const status = res.status;
  const data = await res.json();
  if (status === 200) {
    console.log(`Removing outliers for ${training_id}`);

  } 
  return (data);
};

export async function fetchSmoothing(
  training_id, 
  window, 
  column_name
  ){
  console.log('Entered fetchSmoothing');

  const res = await fetch(`${SERVER}/smoothing`, {
    method: 'GET',
    body: {
      training_id,
      window,
      column_name,
    }
  });
  const status = res.status;
  const data = await res.json();
  if (status === 200) {
    console.log(`Smoothing ${training_id}`);

  } 
  return (data);
};

export async function fetchAddTrainingData(formData, track_id) {
  const csrf_token = getCsrfToken();

  const headers = new Headers({
    'X-CSRFToken': csrf_token,
    'Content-Type': 'text/csv'
  });
  const res = await fetch(`${SERVER}/add_training_data?track_id=${track_id}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const status = res.status;
 return  status === 201 ? await res.json() : res.body;
}

export async function fetchDeleteTrainingData(id) {
  const csrf_token = getCsrfToken();

  const headers = new Headers({
    'X-CSRFToken': csrf_token
  });
  const res = await fetch(`${SERVER}/delete_training_data?id=${id}`, {
    method: 'DELETE',
    headers,
  });
  const status = res.status;
 return  status === 201 ? await res.json() : res.body;
}

export async function fetchLogOut() {
  const csrf_token = getCsrfToken();
  const headers = new Headers({
    'X-CSRFToken': csrf_token
  });

const res = await fetch(`${SERVER}/logout`, {
  method: 'POST',
  headers
});
const status = res.status;
const data = await res.json();
if (status === 200) {
  console.log('Logging out');
  console.log(data);
}
return status;
}

export async function fetchLogIn(username, password) {
  const csrf_token = getCsrfToken();
  const headers = new Headers({
    'X-CSRFToken': csrf_token
  });
  const result = await fetch(`${SERVER}/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify(
      {
        username,
        password
      }
    )
  });
  if (result.status === 200) {
    console.log('Logging in');
  }
  return result;
}

export async function fetchRegister(username, password, confirmation) {
  const csrf_token = getCsrfToken();
  const headers = new Headers({
    'X-CSRFToken': csrf_token
  });

  const result = await fetch(`${SERVER}/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify(
      {
        username,
        password,
        confirmation
      }
    )
  });
  const data = await result.json();
  return result;
}
