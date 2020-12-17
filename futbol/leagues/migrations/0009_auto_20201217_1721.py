# Generated by Django 3.1.4 on 2020-12-17 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0008_crossleaguestandings'),
    ]

    operations = [
        migrations.AddField(
            model_name='crossleaguestandings',
            name='cumulative_goal_difference_normalized',
            field=models.CharField(default='', max_length=10000, verbose_name='Cumulative goal difference normalized'),
        ),
        migrations.AddField(
            model_name='crossleaguestandings',
            name='cumulative_points_normalized',
            field=models.CharField(default='', max_length=10000, verbose_name='Cumulative points normalized'),
        ),
        migrations.AlterField(
            model_name='crossleaguestandings',
            name='cumulative_goal_difference',
            field=models.CharField(default='', max_length=10000, verbose_name='Cumulative goal difference'),
        ),
        migrations.AlterField(
            model_name='crossleaguestandings',
            name='cumulative_points',
            field=models.CharField(default='', max_length=10000, verbose_name='Cumulative points'),
        ),
        migrations.AlterField(
            model_name='crossleaguestandings',
            name='results_string',
            field=models.CharField(default='', max_length=10000, verbose_name='Results string'),
        ),
    ]