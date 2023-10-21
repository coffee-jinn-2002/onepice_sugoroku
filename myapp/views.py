from rest_framework import viewsets
from .models import GameState
from .serializers import GameStateSerializer
from django.shortcuts import render
from django.http import JsonResponse


class GameStateViewSet(viewsets.ModelViewSet):
    queryset = GameState.objects.all()
    serializer_class = GameStateSerializer

def index(request):
    return render(request, 'index.html')
