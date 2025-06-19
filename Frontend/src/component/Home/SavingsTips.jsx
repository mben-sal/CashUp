import { useState } from 'react';

const SavingsTips = () => {
  const [savingsTips] = useState([
    { 
      title: 'Règle 50/30/20', 
      description: 'Allouez 50% aux besoins, 30% aux envies et 20% à l\'épargne.' 
    },
    { 
      title: 'Épargne automatique', 
      description: 'Programmez un virement mensuel dès réception du salaire.' 
    },
    { 
      title: 'Fonds d\'urgence', 
      description: 'Épargnez l\'équivalent de 3 à 6 mois de dépenses.' 
    },
  ]);

  return (
    <div className="space-y-6">
      {savingsTips.map((tip, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-all">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{tip.title}</p>
            <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavingsTips;