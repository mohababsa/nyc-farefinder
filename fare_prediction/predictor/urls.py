from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_fare, name='predict_fare'),
]