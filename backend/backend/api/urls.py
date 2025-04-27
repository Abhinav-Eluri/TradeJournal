from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import RegisterView, LoginView, LogoutView, ForgotPasswordView, VerifyOTPView, ResetPasswordView, \
    OrderViewSet, CompletedTradeViewSet, OpenPositionViewSet, DepositViewSet, UserViewSet

router= DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'completed-trades', CompletedTradeViewSet, basename='completed trades')
router.register(r'open-positions', OpenPositionViewSet, basename="open-positions")
router.register(r'deposits', DepositViewSet, basename='deposit')
router.register(r'users', UserViewSet, basename='user')


urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('api/', include(router.urls))

]
