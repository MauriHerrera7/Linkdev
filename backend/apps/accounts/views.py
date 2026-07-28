from rest_framework import generics, permissions, status, throttling
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import RegisterSerializer, UserSerializer


class AuthThrottle(throttling.AnonRateThrottle):
    scope = "auth"


def token_response(user):
    token = TokenObtainPairSerializer.get_token(user)
    return {"access": str(token.access_token), "refresh": str(token), "user": UserSerializer(user).data}


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(token_response(user), status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({**serializer.validated_data, "user": UserSerializer(serializer.user).data})


class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
