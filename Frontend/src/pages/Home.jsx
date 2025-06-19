import React, { useState, useEffect } from 'react';
import { PiggyBank, Coins, Target, TrendingUp, Gift, Zap, Star, Trophy, Medal, Crown, Rocket } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SavingsDashboardGame = () => {
  // États du jeu
  const [playerData, setPlayerData] = useState({
    coins: 150,
    savings: 450,
    level: 3,
    streak: 5,
    totalEarned: 1200,
    xp: 750,
    achievements: ['first_save', 'week_streak'],
    dailyGoalProgress: 65
  });

  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCelebration, setShowCelebration] = useState(false);

  // Données pour les graphiques (intégration de vos composants existants)
  const chartData = {
    labels: ['25 Mai', '26 Mai', '27 Mai', '28 Mai', '29 Mai', '30 Mai'],
    datasets: [{
      data: [400, 450, 470, 520, 550, 580],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4
    }]
  };

  const pieData = {
    labels: ['Épargne de précaution', 'Projets', 'Investissements'],
    datasets: [{
      data: [3200, 2800, 1500],
      backgroundColor: ['#10B981', '#60A5FA', '#8B5CF6'],
    }]
  };

  // Défis avancés avec catégories
  const challenges = [
    {
      id: 1,
      title: "Maître de l'épargne",
      description: "Épargnez 50€ cette semaine",
      reward: 200,
      xp: 100,
      category: "weekly",
      icon: "👑",
      difficulty: "hard",
      tip: "Réduisez vos sorties restaurant de moitié cette semaine"
    },
    {
      id: 2,
      title: "Budget ninja",
      description: "Respectez votre budget pendant 3 jours",
      reward: 75,
      xp: 50,
      category: "daily",
      icon: "🥷",
      difficulty: "medium",
      tip: "Utilisez une app pour tracker chaque dépense"
    },
    {
      id: 3,
      title: "Chasseur de bonnes affaires",
      description: "Trouvez 3 bons plans aujourd'hui",
      reward: 50,
      xp: 30,
      category: "daily",
      icon: "🎯",
      difficulty: "easy",
      tip: "Comparez les prix avant d'acheter"
    },
    {
      id: 4,
      title: "Investisseur débutant",
      description: "Apprenez sur les placements pendant 30 min",
      reward: 100,
      xp: 75,
      category: "learning",
      icon: "📚",
      difficulty: "medium",
      tip: "Commencez par comprendre le livret A et l'assurance vie"
    },
    {
      id: 5,
      title: "Objectif mensuel",
      description: "Atteignez votre objectif d'épargne du mois",
      reward: 300,
      xp: 200,
      category: "monthly",
      icon: "🚀",
      difficulty: "hard",
      tip: "Décomposez votre objectif en petites étapes quotidiennes"
    }
  ];

  // Récompenses et niveaux
  const levels = [
    { level: 1, name: "Épargnant débutant", xpRequired: 0, reward: "🌱" },
    { level: 2, name: "Économe confirmé", xpRequired: 200, reward: "🌿" },
    { level: 3, name: "Maître Budget", xpRequired: 500, reward: "🌳" },
    { level: 4, name: "Expert Épargne", xpRequired: 1000, reward: "💎" },
    { level: 5, name: "Légende Financière", xpRequired: 2000, reward: "👑" }
  ];

  // Achievements système
  const achievements = [
    { id: 'first_save', name: 'Premier pas', description: 'Première épargne réalisée', icon: '🎯', unlocked: true },
    { id: 'week_streak', name: 'Semaine parfaite', description: '7 jours de suite', icon: '🔥', unlocked: true },
    { id: 'budget_master', name: 'Maître du budget', description: 'Budget respecté 30 jours', icon: '👑', unlocked: false },
    { id: 'savings_hero', name: 'Héros épargne', description: '1000€ épargnés', icon: '⭐', unlocked: false },
    { id: 'investment_guru', name: 'Gourou investissement', description: 'Premier placement réalisé', icon: '💰', unlocked: false }
  ];

  // Conseils d'épargne par catégorie
  const savingsTips = [
    { 
      title: 'Règle 50/30/20', 
      description: 'Allouez 50% aux besoins, 30% aux envies et 20% à l\'épargne.',
      category: 'budget',
      icon: '📊'
    },
    { 
      title: 'Épargne automatique', 
      description: 'Programmez un virement mensuel dès réception du salaire.',
      category: 'automation',
      icon: '🔄'
    },
    { 
      title: 'Fonds d\'urgence', 
      description: 'Épargnez l\'équivalent de 3 à 6 mois de dépenses.',
      category: 'emergency',
      icon: '🛡️'
    },
    {
      title: 'Comparer avant d\'acheter',
      description: 'Utilisez des comparateurs de prix pour chaque achat important.',
      category: 'shopping',
      icon: '🔍'
    }
  ];

  // Fonctions du jeu
  const completeChallenge = (challenge) => {
    const newCoins = playerData.coins + challenge.reward;
    const newXp = playerData.xp + challenge.xp;
    const newStreak = playerData.streak + 1;
    
    // Vérifier montée de niveau
    const currentLevelData = levels.find(l => l.level === playerData.level);
    const nextLevelData = levels.find(l => l.level === playerData.level + 1);
    const shouldLevelUp = nextLevelData && newXp >= nextLevelData.xpRequired;

    setPlayerData(prev => ({
      ...prev,
      coins: newCoins,
      xp: newXp,
      streak: newStreak,
      level: shouldLevelUp ? prev.level + 1 : prev.level,
      totalEarned: prev.totalEarned + challenge.reward
    }));

    if (shouldLevelUp) {
      setGameMessage(`🎉 NIVEAU SUPÉRIEUR ! Vous êtes maintenant ${nextLevelData.name} ! ${nextLevelData.reward}`);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setGameMessage(`✅ Défi "${challenge.title}" réussi ! +${challenge.reward} pièces, +${challenge.xp} XP`);
    }

    // Bonus de streak
    if (newStreak % 7 === 0) {
      setPlayerData(prev => ({
        ...prev,
        coins: prev.coins + 100
      }));
      setGameMessage(prev => prev + ' 🔥 Bonus hebdomadaire : +100 pièces !');
    }

    setTimeout(() => setGameMessage(''), 4000);
    generateChallenge();
  };

  const generateChallenge = () => {
    const availableChallenges = challenges.filter(c => c.id !== currentChallenge?.id);
    const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    setCurrentChallenge(randomChallenge);
  };

  const buyPowerUp = (cost, benefit) => {
    if (playerData.coins >= cost) {
      setPlayerData(prev => ({
        ...prev,
        coins: prev.coins - cost,
        [benefit.type]: prev[benefit.type] + benefit.amount
      }));
      setGameMessage(`💎 Power-up acheté ! ${benefit.description}`);
      setTimeout(() => setGameMessage(''), 3000);
    }
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const getCurrentLevel = () => {
    return levels.find(l => l.level === playerData.level) || levels[0];
  };

  const getNextLevel = () => {
    return levels.find(l => l.level === playerData.level + 1);
  };

  const getXpProgress = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const currentLevelXp = currentLevel.xpRequired;
    const nextLevelXp = nextLevel.xpRequired;
    const playerXp = playerData.xp;
    
    return ((playerXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
      {/* Header avec stats du joueur */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 border border-emerald-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <PiggyBank className="w-8 h-8 text-emerald-600" />
              Centre d'Épargne Gamifié
              {showCelebration && <div className="animate-bounce">🎉</div>}
            </h1>
            <p className="text-gray-600">Transformez votre épargne en aventure !</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{getCurrentLevel().reward}</div>
            <div className="text-sm text-gray-500">{getCurrentLevel().name}</div>
          </div>
        </div>

        {/* Stats du joueur */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-xl text-white text-center">
            <Coins className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{playerData.coins}</div>
            <div className="text-xs opacity-90">Pièces</div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 p-3 rounded-xl text-white text-center">
            <PiggyBank className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{playerData.savings}€</div>
            <div className="text-xs opacity-90">Épargne</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-3 rounded-xl text-white text-center">
            <Star className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{playerData.level}</div>
            <div className="text-xs opacity-90">Niveau</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-3 rounded-xl text-white text-center">
            <div className="w-6 h-6 mx-auto mb-1 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm">🔥</div>
            <div className="text-xl font-bold">{playerData.streak}</div>
            <div className="text-xs opacity-90">Série</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 rounded-xl text-white text-center">
            <Zap className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{playerData.xp}</div>
            <div className="text-xs opacity-90">XP</div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-3 rounded-xl text-white text-center">
            <Target className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{playerData.dailyGoalProgress}%</div>
            <div className="text-xs opacity-90">Objectif</div>
          </div>
        </div>

        {/* Barre XP */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{getCurrentLevel().name}</span>
            <span>{getNextLevel() ? getNextLevel().name : 'MAX'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getXpProgress()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {getNextLevel() ? `${getNextLevel().xpRequired - playerData.xp} XP jusqu'au niveau suivant` : 'Niveau maximum atteint !'}
          </div>
        </div>
      </div>

      {/* Message du jeu */}
      {gameMessage && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl text-center font-bold text-lg shadow-lg">
          {gameMessage}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {['dashboard', 'challenges', 'achievements', 'shop'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-emerald-50'
            }`}
          >
            {tab === 'dashboard' && '📊 Dashboard'}
            {tab === 'challenges' && '🎯 Défis'}
            {tab === 'achievements' && '🏆 Succès'}
            {tab === 'shop' && '🛍️ Boutique'}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique de progression (votre SavingsChart) */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Progression d'Épargne
            </h3>
            <div className="h-64">
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { callback: (value) => value + '€' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Répartition épargne (votre SavingsDistribution) */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Répartition Épargne
            </h3>
            <div className="h-64">
              <Pie 
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { usePointStyle: true }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Conseils d'épargne (votre SavingsTips amélioré) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Conseils d'Épargne du Jour
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all">
                  <div className="text-2xl">{tip.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{tip.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">
                      {tip.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Défi actuel */}
          {currentChallenge && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-300">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">🎯 Défi du Moment</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{currentChallenge.icon}</div>
                <div className="flex-grow">
                  <h4 className="font-bold text-lg text-gray-800">{currentChallenge.title}</h4>
                  <p className="text-gray-600">{currentChallenge.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentChallenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      currentChallenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentChallenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {currentChallenge.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-600 font-bold">+{currentChallenge.reward} 🪙</div>
                  <div className="text-purple-600 font-bold">+{currentChallenge.xp} XP</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">💡 {currentChallenge.tip}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => completeChallenge(currentChallenge)}
                  className="flex-grow bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
                >
                  ✅ Réalisé !
                </button>
                <button
                  onClick={generateChallenge}
                  className="bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-all"
                >
                  🔄 Nouveau
                </button>
              </div>
            </div>
          )}

          {/* Liste des défis */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">📋 Tous les Défis</h3>
            <div className="space-y-3">
              {challenges.map(challenge => (
                <div key={challenge.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-800">{challenge.title}</div>
                    <div className="text-sm text-gray-600">{challenge.description}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-yellow-600">+{challenge.reward} 🪙</div>
                    <div className="text-purple-600">+{challenge.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Vos Succès
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-bold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="mt-2 text-xs text-yellow-600 font-medium">✅ Débloqué</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shop' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6" />
            Boutique des Power-Ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-gray-800">Boost XP</h4>
                <p className="text-sm text-gray-600 mt-1">Double XP pendant 1 heure</p>
                <button 
                  onClick={() => buyPowerUp(50, {type: 'xp', amount: 100, description: 'Boost XP activé !'})}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  50 🪙
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-bold text-gray-800">Bonus Épargne</h4>
                <p className="text-sm text-gray-600 mt-1">+10€ d'épargne bonus</p>
                <button 
                  onClick={() => buyPowerUp(100, {type: 'savings', amount: 10, description: 'Épargne boostée !'})}
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  100 🪙
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-bold text-gray-800">Objectif Facile</h4>
                <p className="text-sm text-gray-600 mt-1">Réduire l'objectif du jour</p>
                <button 
                  onClick={() => buyPowerUp(75, {type: 'dailyGoalProgress', amount: 25, description: 'Objectif facilité !'})}
                  className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  75 🪙
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsDashboardGame;