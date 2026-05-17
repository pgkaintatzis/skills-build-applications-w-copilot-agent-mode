from django.test import TestCase
from rest_framework.test import APIClient
from .models import Team, Activity, Leaderboard, Workout

class APITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name="Test Team")
        self.workout = Workout.objects.create(name="Pushups", description="Do 20 pushups")
        self.activity = Activity.objects.create(user="testuser", team="Test Team", type="run", duration=30)
        self.leaderboard = Leaderboard.objects.create(team="Test Team", points=100)

    def test_api_root(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("teams", response.data)

    def test_team_list(self):
        response = self.client.get("/api/teams/")
        self.assertEqual(response.status_code, 200)

    def test_activity_list(self):
        response = self.client.get("/api/activities/")
        self.assertEqual(response.status_code, 200)

    def test_leaderboard_list(self):
        response = self.client.get("/api/leaderboard/")
        self.assertEqual(response.status_code, 200)

    def test_workout_list(self):
        response = self.client.get("/api/workouts/")
        self.assertEqual(response.status_code, 200)
