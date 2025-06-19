// 🔥 FONCTION POUR NOTIFIER LE PROFIL DES CHANGEMENTS
  const notifyProfileUpdate = () => {
    localStorage.setItem('calculatorDataChanged', Date.now().toString());
    console.log('🔔 Profil notifié des changements');
  };import React, { useState, useEffect } from 'react';
import { Save, Calculator, History, AlertCircle, CheckCircle } from 'lucide-react';

const SavingsCalculatorWithAPI = () => {
  // États pour les données
  const [incomeInputs, setIncomeInputs] = useState([]);
  const [expenseInputs, setExpenseInputs] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState({
    targetAmount: 0,
    timeframe: 12,
  });

  // États pour les calculs
  const [calculatedValues, setCalculatedValues] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    potentialSavings: 0,
    monthlySavingsNeeded: 0,
    savingsRate: 0,
    recommendations: [],
    isGoalAchievable: false,
    monthsToGoal: null
  });

  // États pour l'interface
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  // 🔥 FONCTION POUR SAUVEGARDER LES RÉSULTATS DANS LE PROFIL
  const saveResultsToProfile = async () => {
    if (calculatedValues.totalIncome === 0) {
      showMessage('Aucun résultat à sauvegarder. Effectuez d\'abord un calcul.', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        // Données financières
        totalIncome: calculatedValues.totalIncome,
        totalExpenses: calculatedValues.totalExpenses,
        potentialSavings: calculatedValues.potentialSavings,
        savingsRate: calculatedValues.savingsRate,
        monthlySavingsNeeded: calculatedValues.monthlySavingsNeeded,
        
        // Objectif d'épargne
        savingsGoal: savingsGoal.targetAmount,
        timeframe: savingsGoal.timeframe,
        
        // Détails
        incomeSourcesCount: incomeInputs.length,
        expensesCount: expenseInputs.length,
        recommendations: calculatedValues.recommendations,
        isGoalAchievable: calculatedValues.isGoalAchievable,
        monthsToGoal: calculatedValues.monthsToGoal,
        
        // Métadonnées
        calculatedAt: new Date().toISOString(),
        version: '1.0'
      };

      const result = await mockApiService.saveToProfile(dataToSave);
      
      if (result.success) {
        showMessage('✅ Résultats sauvegardés dans votre profil !', 'success');
        notifyProfileUpdate();
        
        // Optionnel : rediriger vers le profil après sauvegarde
        // setTimeout(() => {
        //   window.location.href = '/profile';
        // }, 1500);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      showMessage('Erreur lors de la sauvegarde. Veuillez réessayer.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Simulation d'un service API (remplacez par votre vrai service)
  const mockApiService = {
    getUserFinancialData: async () => {
      return {
        income_sources: [
          { id: 1, name: 'Salaire principal', amount: 3000 },
          { id: 2, name: 'Revenus secondaires', amount: 500 }
        ],
        expenses: [
          { id: 1, name: 'Loyer/Crédit immobilier', amount: 1000, category: 1, category_name: 'Logement' },
          { id: 2, name: 'Charges', amount: 200, category: 1, category_name: 'Logement' },
          { id: 3, name: 'Alimentation', amount: 400, category: 2, category_name: 'Quotidien' }
        ],
        expense_categories: [
          { id: 1, name: 'Logement' },
          { id: 2, name: 'Quotidien' },
          { id: 3, name: 'Loisirs' },
          { id: 4, name: 'Obligatoire' },
          { id: 5, name: 'Autre' }
        ],
        savings_goal: { target_amount: 10000, timeframe_months: 12 }
      };
    },

    calculateFinancials: async () => {
      const totalIncome = incomeInputs.reduce((sum, income) => sum + Number(income.amount), 0);
      const totalExpenses = expenseInputs.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const potentialSavings = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (potentialSavings / totalIncome) * 100 : 0;
      const monthlySavingsNeeded = savingsGoal.targetAmount / savingsGoal.timeframe;

      return {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        potential_savings: potentialSavings,
        savings_rate: savingsRate,
        monthly_savings_needed: monthlySavingsNeeded,
        recommendations: [
          'Mettez en place un versement automatique vers un compte épargne',
          'Essayez de viser une épargne d\'au moins 10% de vos revenus'
        ],
        is_goal_achievable: potentialSavings >= monthlySavingsNeeded,
        months_to_goal: potentialSavings > 0 ? Math.ceil(savingsGoal.targetAmount / potentialSavings) : null
      };
    },

    syncData: async () => {
      return { success: true };
    },

    // 🔥 NOUVELLE FONCTION POUR SAUVEGARDER DANS LE PROFIL
    saveToProfile: async (data) => {
      // Simuler l'appel API pour sauvegarder
      console.log('💾 Sauvegarde des données dans le profil:', data);
      
      // Sauvegarder dans localStorage pour le profil
      const profileData = {
        ...data,
        savedAt: new Date().toISOString(),
        id: Date.now() // ID unique pour cette sauvegarde
      };
      
      // Récupérer les sauvegardes existantes
      const existingSaves = JSON.parse(localStorage.getItem('profileFinancialSaves') || '[]');
      
      // Ajouter la nouvelle sauvegarde (garder les 5 dernières)
      const updatedSaves = [profileData, ...existingSaves].slice(0, 5);
      
      localStorage.setItem('profileFinancialSaves', JSON.stringify(updatedSaves));
      localStorage.setItem('latestFinancialSave', JSON.stringify(profileData));
      
      // Notifier le profil
      localStorage.setItem('profileDataUpdated', Date.now().toString());
      
      return { success: true, savedData: profileData };
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await mockApiService.getUserFinancialData();
      
      // Mapper les données API vers le format local
      setIncomeInputs(data.income_sources.map(income => ({
        id: income.id,
        name: income.name,
        amount: Number(income.amount)
      })));

      setExpenseInputs(data.expenses.map(expense => ({
        id: expense.id,
        name: expense.name,
        amount: Number(expense.amount),
        category: expense.category_name,
        categoryId: expense.category
      })));

      setExpenseCategories(data.expense_categories);

      if (data.savings_goal) {
        setSavingsGoal({
          targetAmount: Number(data.savings_goal.target_amount),
          timeframe: data.savings_goal.timeframe_months
        });
      }

      showMessage('Données chargées avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showMessage('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const results = await mockApiService.calculateFinancials();
      
      setCalculatedValues({
        totalIncome: results.total_income,
        totalExpenses: results.total_expenses,
        potentialSavings: results.potential_savings,
        savingsRate: results.savings_rate,
        monthlySavingsNeeded: results.monthly_savings_needed,
        recommendations: results.recommendations,
        isGoalAchievable: results.is_goal_achievable,
        monthsToGoal: results.months_to_goal
      });

      showMessage('Calculs effectués avec succès', 'success');
      notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
    } catch (error) {
      console.error('Erreur lors des calculs:', error);
      showMessage('Erreur lors des calculs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setLoading(true);
    try {
      await mockApiService.syncData();
      showMessage('Données synchronisées avec succès', 'success');
      notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      showMessage('Erreur lors de la synchronisation', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GESTION DES REVENUS AVEC NOTIFICATION
  const handleIncomeChange = (id, field, value) => {
    setIncomeInputs(prev => prev.map(income => 
      income.id === id ? { ...income, [field]: field === 'amount' ? Number(value) || 0 : value } : income
    ));
    // Notifier seulement pour les changements de montant
    if (field === 'amount') {
      notifyProfileUpdate();
    }
  };

  const addIncomeSource = () => {
    const newId = Math.max(0, ...incomeInputs.map(i => i.id)) + 1;
    setIncomeInputs(prev => [...prev, { id: newId, name: 'Nouveau revenu', amount: 0 }]);
    notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
  };

  const removeIncome = (id) => {
    setIncomeInputs(prev => prev.filter(income => income.id !== id));
    notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
  };

  // 🔥 GESTION DES DÉPENSES AVEC NOTIFICATION
  const handleExpenseChange = (id, field, value) => {
    setExpenseInputs(prev => prev.map(expense => 
      expense.id === id ? { 
        ...expense, 
        [field]: field === 'amount' ? Number(value) || 0 : value,
        ...(field === 'categoryId' && { category: expenseCategories.find(cat => cat.id === Number(value))?.name })
      } : expense
    ));
    // Notifier seulement pour les changements de montant ou catégorie
    if (field === 'amount' || field === 'categoryId') {
      notifyProfileUpdate();
    }
  };

  const addExpense = () => {
    const newId = Math.max(0, ...expenseInputs.map(e => e.id)) + 1;
    const defaultCategory = expenseCategories[0] || { id: 1, name: 'Autre' };
    setExpenseInputs(prev => [...prev, { 
      id: newId, 
      name: 'Nouvelle dépense', 
      amount: 0, 
      category: defaultCategory.name,
      categoryId: defaultCategory.id
    }]);
    notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
  };

  const removeExpense = (id) => {
    setExpenseInputs(prev => prev.filter(expense => expense.id !== id));
    notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
  };

  // 🔥 GESTION OBJECTIF D'ÉPARGNE AVEC NOTIFICATION
  const handleSavingsGoalChange = (field, value) => {
    setSavingsGoal(prev => ({...prev, [field]: value}));
    notifyProfileUpdate(); // 🔥 NOTIFIER LE PROFIL
  };

  // Grouper les dépenses par catégorie
  const expensesByCategory = expenseInputs.reduce((acc, expense) => {
    const category = expense.category || 'Autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">Calculateur d'Épargne</h1>
      </div>

      {/* Message de statut */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenus */}
        <div>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Revenus Mensuels</h2>
            {incomeInputs.map((income) => (
              <div key={income.id} className="mb-3 flex items-center">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={income.name}
                    onChange={(e) => handleIncomeChange(income.id, 'name', e.target.value)}
                    onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                    className="w-full p-2 border rounded mb-1"
                  />
                  <div className="flex">
                    <input
                      type="number"
                      value={income.amount || ''}
                      onChange={(e) => handleIncomeChange(income.id, 'amount', e.target.value)}
                      onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                      className="p-2 border rounded w-full"
                      placeholder="0"
                    />
                    <span className="ml-2 flex items-center">€</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeIncome(income.id)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              onClick={addIncomeSource}
              className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              + Ajouter un revenu
            </button>
          </div>

          {/* Objectif d'épargne */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Objectif d'Épargne</h2>
            <div className="mb-3">
              <label className="block mb-1">Montant cible (€)</label>
              <input
                type="number"
                value={savingsGoal.targetAmount || ''}
                onChange={(e) => handleSavingsGoalChange('targetAmount', Number(e.target.value) || 0)}
                onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                className="p-2 border rounded w-full"
                placeholder="0"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Durée (mois)</label>
              <input
                type="number"
                value={savingsGoal.timeframe}
                onChange={(e) => handleSavingsGoalChange('timeframe', parseInt(e.target.value) || 1)}
                onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                className="p-2 border rounded w-full"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Dépenses */}
        <div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Dépenses Mensuelles</h2>
            
            {Object.entries(expensesByCategory).map(([category, expenses]) => (
              <div key={category} className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
                {expenses.map((expense) => (
                  <div key={expense.id} className="mb-3 flex items-center">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={expense.name}
                        onChange={(e) => handleExpenseChange(expense.id, 'name', e.target.value)}
                        onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                        className="w-full p-2 border rounded mb-1"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={expense.amount || ''}
                          onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                          onBlur={() => notifyProfileUpdate()} // 🔥 NOTIFIER EN FIN D'ÉDITION
                          className="p-2 border rounded flex-grow"
                          placeholder="0"
                        />
                        <select
                          value={expense.categoryId || ''}
                          onChange={(e) => handleExpenseChange(expense.id, 'categoryId', e.target.value)}
                          className="p-2 border rounded"
                        >
                          {expenseCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <span className="flex items-center">€</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeExpense(expense.id)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ))}
            
            <button 
              onClick={addExpense}
              className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
            >
              + Ajouter une dépense
            </button>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="mt-8 flex justify-center gap-4">
        <button 
          onClick={handleCalculate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Calculator className="w-5 h-5" />
          {loading ? 'Calcul en cours...' : 'Calculer'}
        </button>
        
        {/* 🔥 NOUVEAU BOUTON POUR SAUVEGARDER DANS LE PROFIL */}
        {calculatedValues.totalIncome > 0 && (
          <button 
            onClick={saveResultsToProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder dans le profil'}
          </button>
        )}
      </div>

      {/* Résultats */}
      {calculatedValues.totalIncome > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Résultats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-700">Revenu Total</h3>
              <p className="text-2xl font-bold text-blue-600">{calculatedValues.totalIncome.toFixed(2)} €</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-700">Dépenses Totales</h3>
              <p className="text-2xl font-bold text-red-600">{calculatedValues.totalExpenses.toFixed(2)} €</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="text-lg font-medium text-gray-700">Épargne Potentielle</h3>
              <p className={`text-2xl font-bold ${calculatedValues.potentialSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedValues.potentialSavings.toFixed(2)} €
              </p>
            </div>
          </div>

          {/* Recommandations et actions */}
          {calculatedValues.recommendations.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Recommandations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {calculatedValues.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600 text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
              
              {/* 🔥 NOUVELLE SECTION RÉSUMÉ POUR SAUVEGARDE */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Résumé de votre situation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux d'épargne:</span>
                    <span className={`font-semibold ${calculatedValues.savingsRate >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {calculatedValues.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objectif atteignable:</span>
                    <span className={`font-semibold ${calculatedValues.isGoalAchievable ? 'text-green-600' : 'text-red-600'}`}>
                      {calculatedValues.isGoalAchievable ? '✅ Oui' : '❌ Non'}
                    </span>
                  </div>
                  {calculatedValues.monthsToGoal && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temps pour l'objectif:</span>
                      <span className="font-semibold text-blue-600">
                        {calculatedValues.monthsToGoal} mois
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-700">
                      💡 Sauvegardez ces résultats pour les retrouver dans votre profil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavingsCalculatorWithAPI;