from datetime import datetime
from uuid import uuid4

from django.utils import timezone
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from patients.views import patients


appointments = []


class AppointmentSerializer(serializers.Serializer):
    patient_id = serializers.CharField()
    department = serializers.ChoiceField(
        choices=["Umum", "Anak", "Kandungan", "Jantung"]
    )
    doctor_name = serializers.CharField(max_length=150)
    appointment_date = serializers.DateField()
    appointment_time = serializers.TimeField()
    reason = serializers.CharField(max_length=500, allow_blank=True, required=False)

    def validate_patient_id(self, value):
        if not any(patient["id"] == value for patient in patients):
            raise serializers.ValidationError("Pasien tidak ditemukan.")
        return value

    def validate(self, attrs):
        scheduled_at = timezone.make_aware(
            datetime.combine(attrs["appointment_date"], attrs["appointment_time"]),
            timezone.get_current_timezone(),
        )
        if scheduled_at <= timezone.now():
            raise serializers.ValidationError(
                {"appointment_date": "Jadwal harus berada di masa mendatang."}
            )
        return attrs


class AppointmentListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, _request):
        return Response(appointments)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        appointment_data = serializer.validated_data
        patient = next(
            patient
            for patient in patients
            if patient["id"] == appointment_data["patient_id"]
        )
        appointment = {
            "id": uuid4().hex,
            "patient_id": patient["id"],
            "patient_name": patient["full_name"],
            "department": appointment_data["department"],
            "doctor_name": appointment_data["doctor_name"],
            "appointment_date": appointment_data["appointment_date"].isoformat(),
            "appointment_time": appointment_data["appointment_time"].strftime("%H:%M"),
            "reason": appointment_data.get("reason", ""),
        }
        appointments.insert(0, appointment)
        return Response(appointment, status=201)
