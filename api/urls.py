from django.urls import path
from . import views

urlpatterns = [
    path("api/login", views.login, name="login"),
    path("api/logout", views.logout, name="logout"),
    path("api/register", views.register, name="register"),
    path("api/current_user", views.current_user, name="current_user"),
    path('api/add_training_data', views.add_training_data, name='add_training_data'),
    path('api/delete_training_data', views.delete_training_data, name='delete_training_data'),
    path('api/get_training_metadata', views.get_training_metadata, name='get_training_metadata'),
    path('api/get_training_metadatum', views.get_training_metadatum, name='get_training_metadatum'),
    path('api/get_training_datum', views.get_training_datum, name='get_training_datum'),
    path('api/remove_outliers', views.remove_outliers, name='remove_outliers'),
    path('', views.front, name='front'),

]
