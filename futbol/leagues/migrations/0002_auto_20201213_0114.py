# Generated by Django 3.1.4 on 2020-12-12 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeagueStandings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('standings', models.IntegerField(verbose_name='Standing')),
                ('team', models.CharField(max_length=50, verbose_name='Team')),
                ('played', models.IntegerField(verbose_name='Games played')),
                ('points', models.IntegerField(verbose_name='Points')),
                ('goal_difference', models.IntegerField(verbose_name='Goal difference')),
                ('wins', models.IntegerField(verbose_name='Wins')),
                ('losses', models.IntegerField(verbose_name='Losses')),
                ('draws', models.IntegerField(verbose_name='Draws')),
                ('goals_scored', models.IntegerField(verbose_name='Goals scored')),
                ('goals_allowed', models.IntegerField(verbose_name='Goals allowed')),
                ('clean_sheets', models.IntegerField(verbose_name='Clean sheets')),
                ('clean_sheets_against', models.IntegerField(verbose_name='Clean sheets against')),
                ('big_wins', models.IntegerField(verbose_name='Big wins')),
                ('big_losses', models.IntegerField(verbose_name='Big losses')),
                ('season', models.CharField(max_length=10, verbose_name='Season')),
                ('league', models.CharField(max_length=30, verbose_name='League')),
            ],
            options={
                'verbose_name': 'League Standings',
                'verbose_name_plural': 'League Standings',
            },
        ),
        migrations.AlterModelOptions(
            name='leaguematch',
            options={'verbose_name': 'League Match', 'verbose_name_plural': 'League Matches'},
        ),
    ]
