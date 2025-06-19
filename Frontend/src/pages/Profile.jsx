import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import player_ from '../assets/src/player_.svg';
import { MoreVertical, Calculator, PiggyBank, TrendingUp, Wallet, DollarSign, Save, Clock, Target } from "lucide-react";
import Friends from '../component/profile/Friends';
import UserInfo from '../component/profile/UserInfo';
import Achievements from '../component/profile/Achievements';
import { useUser } from '../contexts/UserContext';
import coverImage from '../assets/src/cover_1.jpg';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import api from '../api/axios';

const Profile = () => {
  const { intraId } = useParams();
  const { user, updateUser, fetchUserProfile, normalizeAvatarUrl } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(player_);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const profileInputRef = useRef(null);
  const isOwnProfile = !intraId || (user && user.intra_id === intraId);
  
  // États pour les données financières
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    potentialSavings: 0,
    savingsGoal: 0,
    timeframe: 12,
    savingsProgress: 0,
    monthlySavingsNeeded: 0,
    hasData: false
  });
  const [loadingFinancial, setLoadingFinancial] = useState(false);
  
  // 🔥 NOUVEAU : État pour les données sauvegardées
  const [savedFinancialData, setSavedFinancialData] = useState(null);
  const [allSavedData, setAllSavedData] = useState([]);

  // Fonction pour normaliser les URLs d'avatars
  const normalizeAvatar = (avatar) => {
    if (normalizeAvatarUrl) return normalizeAvatarUrl(avatar);
    
    if (!avatar) return player_;
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('/media')) return `https://localhost${avatar}`;
    if (avatar.startsWith('./media')) return `https://localhost${avatar.substring(1)}`;
    return `https://localhost/media/${avatar}`;
  };

  // 🔥 NOUVELLE FONCTION : Charger les données sauvegardées
  const loadSavedFinancialData = () => {
    try {
      // Charger la dernière sauvegarde
      const latestSave = localStorage.getItem('latestFinancialSave');
      if (latestSave) {
        const parsedData = JSON.parse(latestSave);
        setSavedFinancialData(parsedData);
        console.log('📊 Données sauvegardées trouvées:', parsedData);
        
        // Fusionner avec les données financières existantes
        setFinancialData(prev => ({
          ...prev,
          totalIncome: parsedData.totalIncome || prev.totalIncome,
          totalExpenses: parsedData.totalExpenses || prev.totalExpenses,
          potentialSavings: parsedData.potentialSavings || prev.potentialSavings,
          savingsGoal: parsedData.savingsGoal || prev.savingsGoal,
          timeframe: parsedData.timeframe || prev.timeframe,
          savingsProgress: parsedData.savingsGoal > 0 ? 
            Math.min((parsedData.potentialSavings / parsedData.savingsGoal) * 100, 100) : 0,
          monthlySavingsNeeded: parsedData.monthlySavingsNeeded || prev.monthlySavingsNeeded,
          hasData: true
        }));
      }
      
      // Charger toutes les sauvegardes pour l'historique
      const allSaves = localStorage.getItem('profileFinancialSaves');
      if (allSaves) {
        const parsedSaves = JSON.parse(allSaves);
        setAllSavedData(parsedSaves);
      }
      
      return !!latestSave;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données sauvegardées:', error);
      return false;
    }
  };

  // Fonction principale pour charger les données financières
  const loadFinancialData = async () => {
    if (!isOwnProfile) return;
    
    try {
      setLoadingFinancial(true);
      console.log('🔄 Chargement des données financières...');
      
      // 🔥 D'ABORD ESSAYER DE CHARGER LES DONNÉES SAUVEGARDÉES
      const hasSavedData = loadSavedFinancialData();
      
      // Ensuite essayer l'API
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost/api/calculator/user-data/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (hasSavedData) {
          console.log('📊 Utilisation des données sauvegardées en fallback');
          return; // Utiliser les données sauvegardées si l'API échoue
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Données API reçues:', data);
      
      // Si pas de données API mais des données sauvegardées, les conserver
      if ((!data.income_sources || data.income_sources.length === 0) && 
          (!data.expenses || data.expenses.length === 0) && 
          hasSavedData) {
        console.log('📊 Données API vides, conservation des données sauvegardées');
        return;
      }
      
      // Calculs des données API
      let totalIncome = 0;
      let totalExpenses = 0;
      
      if (data.income_sources && Array.isArray(data.income_sources)) {
        totalIncome = data.income_sources.reduce((sum, income) => {
          return sum + (parseFloat(income.amount) || 0);
        }, 0);
      }
      
      if (data.expenses && Array.isArray(data.expenses)) {
        totalExpenses = data.expenses.reduce((sum, expense) => {
          return sum + (parseFloat(expense.amount) || 0);
        }, 0);
      }
      
      const potentialSavings = totalIncome - totalExpenses;
      
      let savingsGoal = 0;
      let timeframe = 12;
      if (data.savings_goal) {
        savingsGoal = parseFloat(data.savings_goal.target_amount) || 0;
        timeframe = data.savings_goal.timeframe_months || 12;
      }
      
      const monthlySavingsNeeded = savingsGoal > 0 ? savingsGoal / timeframe : 0;
      const savingsProgress = savingsGoal > 0 ? Math.min((potentialSavings / savingsGoal) * 100, 100) : 0;
      
      const hasData = totalIncome > 0 || totalExpenses > 0 || 
                     (data.income_sources && data.income_sources.length > 0) || 
                     (data.expenses && data.expenses.length > 0) ||
                     hasSavedData;
      
      const newFinancialData = {
        totalIncome,
        totalExpenses,
        potentialSavings,
        savingsGoal,
        timeframe,
        savingsProgress,
        monthlySavingsNeeded,
        hasData
      };
      
      console.log('💰 Données finales calculées:', newFinancialData);
      setFinancialData(newFinancialData);
      
      localStorage.setItem('profileLastLoaded', Date.now().toString());
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      // En cas d'erreur, essayer de charger les données sauvegardées
      loadSavedFinancialData();
    } finally {
      setLoadingFinancial(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    const loadProfileData = async () => {
      if (isOwnProfile) {
        setProfileData(user);
        setProfileImage(normalizeAvatar(user?.avatar));
        // Charger les données financières
        await loadFinancialData();
        setIsLoading(false);
        return;
      }
  
      try {
        setError(null);
        const response = await api.get(`/users/${intraId}/`);
        
        if (response.status === 200) {
          const data = response.data;
          setProfileData(data);
          setProfileImage(normalizeAvatar(data.avatar));
        } else {
          throw new Error('Erreur lors du chargement du profil');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setError('Impossible de charger l\'utilisateur.');
        
        setTimeout(() => {
          navigate("/", { state: { error: "L'utilisateur n'existe pas ou n'est pas accessible." } });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadProfileData();
  }, [intraId, user, isOwnProfile, navigate]);

  // 🔥 ÉCOUTER LES CHANGEMENTS AVEC GESTION DES SAUVEGARDES
  useEffect(() => {
    if (!isOwnProfile) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page redevenue visible - rechargement...');
        setTimeout(() => loadFinancialData(), 500);
      }
    };

    const handleFocus = () => {
      console.log('🎯 Page refocalisée - rechargement...');
      setTimeout(() => loadFinancialData(), 500);
    };

    const handleStorageChange = (e) => {
      if (e.key === 'calculatorDataChanged' || 
          e.key === 'financialDataUpdated' || 
          e.key === 'profileDataUpdated' ||
          e.key === 'latestFinancialSave') {
        console.log('💾 Données du calculateur modifiées - rechargement...');
        loadFinancialData();
      }
    };

    // Vérifier périodiquement s'il faut recharger
    const intervalCheck = setInterval(() => {
      const lastCalculatorUpdate = localStorage.getItem('calculatorDataChanged');
      const lastProfileUpdate = localStorage.getItem('profileDataUpdated');
      const lastProfileLoad = localStorage.getItem('profileLastLoaded');
      
      if (lastProfileLoad) {
        const profileTime = parseInt(lastProfileLoad);
        
        if ((lastCalculatorUpdate && parseInt(lastCalculatorUpdate) > profileTime) ||
            (lastProfileUpdate && parseInt(lastProfileUpdate) > profileTime)) {
          console.log('🔄 Données obsolètes détectées - rechargement...');
          loadFinancialData();
        }
      }
    }, 10000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalCheck);
    };
  }, [isOwnProfile]);
  
  const handleProfileImageChange = async (event) => {
    if (!isOwnProfile) return;
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        const data = response.data;
        setProfileImage(normalizeAvatar(data.avatarUrl));
        await fetchUserProfile();
      } else {
        throw new Error('Échec du téléchargement de l\'image');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image de profil:', error);
      setError('Échec de la mise à jour de l\'image de profil. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const navigateToCalculator = () => {
    navigate('/calculator');
  };

  const handleSetGoal = () => {
    navigate('/set-goals');
  };

  const navigateToSavingsAnalytics = () => {
    navigate('/savings-analytics');
  };

  const refreshFinancialData = async () => {
    console.log('🔄 Actualisation manuelle...');
    await loadFinancialData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center">
          <p>{error}</p>
          <p className="mt-2 text-sm">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" onClick={() => setIsMoreOpen(false)}>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="relative h-48">
          {/* Image de couverture */}
          <div className="w-full h-full cursor-pointer relative group">
            <div className="w-full h-full bg-cover bg-center">
              <img
                src={coverImage}
                alt="Couverture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>

          {/* Menu d'options */}
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreOpen(!isMoreOpen);
                  }}
                  className="p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all"
                >
                  <MoreVertical className="w-6 h-6 text-white" />
                </button>
                
                {isMoreOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50" 
                       onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="flex items-center w-full px-4 py-2 hover:bg-emerald-50"
                      onClick={navigateToCalculator}
                    >
                      <Calculator className="w-4 h-4 mr-2 text-emerald-600" />
                      Calculateur d'épargne
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-2 hover:bg-emerald-50"
                      onClick={refreshFinancialData}
                      disabled={loadingFinancial}
                    >
                      <div className={`w-4 h-4 mr-2 ${loadingFinancial ? 'border-2 border-emerald-600 border-t-transparent rounded-full animate-spin' : ''}`}>
                        {!loadingFinancial && '🔄'}
                      </div>
                      Actualiser les données
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Image de profil */}
          <div className="absolute -bottom-16 left-6">
            <div 
              className={`relative ${isOwnProfile ? 'cursor-pointer' : ''} group`}
              onClick={() => isOwnProfile && !isUploading && profileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white relative">
                <img
                  src={profileImage}
                  alt="Profil"
                  className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = player_;
                  }}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl flex items-center justify-center">
                  <span className="text-white text-sm">
                    {isUploading ? 'Téléchargement...' : 'Changer la photo'}
                  </span>
                </div>
              )}
              {isOwnProfile && (
                <input
                  ref={profileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleProfileImageChange}
                  disabled={isUploading}
                />
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 px-6 pb-6">
          {/* Informations utilisateur */}
          <UserInfo userData={profileData} isOwnProfile={isOwnProfile} />
          
          {/* Section Épargne (Pour le profil de l'utilisateur connecté) */}
          {isOwnProfile && (
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-emerald-800 flex items-center">
                  <Wallet className="w-6 h-6 mr-2 text-emerald-600" />
                  Vue d'ensemble de mon épargne
                </h2>
                {loadingFinancial && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                )}
              </div>
              
              {/* 🔥 NOUVELLE SECTION : Données sauvegardées si disponibles */}
              {savedFinancialData && (
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-blue-800 flex items-center">
                      <Save className="w-5 h-5 mr-2" />
                      Dernière sauvegarde du calculateur
                    </h3>
                    <span className="text-sm text-blue-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(savedFinancialData.savedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div className="text-center bg-white p-3 rounded-lg">
                      <p className="text-blue-600 font-medium">Taux d'épargne</p>
                      <p className={`text-xl font-bold ${savedFinancialData.savingsRate >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                        {savedFinancialData.savingsRate?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg">
                      <p className="text-blue-600 font-medium">Sources revenus</p>
                      <p className="text-xl font-bold text-gray-700">{savedFinancialData.incomeSourcesCount}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg">
                      <p className="text-blue-600 font-medium">Postes dépenses</p>
                      <p className="text-xl font-bold text-gray-700">{savedFinancialData.expensesCount}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-lg">
                      <p className="text-blue-600 font-medium">Objectif</p>
                      <p className={`text-xl font-bold ${savedFinancialData.isGoalAchievable ? 'text-green-600' : 'text-red-600'}`}>
                        {savedFinancialData.isGoalAchievable ? '✅ Oui' : '❌ Non'}
                      </p>
                    </div>
                  </div>
                  
                  {savedFinancialData.recommendations && savedFinancialData.recommendations.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                      <p className="text-sm text-blue-700 font-medium mb-1 flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        Recommandation principale :
                      </p>
                      <p className="text-sm text-blue-600 bg-white p-2 rounded italic">
                        "{savedFinancialData.recommendations[0]}"
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Affichage conditionnel selon qu'il y a des données ou non */}
              {financialData.hasData ? (
                <>
                  {/* Statistiques principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Revenus mensuels</p>
                          <p className="text-2xl font-bold text-blue-800">{financialData.totalIncome.toFixed(2)}€</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-medium">Dépenses mensuelles</p>
                          <p className="text-2xl font-bold text-red-800">{financialData.totalExpenses.toFixed(2)}€</p>
                        </div>
                        <Wallet className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-600 font-medium">Épargne potentielle</p>
                          <p className={`text-2xl font-bold ${financialData.potentialSavings >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                            {financialData.potentialSavings.toFixed(2)}€
                          </p>
                        </div>
                        <PiggyBank className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Objectif d'épargne si défini */}
                  {financialData.savingsGoal > 0 && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium">Objectif d'épargne</span>
                        <span className="text-emerald-600 font-bold">
                          {financialData.savingsGoal.toFixed(2)}€ visé
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3 mb-2">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            financialData.savingsProgress >= 0 ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(Math.max(Math.abs(financialData.savingsProgress), 0), 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {financialData.savingsProgress >= 0 ? 
                            `${financialData.savingsProgress.toFixed(1)}% atteint` : 
                            `${Math.abs(financialData.savingsProgress).toFixed(1)}% de déficit`
                          }
                        </span>
                        <span>Cible: {financialData.monthlySavingsNeeded.toFixed(2)}€/mois</span>
                      </div>
                    </div>
                  )}
                  
                  {/* 🔥 NOUVELLE SECTION : Historique des sauvegardes */}
                  {allSavedData.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-gray-500" />
                        Historique des calculs
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {allSavedData.slice(0, 4).map((save, index) => (
                          <div key={save.id} className="bg-gray-50 p-3 rounded-lg border text-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700">
                                Calcul #{allSavedData.length - index}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(save.savedAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Épargne:</span>
                                <span className={`ml-1 font-semibold ${save.potentialSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {save.potentialSavings?.toFixed(0)}€
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Taux:</span>
                                <span className="ml-1 font-semibold text-blue-600">
                                  {save.savingsRate?.toFixed(1)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Objectif:</span>
                                <span className={`ml-1 ${save.isGoalAchievable ? 'text-green-600' : 'text-red-600'}`}>
                                  {save.isGoalAchievable ? '✅' : '❌'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Conseils rapides */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">💡 Conseil du jour</h3>
                    <p className="text-blue-700 text-sm">
                      {financialData.potentialSavings > 0 ? 
                        `Excellent ! Vous économisez ${financialData.potentialSavings.toFixed(2)}€ par mois. Continuez ainsi !` :
                        `Attention : vous dépensez ${Math.abs(financialData.potentialSavings).toFixed(2)}€ de plus que vos revenus.`
                      }
                    </p>
                  </div>
                </>
              ) : (
                /* État vide si pas de données */
                <div className="text-center py-12">
                  <Calculator className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Aucune donnée financière</h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par ajouter vos revenus et dépenses dans le calculateur d'épargne pour voir vos statistiques ici.
                  </p>
                  <button 
                    onClick={navigateToCalculator}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg"
                  >
                    🧮 Ouvrir le calculateur
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;