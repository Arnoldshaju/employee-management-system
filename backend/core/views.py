from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health_check(request):
    """Confirm that the Django API is running and reachable."""
    return Response(
        {
            'status': 'ok',
            'message': 'Employee Management API is running.',
        }
    )
