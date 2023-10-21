from django.db import models

class GameState(models.Model):
    player_position = models.IntegerField(default=1)
    cpu_position = models.IntegerField(default=1)
    is_player_turn = models.BooleanField(default=True)
    is_game_over = models.BooleanField(default=False)
    dice = models.IntegerField(default=0)
