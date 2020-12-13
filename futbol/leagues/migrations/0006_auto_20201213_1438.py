# Generated by Django 3.1.4 on 2020-12-13 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0005_leaguestandings_results_string'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaguestandings',
            name='cumulative_goal_difference',
            field=models.CharField(default='', max_length=200, verbose_name='Cumulative goal difference'),
        ),
        migrations.AddField(
            model_name='leaguestandings',
            name='cumulative_points',
            field=models.CharField(default='', max_length=200, verbose_name='Cumulative points'),
        ),
    ]
