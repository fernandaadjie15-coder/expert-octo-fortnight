from uuid import uuid4

from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


# Data is lost when the Django process restarts.
patients = [
    {
        "id": "demo-001",
        "full_name": "Andi Pratama",
        "age": 34,
        "gender": "Male",
        "room_type": "Class 1",
        "symptoms_diagnosis": "Demam dan dehidrasi",
    },
    {
        "id": "demo-002",
        "full_name": "Siti Rahmawati",
        "age": 52,
        "gender": "Female",
        "room_type": "VIP",
        "symptoms_diagnosis": "Pemantauan pascaoperasi",
    },
    {
        "id": "demo-003",
        "full_name": "Budi Santoso",
        "age": 67,
        "gender": "Male",
        "room_type": "Class 2",
        "symptoms_diagnosis": "Tekanan darah tinggi",
    },
    {
        "id": "demo-004",
        "full_name": "Dewi Lestari",
        "age": 28,
        "gender": "Female",
        "room_type": "Class 3",
        "symptoms_diagnosis": "Observasi nyeri perut",
    },
    {
        "id": "demo-005",
        "full_name": "Rizky Maulana",
        "age": 45,
        "gender": "Male",
        "room_type": "Class 1",
        "symptoms_diagnosis": "Infeksi saluran pernapasan",
    },
    {
        "id": "demo-006",
        "full_name": "Maya Putri",
        "age": 39,
        "gender": "Female",
        "room_type": "VIP",
        "symptoms_diagnosis": "Pemantauan pascaoperasi",
    },
    {
        "id": "demo-007",
        "full_name": "Agus Wijaya",
        "age": 73,
        "gender": "Male",
        "room_type": "Class 2",
        "symptoms_diagnosis": "Pemantauan kondisi jantung",
    },
    {
        "id": "demo-008",
        "full_name": "Nadia Permata",
        "age": 21,
        "gender": "Female",
        "room_type": "Class 3",
        "symptoms_diagnosis": "Observasi demam",
    },
]


class PatientSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    age = serializers.IntegerField(min_value=0)
    gender = serializers.ChoiceField(choices=["Male", "Female", "Other"])
    room_type = serializers.ChoiceField(
        choices=["VIP", "Class 1", "Class 2", "Class 3"]
    )
    symptoms_diagnosis = serializers.CharField(max_length=1000)


class PatientListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(patients)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient = {
            "id": uuid4().hex,
            **serializer.validated_data,
        }
        patients.append(patient)
        return Response(patient, status=201)
