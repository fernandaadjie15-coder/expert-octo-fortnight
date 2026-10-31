from django.urls import path

from .views import AppointmentListCreateView


urlpatterns = [
    path(
        "appointments/",
        AppointmentListCreateView.as_view(),
        name="appointment-list-create",
    ),
]
