from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import docs


@api_view(['GET'])
def get_documentation(request):
    return Response(data=docs.ENDPOINTS, status=status.HTTP_200_OK)