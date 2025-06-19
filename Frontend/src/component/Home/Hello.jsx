import { useUser } from '../../contexts/UserContext';
import Vector from '../../assets/src/image.png';

const Hello = () => {
 const { user } = useUser();

 if (!user) {
   return (
     <div className="rounded-xl p-5 shadow-lg animate-pulse">
       <div className="h-8 w-48 rounded mb-4 bg-gray-200"></div>
       <div className="h-6 w-64 rounded mb-6 bg-gray-200"></div>
       <div className="w-47 h-47 rounded bg-gray-200"></div>
     </div>
   );
 }

 return (
   <div>
     <h3 className="text-2xl font-bold text-emerald-800 mb-4">
       Bonjour{' '}
       <span className="inline-block bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent animate-[slideDown_1s_ease-out_1]">
         {user.intra_id || user.email}
       </span>
       <span className="ml-2 animate-bounce inline-block">👋</span>
     </h3>
     <div className="flex justify-between items-center">
       <div className="space-y-3">
         <p className="text-gray-600 font-semibold italic animate-[slideRight_1s_ease-out_1]">
           "Bienvenue ! 🌟 Construisons ensemble votre avenir financier .💸"
         </p>
         <p className="text-sm text-gray-500 animate-[slideDown_1s_ease-out_1]">
           Gérez mieux 🧮 Épargnez plus 💰 Votre avenir commence ici ! 📈 
         </p>
         <p className="text-xs text-emerald-500 font-bold animate-[slideLeft_1s_ease-out_1]">
           Remplissez vos infos pour commencer à épargner. 🎯
         </p>
       </div>
       <img 
         src={Vector} 
         alt="avatar" 
         className="w-21 h-20 hover:scale-110 transition-transform duration-300" 
       />
     </div>
   </div>
 );
};

export default Hello;