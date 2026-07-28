from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"detail": "Los datos enviados no son válidos.", "errors": response.data}
    return response
