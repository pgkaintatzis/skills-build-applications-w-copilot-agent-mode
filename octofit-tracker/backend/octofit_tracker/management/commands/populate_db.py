
from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, Leaderboard, Team, UserProfile, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        UserProfile.objects.all().delete()
        Team.objects.all().delete()

        team_marvel = Team.objects.create(name='Team Marvel')
        team_dc = Team.objects.create(name='Team DC')

        heroes = [
            {'username': 'ironman', 'email': 'ironman@octofit.test', 'team': team_marvel},
            {'username': 'spiderman', 'email': 'spiderman@octofit.test', 'team': team_marvel},
            {'username': 'captainamerica', 'email': 'captainamerica@octofit.test', 'team': team_marvel},
            {'username': 'batman', 'email': 'batman@octofit.test', 'team': team_dc},
            {'username': 'superman', 'email': 'superman@octofit.test', 'team': team_dc},
            {'username': 'wonderwoman', 'email': 'wonderwoman@octofit.test', 'team': team_dc},
        ]

        users = {}
        for hero in heroes:
            users[hero['username']] = UserProfile.objects.create(**hero)

        Activity.objects.bulk_create(
            [
                Activity(user=users['ironman'], team=team_marvel, activity_type='Running', duration_minutes=40),
                Activity(user=users['spiderman'], team=team_marvel, activity_type='HIIT', duration_minutes=35),
                Activity(user=users['captainamerica'], team=team_marvel, activity_type='Cycling', duration_minutes=50),
                Activity(user=users['batman'], team=team_dc, activity_type='Strength', duration_minutes=45),
                Activity(user=users['superman'], team=team_dc, activity_type='Swimming', duration_minutes=60),
                Activity(user=users['wonderwoman'], team=team_dc, activity_type='Yoga', duration_minutes=30),
            ]
        )

        Leaderboard.objects.bulk_create(
            [
                Leaderboard(team=team_marvel, points=320),
                Leaderboard(team=team_dc, points=300),
            ]
        )

        Workout.objects.bulk_create(
            [
                Workout(name='Avengers Circuit', description='Burpees, pushups, planks, and sprints.'),
                Workout(name='Justice Strength', description='Squats, deadlifts, rows, and core finisher.'),
                Workout(name='Hero Cardio Blast', description='Intervals of running, jump rope, and mountain climbers.'),
            ]
        )

        self.stdout.write(self.style.SUCCESS('Populate complete for octofit_db.'))
