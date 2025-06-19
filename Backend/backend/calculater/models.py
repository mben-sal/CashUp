# calculater/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class IncomeSource(models.Model):
    """Modèle pour les sources de revenus"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='income_sources')
    name = models.CharField(max_length=100, default='Nouveau revenu')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.user.username} - {self.name}: {self.amount}€"

class ExpenseCategory(models.Model):
    """Catégories de dépenses prédéfinies"""
    name = models.CharField(max_length=50, unique=True)
    
    class Meta:
        verbose_name_plural = "Expense Categories"
    
    def __str__(self):
        return self.name

class Expense(models.Model):
    """Modèle pour les dépenses"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=100, default='Nouvelle dépense')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE, related_name='expenses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'id']

    def __str__(self):
        return f"{self.user.username} - {self.name}: {self.amount}€"

class SavingsGoal(models.Model):
    """Modèle pour les objectifs d'épargne"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='savings_goal')
    target_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    timeframe_months = models.PositiveIntegerField(default=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Objectif: {self.target_amount}€ en {self.timeframe_months} mois"

class CalculationResult(models.Model):
    """Modèle pour sauvegarder les résultats de calculs"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calculation_results')
    total_income = models.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2)
    potential_savings = models.DecimalField(max_digits=10, decimal_places=2)
    savings_rate = models.DecimalField(max_digits=5, decimal_places=2)  # Pourcentage
    monthly_savings_needed = models.DecimalField(max_digits=10, decimal_places=2)
    calculated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-calculated_at']

    def __str__(self):
        return f"{self.user.username} - Calcul du {self.calculated_at.strftime('%d/%m/%Y %H:%M')}"