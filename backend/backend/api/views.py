import random
from datetime import timedelta, datetime
from decimal import Decimal

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets

from .serializers import OrderSerializer, CompletedTradeSerializer, OpenPositionSerializer, DepositSerializer, \
    UserSerializer

from .models import Order, Stock, OpenPosition, CompletedTrade, Deposit, PasswordResetOTP

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """Handles user-related operations."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns all users if superuser, else only the authenticated user."""
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)


class RegisterView(APIView):
    """Handles user registration."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Registers a new user with a username, email, and password."""
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)


        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Handles user login and returns JWT tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Authenticates user using email and password, returns refresh and access tokens."""
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        if not User.objects.filter(email=email).exists():
            return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

        username = User.objects.get(email=email).username
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'refresh': str(refresh),
            'access': str(access)
        })

        return response


class LogoutView(APIView):
    """Handles user logout by blacklisting the refresh token."""
    def post(self, request):
        """Invalidates the refresh token to logout the user."""
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "User logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    """Sends a password reset OTP to user's email."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Generates and sends OTP to the email if user exists."""
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(user=user, otp=otp)

        send_mail(
            'Password Reset Code',
            f'Your password reset code is {otp}',
            settings.DEFAULT_FROM_EMAIL,
            [email]
        )

        return Response({'message': 'OTP sent to email'})


class VerifyOTPView(APIView):
    """Verifies the OTP for password reset."""
    def post(self, request):
        """Checks if OTP is valid and not expired."""
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
            otp_entry = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).last()
            if not otp_entry or otp_entry.is_expired():
                return Response({"error": "Invalid or expired OTP"}, status=400)

            otp_entry.save()
            return Response({"message": "OTP verified", "user_id": user.id})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class ResetPasswordView(APIView):
    """Resets the user's password if OTP is valid."""
    def post(self, request):
        """Validates OTP and resets user's password."""
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if not email or not otp or not new_password:
            return Response({"error": "Email, OTP, and new password are required."}, status=400)

        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.get(user=user, otp=otp, is_used=False)

            if otp_record.created_at + timedelta(minutes=10) < timezone.now():
                return Response({"error": "OTP has expired."}, status=400)

            user.password = make_password(new_password)
            user.save()

            otp_record.is_used = True
            otp_record.save()

            return Response({"message": "Password reset successful."})

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Invalid OTP or OTP already used."}, status=400)


class DepositViewSet(viewsets.ModelViewSet):
    """Handles user deposits."""
    queryset = Deposit.objects.all()
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns deposits for the authenticated user (or all if superuser)."""
        user = self.request.user
        if user.is_superuser:
            return Deposit.objects.all()
        return Deposit.objects.filter(user=user)

    @transaction.atomic
    def perform_create(self, serializer):
        """Creates a deposit and updates the user's balance."""
        data = self.request.data
        data['user'] = self.request.user.id
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    """Handles creation and management of stock orders."""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns orders for the authenticated user (or all if superuser)."""
        user = self.request.user
        if user.is_superuser:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    @transaction.atomic
    def perform_create(self, serializer):
        """Creates an order and updates the open position for the user."""
        data = self.request.data
        data['symbol'] = data['symbol'].upper()
        stock, created = Stock.objects.get_or_create(symbol=data['symbol'])

        serializer.save(user=self.request.user, stock=stock)

        open_position, created = OpenPosition.objects.get_or_create(stock=stock, user=self.request.user)
        if created:
            open_position.quantity = 0
            open_position.total_value = Decimal("0.00")
        open_position.quantity += int(data['quantity'])
        open_position.total_value += Decimal(data['price']) * int(data['quantity'])
        open_position.save()

    def calculate_net_result(self, order, close_price):
        """Calculates profit or loss for the trade based on order type."""
        if order.order_type == 'buy':
            return (float(close_price) - float(order.price)) * int(order.quantity)
        else:
            return (float(close_price) - float(order.price)) * int(order.quantity)

    @transaction.atomic
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Closes a trade and make its status 'closed'. Add to CompletedTrade. Remove from OpenPosition."""
        data = request.data
        order = self.get_object()
        close_price = data.get('close_price')
        close_date = data.get('close_date')
        note = data.get('note')

        if not close_price or not close_date:
            return Response({"error": "close_price and close_date are required."}, status=400)

        net_amount = self.calculate_net_result(order, close_price)
        close_date = datetime.strptime(data.get('close_date'), '%Y-%m-%d')
        order_date = datetime.combine(order.date, datetime.min.time())
        duration = (close_date - order_date).days
        if duration < 0:
            return Response({"error": "Close date cannot be before order date."}, status=400)

        CompletedTrade.objects.create(
            initial_order=order,
            close_price=close_price,
            close_date=close_date,
            net_amount=net_amount,
            duration=duration,
            note=note
        )
        order.status = 'closed'
        order.save()

        open_position = OpenPosition.objects.get(stock=order.stock, user=order.user)
        open_position.quantity -= int(order.quantity)
        open_position.total_value -= Decimal(str(order.price)) * int(order.quantity)
        open_position.save()

        return Response({
            "message": "Trade closed successfully."
        })


class CompletedTradeViewSet(viewsets.ModelViewSet):
    """Handles completed trades (closed trades with P/L and duration)."""
    queryset = CompletedTrade.objects.all()
    serializer_class = CompletedTradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns completed trades for the authenticated user (or all if superuser)."""
        user = self.request.user
        if user.is_superuser:
            return CompletedTrade.objects.all()
        return CompletedTrade.objects.filter(initial_order__user=user)

    def perform_destroy(self, instance):
        """Deletes a completed trade and reopens the initial order."""
        order = instance.initial_order
        instance.delete()
        order.status = 'open'
        order.save()


class OpenPositionViewSet(viewsets.ModelViewSet):
    """Handles open stock positions for users."""
    queryset = OpenPosition.objects.all()
    serializer_class = OpenPositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Returns open positions for the authenticated user (or all if superuser)."""
        user = self.request.user
        if user.is_superuser:
            return OpenPosition.objects.all()
        return OpenPosition.objects.filter(user=user, quantity__gt=0)
