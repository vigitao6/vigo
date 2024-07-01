from django.shortcuts import render
from django.http import JsonResponse
import json
from .solver import a_star

def index(request):
    return render(request, 'puzzle_game/index.html')

def solve(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            initial = tuple(tuple(row) for row in data['initial'])
            end = tuple(tuple(row) for row in data['end'])
            print(f"Initial state: {initial}")
            print(f"End state: {end}")
            steps = a_star(initial, end)
            print(f"Steps: {steps}")
            return JsonResponse({'steps': steps})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})
