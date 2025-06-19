# calculater/serializers.py
from rest_framework import serializers
from .models import IncomeSource, Expense, ExpenseCategory, SavingsGoal, CalculationResult

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'name']

class IncomeSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeSource
        fields = ['id', 'name', 'amount', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = ['id', 'name', 'amount', 'category', 'category_name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class SavingsGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingsGoal
        fields = ['target_amount', 'timeframe_months', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.target_amount = validated_data.get('target_amount', instance.target_amount)
        instance.timeframe_months = validated_data.get('timeframe_months', instance.timeframe_months)
        instance.save()
        return instance

class CalculationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationResult
        fields = [
            'id', 'total_income', 'total_expenses', 'potential_savings',
            'savings_rate', 'monthly_savings_needed', 'calculated_at'
        ]
        read_only_fields = ['calculated_at']

class CalculationRequestSerializer(serializers.Serializer):
    """Serializer pour recevoir les données de calcul depuis le frontend"""
    income_sources = IncomeSourceSerializer(many=True)
    expenses = ExpenseSerializer(many=True)
    savings_goal = SavingsGoalSerializer()

class CalculationResponseSerializer(serializers.Serializer):
    """Serializer pour retourner les résultats de calcul"""
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    potential_savings = serializers.DecimalField(max_digits=10, decimal_places=2)
    savings_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    monthly_savings_needed = serializers.DecimalField(max_digits=10, decimal_places=2)
    recommendations = serializers.ListField(child=serializers.CharField())
    is_goal_achievable = serializers.BooleanField()
    months_to_goal = serializers.IntegerField(allow_null=True)

class UserFinancialDataSerializer(serializers.Serializer):
    """Serializer pour récupérer toutes les données financières d'un utilisateur"""
    income_sources = IncomeSourceSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    savings_goal = SavingsGoalSerializer(read_only=True)
    expense_categories = ExpenseCategorySerializer(many=True, read_only=True)