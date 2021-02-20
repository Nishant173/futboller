# Generated by Django 3.1.5 on 2021-02-20 03:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0009_auto_20201217_1721'),
    ]

    operations = [
        migrations.CreateModel(
            name='GoalRelatedStats',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('league', models.CharField(help_text='Name of league', max_length=30, verbose_name='League')),
                ('month_group', models.CharField(help_text='Month of a particular year. Format: <yyyy>-<mm>', max_length=7, verbose_name='Month group')),
                ('month_group_verbose', models.CharField(help_text='Month of a particular year (verbosified)', max_length=30, verbose_name='Month group verbose')),
                ('games_played', models.IntegerField(verbose_name='Games played')),
                ('avg_goals_scored', models.FloatField(verbose_name='Average goals scored')),
                ('avg_goal_difference', models.FloatField(verbose_name='Average goal difference')),
                ('percent_one_sided_games', models.FloatField(help_text="Percentage of games wherein one team won by a margin of 'x' or more goals", verbose_name='Percentage of one sided games')),
                ('percent_games_with_clean_sheets', models.FloatField(help_text='Percentage of games wherein atleast one team kept a clean sheet', verbose_name='Percentage of games with clean sheets')),
            ],
            options={
                'verbose_name': 'Goal Related Stats',
                'verbose_name_plural': 'Goal Related Stats',
            },
        ),
    ]