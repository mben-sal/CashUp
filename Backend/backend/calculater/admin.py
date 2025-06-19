# calculater/admin.py
from django.contrib import admin
from .models import IncomeSource, Expense, ExpenseCategory, SavingsGoal, CalculationResult

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(IncomeSource)
class IncomeSourceAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'amount', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'amount', 'category', 'created_at']
    list_filter = ['category', 'created_at', 'updated_at']
    search_fields = ['user__username', 'name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(SavingsGoal)
class SavingsGoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'target_amount', 'timeframe_months', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(CalculationResult)
class CalculationResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_income', 'total_expenses', 'potential_savings', 'savings_rate', 'calculated_at']
    list_filter = ['calculated_at']
    search_fields = ['user__username']
    readonly_fields = ['calculated_at']