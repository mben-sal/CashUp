# calculater/views.py
from decimal import Decimal
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import IncomeSource, Expense, ExpenseCategory, SavingsGoal, CalculationResult
from .serializers import (
    IncomeSourceSerializer, ExpenseSerializer, ExpenseCategorySerializer,
    SavingsGoalSerializer, CalculationResultSerializer, CalculationResponseSerializer,
    UserFinancialDataSerializer
)

class IncomeSourceViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les sources de revenus"""
    serializer_class = IncomeSourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IncomeSource.objects.filter(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les dépenses"""
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class ExpenseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour récupérer les catégories de dépenses"""
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class SavingsGoalView(APIView):
    """Vue pour gérer l'objectif d'épargne de l'utilisateur"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            savings_goal = SavingsGoal.objects.get(user=request.user)
            serializer = SavingsGoalSerializer(savings_goal)
            return Response(serializer.data)
        except SavingsGoal.DoesNotExist:
            return Response({
                'target_amount': 0,
                'timeframe_months': 12
            })

    def post(self, request):
        try:
            savings_goal = SavingsGoal.objects.get(user=request.user)
            serializer = SavingsGoalSerializer(savings_goal, data=request.data, context={'request': request})
        except SavingsGoal.DoesNotExist:
            serializer = SavingsGoalSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FinancialCalculatorView(APIView):
    """Vue principale pour effectuer les calculs financiers"""
    permission_classes = [permissions.IsAuthenticated]

    def calculate_recommendations(self, total_income, total_expenses, potential_savings, 
                                savings_goal_amount, housing_expenses):
        """Génère des recommandations basées sur les données financières"""
        recommendations = []
        
        savings_rate = (potential_savings / total_income * 100) if total_income > 0 else 0
        
        # Recommandations sur le taux d'épargne
        if savings_rate < 10:
            recommendations.append("Essayez de viser une épargne d'au moins 10% de vos revenus")
        
        # Recommandations sur les dépenses
        if total_expenses > total_income * Decimal('0.9'):
            recommendations.append("Vos dépenses sont élevées par rapport à vos revenus. Identifiez les postes à réduire.")
        
        # Recommandations sur le logement
        if housing_expenses > total_income * Decimal('0.33'):
            recommendations.append("Vos frais de logement dépassent 33% de vos revenus, ce qui est généralement trop élevé.")
        
        # Recommandations critiques
        if potential_savings < 0:
            recommendations.append("Vous dépensez plus que vous ne gagnez. Réduisez vos dépenses immédiatement.")
        
        # Recommandations générales
        recommendations.append("Mettez en place un versement automatique vers un compte épargne dès réception de votre salaire.")
        
        return recommendations

    def post(self, request):
        """Effectue les calculs financiers"""
        user = request.user
        
        # Récupérer les données de l'utilisateur depuis la base de données
        income_sources = IncomeSource.objects.filter(user=user)
        expenses = Expense.objects.filter(user=user)
        
        try:
            savings_goal = SavingsGoal.objects.get(user=user)
        except SavingsGoal.DoesNotExist:
            savings_goal = SavingsGoal(target_amount=0, timeframe_months=12)
        
        # Calculs
        total_income = sum(income.amount for income in income_sources)
        total_expenses = sum(expense.amount for expense in expenses)
        potential_savings = total_income - total_expenses
        
        # Calcul du taux d'épargne
        savings_rate = (potential_savings / total_income * 100) if total_income > 0 else Decimal('0')
        
        # Calcul de l'épargne mensuelle nécessaire pour l'objectif
        monthly_savings_needed = (savings_goal.target_amount / savings_goal.timeframe_months) if savings_goal.timeframe_months > 0 else Decimal('0')
        
        # Calcul des dépenses de logement
        housing_expenses = sum(
            expense.amount for expense in expenses 
            if expense.category.name == 'Logement'
        )
        
        # Générer les recommandations
        recommendations = self.calculate_recommendations(
            total_income, total_expenses, potential_savings,
            savings_goal.target_amount, housing_expenses
        )
        
        # Vérifier si l'objectif est atteignable
        is_goal_achievable = potential_savings >= monthly_savings_needed
        months_to_goal = None
        if potential_savings > 0 and savings_goal.target_amount > 0:
            months_to_goal = int(savings_goal.target_amount / potential_savings)
        
        # Sauvegarder le résultat
        calculation_result = CalculationResult.objects.create(
            user=user,
            total_income=total_income,
            total_expenses=total_expenses,
            potential_savings=potential_savings,
            savings_rate=savings_rate,
            monthly_savings_needed=monthly_savings_needed
        )
        
        response_data = {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'potential_savings': potential_savings,
            'savings_rate': savings_rate,
            'monthly_savings_needed': monthly_savings_needed,
            'recommendations': recommendations,
            'is_goal_achievable': is_goal_achievable,
            'months_to_goal': months_to_goal
        }
        
        serializer = CalculationResponseSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFinancialDataView(APIView):
    """Vue pour récupérer toutes les données financières de l'utilisateur"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Récupérer toutes les données
        income_sources = IncomeSource.objects.filter(user=user)
        expenses = Expense.objects.filter(user=user)
        expense_categories = ExpenseCategory.objects.all()
        
        try:
            savings_goal = SavingsGoal.objects.get(user=user)
        except SavingsGoal.DoesNotExist:
            savings_goal = None
        
        data = {
            'income_sources': IncomeSourceSerializer(income_sources, many=True).data,
            'expenses': ExpenseSerializer(expenses, many=True).data,
            'expense_categories': ExpenseCategorySerializer(expense_categories, many=True).data,
            'savings_goal': SavingsGoalSerializer(savings_goal).data if savings_goal else None
        }
        
        return Response(data, status=status.HTTP_200_OK)

class CalculationHistoryView(APIView):
    """Vue pour récupérer l'historique des calculs"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        calculations = CalculationResult.objects.filter(user=request.user)[:10]  # 10 derniers calculs
        serializer = CalculationResultSerializer(calculations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)