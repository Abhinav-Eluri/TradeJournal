from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, CharField
from .models import Order, Stock, CompletedTrade, OpenPosition, Deposit

User = get_user_model()


# User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

    def to_representation(self,  instance):
        rep = super().to_representation(instance)
        rep["no_of_open_orders"] = instance.no_of_open_orders
        rep["no_of_closed_orders"] = instance.no_of_closed_orders
        rep["total_no_of_orders"] = instance.total_no_of_orders
        rep["win_rate"] = instance.win_rate
        rep["profit_factor"] = instance.profit_factor
        rep["average_profit_loss"] = instance.average_profit_loss
        rep["average_holding_duration"]= instance.average_holding_duration
        rep["total_deposits"] = instance.total_deposits

        return rep


# Deposit Serializer
class DepositSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Deposit
        fields = ['id','user', 'amount', 'deposited_at']
        read_only_fields = ['user']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['username'] = instance.user.username  # expose username in the response flatly
        return rep

# Stock Serializer
class StockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'symbol']


# Order Serializer
class OrderSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)             # for response
    stock = StockSerializer(read_only=True)           # for response

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'stock']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['symbol'] = instance.stock.symbol  # expose symbol in the response flatly
        return rep

    class OrderSerializer(ModelSerializer):
        user = UserSerializer(read_only=True)
        stock = StockSerializer(read_only=True)

        class Meta:
            model = Order
            fields= [
                'id', 'stock', 'date', 'quantity', 'price', 'order_type', 'comment'
            ]
            read_only_fields = ['stock', 'user']

        def to_representation(self, instance):
            # Add symbol as flat value in output
            rep = super().to_representation(instance)
            rep['symbol'] = instance.stock.symbol
            return rep


class CompletedTradeSerializer(ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = CompletedTrade
        fields = ['order', 'duration', 'id', 'net_amount', 'close_price', 'close_date', 'note']
        read_only_fields = ['order']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['open_price'] = instance.initial_order.price
        rep['open_date'] = instance.initial_order.date
        rep['quantity'] = instance.initial_order.quantity
        rep['order_type'] = instance.initial_order.order_type
        rep['symbol'] = instance.initial_order.stock.symbol  # expose symbol in the response flatly
        return rep

class OpenPositionSerializer(ModelSerializer):
    stock = StockSerializer(read_only=True)

    class Meta:
        model = OpenPosition
        fields = ['id', 'stock', 'quantity', 'total_value']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['symbol'] = instance.stock.symbol
        return rep

