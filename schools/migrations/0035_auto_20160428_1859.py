# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schools', '0034_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schoolprofile',
            name='grade_max',
            field=models.IntegerField(choices=[(-2, '3 year old prekindergarten'), (-1, '4 year old prekindergarten'), (0, 'Kindergarten'), (1, '1st grade'), (2, '2nd grade'), (3, '3rd grade'), (4, '4th grade'), (5, '5th grade'), (6, '6th grade'), (7, '7th grade'), (8, '8th grade'), (9, '9th grade'), (10, '10th grade'), (11, '11th grade'), (12, '12th grade')], default=-2),
        ),
        migrations.AlterField(
            model_name='schoolprofile',
            name='grade_min',
            field=models.IntegerField(choices=[(-2, '3 year old prekindergarten'), (-1, '4 year old prekindergarten'), (0, 'Kindergarten'), (1, '1st grade'), (2, '2nd grade'), (3, '3rd grade'), (4, '4th grade'), (5, '5th grade'), (6, '6th grade'), (7, '7th grade'), (8, '8th grade'), (9, '9th grade'), (10, '10th grade'), (11, '11th grade'), (12, '12th grade')], default=-2),
        ),
    ]
