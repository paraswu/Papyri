# Generated by Django 2.2.7 on 2019-11-24 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('papyri', '0010_quiz_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='score',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
