from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='users')

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Activity(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='activities')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"


class Leaderboard(models.Model):
    team = models.OneToOneField(Team, on_delete=models.CASCADE, related_name='leaderboard')
    points = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.team.name}: {self.points}"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
