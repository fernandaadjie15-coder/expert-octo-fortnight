from django.urls import include, path


urlpatterns = [
    path("api/", include("patients.urls")),
    path("api/", include("fitur_baru.urls")),
]
