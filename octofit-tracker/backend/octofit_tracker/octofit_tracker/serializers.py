from rest_framework import serializers

from .models import Activity, Leaderboard, Team, UserProfile, Workout


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name']

    def get_id(self, obj):
        return str(obj.pk)


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'team_id']

    def get_id(self, obj):
        return str(obj.pk)

    def get_team_id(self, obj):
        return str(obj.team_id)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'team_id', 'activity_type', 'duration_minutes']

    def get_id(self, obj):
        return str(obj.pk)

    def get_user_id(self, obj):
        return str(obj.user_id)

    def get_team_id(self, obj):
        return str(obj.team_id)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'team_id', 'points']

    def get_id(self, obj):
        return str(obj.pk)

    def get_team_id(self, obj):
        return str(obj.team_id)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'name', 'description']

    def get_id(self, obj):
        return str(obj.pk)
