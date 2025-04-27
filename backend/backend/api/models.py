from datetime import timedelta

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    @property
    def total_deposits(self):
        deposits = Deposit.objects.filter(user=self)
        total_deposit_amount = deposits.aggregate(models.Sum('amount'))['amount__sum'] or 0
        return round(total_deposit_amount, 2)

    @property
    def no_of_open_orders(self):
        return self.orders.filter(status="open").count()

    @property
    def no_of_closed_orders(self):
        return self.orders.filter(status="closed").count()

    @property
    def total_no_of_orders(self):
        return self.orders.count()

    @property
    def win_rate(self):
        completed_trades = CompletedTrade.objects.filter(initial_order__user=self)
        total_completed = completed_trades.count()
        if total_completed == 0:
            return 0

        successful_trades = completed_trades.filter(net_amount__gt=0).count()
        win_rate = successful_trades / total_completed * 100
        return round(win_rate, 2)

    @property
    def profit_factor(self):
        completed_trades = CompletedTrade.objects.filter(initial_order__user=self)
        profit = completed_trades.filter(net_amount__gt=0).aggregate(models.Sum('net_amount'))['net_amount__sum'] or 0
        loss = completed_trades.filter(net_amount__lt=0).aggregate(models.Sum('net_amount'))['net_amount__sum'] or 0
        if not loss:
            return 0
        profit_factor = profit / abs(loss)
        return round(profit_factor, 2)

    @property
    def average_profit_loss(self):
        completed_trades = CompletedTrade.objects.filter(initial_order__user=self)
        total_completed = completed_trades.count()
        if total_completed == 0:
            return 0

        total_net_amount = completed_trades.aggregate(models.Sum('net_amount'))['net_amount__sum'] or 0
        average_profit_loss = total_net_amount / total_completed
        return round(average_profit_loss, 2)

    @property
    def average_holding_duration(self):
        completed_trades = CompletedTrade.objects.filter(initial_order__user=self)
        if completed_trades.count() == 0:
            return 0

        total_duration = sum([trade.duration for trade in completed_trades])
        average_duration = total_duration / completed_trades.count()
        return round(average_duration, 2)

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return self.created_at + timedelta(minutes=10) < timezone.now()


class Deposit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposited_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.amount} on {self.date}"

class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.symbol

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order_type = models.CharField(max_length=4, choices=[("buy", "Buy"), ("sell", "Sell")])
    comment = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=[("open", "Open"), ("closed", "Closed")], default="open")

    def __str__(self):
        return f"{self.stock.symbol} - {self.order_type} on {self.date}"

class CompletedTrade(models.Model):
    initial_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='initial_order', default=None)
    close_price = models.DecimalField(max_digits=10, decimal_places=2, default=None)
    close_date = models.DateField(null=True, blank=True)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Close Trade for {self.initial_order.stock.symbol}"

class OpenPosition(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quantity = models.IntegerField(null=True, blank=True)
    total_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
