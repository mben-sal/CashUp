# calculater/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    IncomeSourceViewSet, ExpenseViewSet, ExpenseCategoryViewSet,
    SavingsGoalView, FinancialCalculatorView, UserFinancialDataView,
    CalculationHistoryView
)

# Créer le router pour les ViewSets
router = DefaultRouter()
router.register('income-sources', IncomeSourceViewSet, basename='income-sources')
router.register('expenses', ExpenseViewSet, basename='expenses')
router.register('expense-categories', ExpenseCategoryViewSet, basename='expense-categories')

urlpatterns = [
    # Inclure les routes du router
    path('calculator/', include(router.urls)),
    
    # Routes additionnelles
    path('calculator/savings-goal/', SavingsGoalView.as_view(), name='savings-goal'),
    path('calculator/calculate/', FinancialCalculatorView.as_view(), name='financial-calculate'),
    path('calculator/user-data/', UserFinancialDataView.as_view(), name='user-financial-data'),
    path('calculator/history/', CalculationHistoryView.as_view(), name='calculation-history'),
]