// services/calculatorService.js
import api from '../api/axios';


const CALCULATOR_BASE_URL = '/api/calculator';

export const calculatorService = {
  // ===== Gestion des sources de revenus =====
  
  // Récupérer toutes les sources de revenus
  getIncomeSources: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/income-sources/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus:', error);
      throw error;
    }
  },

  // Créer une nouvelle source de revenus
  createIncomeSource: async (incomeData) => {
    try {
      const response = await api.post(`${CALCULATOR_BASE_URL}/income-sources/`, incomeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du revenu:', error);
      throw error;
    }
  },

  // Mettre à jour une source de revenus
  updateIncomeSource: async (id, incomeData) => {
    try {
      const response = await api.put(`${CALCULATOR_BASE_URL}/income-sources/${id}/`, incomeData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du revenu:', error);
      throw error;
    }
  },

  // Supprimer une source de revenus
  deleteIncomeSource: async (id) => {
    try {
      await api.delete(`${CALCULATOR_BASE_URL}/income-sources/${id}/`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du revenu:', error);
      throw error;
    }
  },

  // ===== Gestion des dépenses =====
  
  // Récupérer toutes les dépenses
  getExpenses: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/expenses/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw error;
    }
  },

  // Créer une nouvelle dépense
  createExpense: async (expenseData) => {
    try {
      const response = await api.post(`${CALCULATOR_BASE_URL}/expenses/`, expenseData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la dépense:', error);
      throw error;
    }
  },

  // Mettre à jour une dépense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await api.put(`${CALCULATOR_BASE_URL}/expenses/${id}/`, expenseData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense:', error);
      throw error;
    }
  },

  // Supprimer une dépense
  deleteExpense: async (id) => {
    try {
      await api.delete(`${CALCULATOR_BASE_URL}/expenses/${id}/`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
      throw error;
    }
  },

  // ===== Gestion des catégories de dépenses =====
  
  // Récupérer toutes les catégories
  getExpenseCategories: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/expense-categories/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  // ===== Gestion des objectifs d'épargne =====
  
  // Récupérer l'objectif d'épargne
  getSavingsGoal: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/savings-goal/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'objectif d\'épargne:', error);
      throw error;
    }
  },

  // Créer ou mettre à jour l'objectif d'épargne
  saveSavingsGoal: async (goalData) => {
    try {
      const response = await api.post(`${CALCULATOR_BASE_URL}/savings-goal/`, goalData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'objectif d\'épargne:', error);
      throw error;
    }
  },

  // ===== Calculs financiers =====
  
  // Effectuer les calculs financiers
  calculateFinancials: async () => {
    try {
      const response = await api.post(`${CALCULATOR_BASE_URL}/calculate/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors des calculs financiers:', error);
      throw error;
    }
  },

  // ===== Données utilisateur complètes =====
  
  // Récupérer toutes les données financières de l'utilisateur
  getUserFinancialData: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/user-data/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      throw error;
    }
  },

  // ===== Historique des calculs =====
  
  // Récupérer l'historique des calculs
  getCalculationHistory: async () => {
    try {
      const response = await api.get(`${CALCULATOR_BASE_URL}/history/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  // ===== Fonctions utilitaires =====
  
  // Synchroniser les données locales avec le serveur
  syncData: async (localData) => {
    try {
      const { incomeInputs, expenseInputs, savingsGoal } = localData;
      
      // Synchroniser les revenus
      for (const income of incomeInputs) {
        if (income.id && income.id > 0) {
          await calculatorService.updateIncomeSource(income.id, {
            name: income.name,
            amount: income.amount
          });
        } else {
          await calculatorService.createIncomeSource({
            name: income.name,
            amount: income.amount
          });
        }
      }
      
      // Synchroniser les dépenses
      for (const expense of expenseInputs) {
        if (expense.id && expense.id > 0) {
          await calculatorService.updateExpense(expense.id, {
            name: expense.name,
            amount: expense.amount,
            category: expense.categoryId || 1
          });
        } else {
          await calculatorService.createExpense({
            name: expense.name,
            amount: expense.amount,
            category: expense.categoryId || 1
          });
        }
      }
      
      // Synchroniser l'objectif d'épargne
      await calculatorService.saveSavingsGoal({
        target_amount: savingsGoal.targetAmount,
        timeframe_months: savingsGoal.timeframe
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  }
};

export default calculatorService;