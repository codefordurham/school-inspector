from django.shortcuts import render
from django.contrib.gis.geos import Point

from rest_framework import generics
from rest_framework.exceptions import ParseError

from schools.serializers import SchoolSerializer
from schools import models as schools_models

class LocationEligibleSchools(generics.ListAPIView):
    model = schools_models.School
    serializer_class = SchoolSerializer

    def get_queryset(self):
        queryset = super(LocationEligibleSchools, self).get_queryset()
        try:
            lat = self.request.GET['latitude']
            lon = self.request.GET['longitude']
            pt = Point(float(lon), float(lat))
        except ValueError:
            raise ParseError("Bad location")
        except KeyError:
            raise ParseError("No location provided")
        return queryset.filter(district__contains=pt)
