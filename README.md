# transcendence

- file app (routing / gestion d'authentification)

1 router principal

```
<Router>
    <Routes>
        {/* Routes définies ici */}
    </Routes>
</Router>

```

Vous utilisez BrowserRouter (alias Router) pour définir le conteneur principal qui gère l'historique et la navigation des pages.
Routes

2 routes pour l'authentification

<AuthLayout /> : Ce composant agit comme un wrapper pour les routes sous /auth. Les pages comme Login, ForgotPassword, et TwoFactor sont affichées dans ce contexte.
La route /auth/two-factor redirige vers /auth/login si l'utilisateur n'est pas authentifié (isAuthenticated === false).

3 Routes protégées

<ProtectedRoute /> : Vérifie si l'utilisateur est authentifié et redirige en conséquence :
Si l'utilisateur n'est pas authentifié, il est redirigé vers /auth/login.
Si l'utilisateur est authentifié mais que la vérification 2FA n'est pas terminée, il est redirigé vers /auth/two-factor.
Si toutes les conditions sont satisfaites, les routes enfants (comme /, /game, /chat, etc.) sont rendues dans le contexte de <DashboardLayout />.

\*/****************\*\*\*****************auth************\*\*************/\*

```
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  return !!localStorage.getItem('token');
});
const [is2FAVerified, setIs2FAVerified] = useState(false);
```

- isAuthenticated :

Indique si l'utilisateur est connecté ou non.
Vous pouvez utiliser des informations comme un token stocké dans localStorage pour initialiser cet état.
Si un utilisateur n'est pas authentifié, il est redirigé vers la page de connexion (/auth/login).

- is2FAVerified :

Vérifie si l'utilisateur a passé la vérification 2FA (authentification à deux facteurs).
Si oui vérifié, il est redirigé vers /auth/two-factor

```
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated && !is2FAVerified) {
    return <Navigate to="/auth/two-factor" replace />;
  }

  return children;
};

```

- Fonctionnalité :
  Ce composant agit comme un garde pour les routes protégées.
  Si l'utilisateur n'est pas connecté, il est redirigé vers /auth/login.
  Si l'utilisateur est connecté mais que la vérification 2FA est incomplète, il est redirigé vers /auth/two-factor.
  Sinon, il permet l'accès au contenu enfant (les composants enfants de ProtectedRoute).

-> fonctionnement general :

. Lorsqu'un utilisateur accède à une route, React Router vérifie son état (isAuthenticated et is2FAVerified).
. Si l'utilisateur n'est pas connecté, il est redirigé vers /auth/login.
. Si l'utilisateur est connecté mais non vérifié pour 2FA, il est redirigé vers /auth/two-factor.
. Une fois connecté et vérifié, l'utilisateur peut accéder aux pages protégées.

$ Points clés :

1. ProtectedRoute vérifie l'authentification avant d'afficher le contenu
2. Routes imbriquées utilisent element={<Layout/>} pour le template
3. setIsAuthenticated et setIs2FAVerified sont passés aux composants enfants pour mettre à jour l'état

/-------------------------------------------------------/

file login.jsx (hooks , axios )

1. useState – Gestion de l'état local
   Permet de gérer des variables d'état dans un composant fonctionnel.

```
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0); // Initialisation de l'état à 0

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={increment}>Incrémenter</button>
    </div>
  );
};

export default Counter;
```

2. useEffect – Gestion des effets secondaires
   Permet d'exécuter du code après que le composant a été rendu (comme les requêtes API ou la gestion d'événements).

```
import React, { useState, useEffect } from 'react';

const FetchData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []); // [] signifie que cet effet s'exécute uniquement au montage du composant

  return <div>{data ? JSON.stringify(data) : "Chargement..."}</div>;
};

export default FetchData;
```

3. useRef – Références aux éléments DOM
   Permet de manipuler directement des éléments DOM ou de stocker une valeur persistante.

```
import React, { useRef } from 'react';

const FocusInput = () => {
  const inputRef = useRef();

  const handleFocus = () => inputRef.current.focus();

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus sur l'input</button>
    </div>
  );
};

export default FocusInput;
```

4. useNavigate - retourne une fonction que vous pouvez appeler pour changer l'URL actuelle et naviguer vers une autre route.

```
const navigate = useNavigate();

const handleClick = () => {
  navigate('/nouvelle-route');
};
```

- Axios : utilisée pour effectuer des requêtes HTTP vers des APIs ou des serveurs backend. Elle fonctionne à la fois dans le navigateur et dans un environnement Node.js.

1. Axios Requête GET :Pour récupérer des données d'une API :

```
api.get('https://api.example.com/data')
  .then(response => {
    console.log('Données reçues:', response.data);
  })
  .catch(error => {
    console.error('Erreur:', error);
  });
```

2. Axios Requête POST : Pour envoyer des données à une API

```
const newData = { name: 'John', age: 30 };

api.post('https://api.example.com/users', newData)
.then(response => console.log('Données enregistrées:', response.data))
.catch(error => console.error(error));
```

3. Axios Requête PUT (mise à jour) : Pour mettre à jour des données existantes :

```
const updatedData = { name: 'John Doe', age: 31 };

api.put('https://api.example.com/users/1', updatedData)
  .then(response => console.log('Mise à jour réussie:', response.data))
  .catch(error => console.error(error));
```

4. Axios Requête DELETE : Pour supprimer des données sur le serveur

```
api.delete('https://api.example.com/users/1')
  .then(response => console.log('Utilisateur supprimé'))
  .catch(error => console.error(error));
```

- Utilisation avec async/await Axios est compatible avec async/await, ce qui rend le code plus lisible

```
const fetchData = async () => {
  try {
    const response = await api.get('https://api.example.com/data');
    console.log('Données:', response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

fetchData();
```

=> Navlink :

```
<NavLink
  to="/route"
  className={({ isActive }) =>
    isActive ? 'active-class' : 'inactive-class'
  }
>
```

1. isActive : Détecte automatiquement si la route actuelle correspond au to
2. Permet le styling conditionnel basé sur l'état actif
3. Support des sous-routes avec end prop

=> Les Props (propriétés) dans React sont des arguments passés aux composants. Voici l'essentiel :

```
const Sidebar = () => {
  const navLinks = [...]; // Props définies localement
  return (
    // Props passées aux NavLink
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) => `...`}
    >
```

Caractéristiques principales :

- Lecture seule (immutables)
- Passées de parent à enfant
- Peuvent être de tout type (string, number, function, object)

```
// Parent
<MenuItem icon="home.svg" label="Home" />

// Enfant
const MenuItem = ({ icon, label }) => (
  <div>
    <img src={icon} alt={label} />
    <span>{label}</span>
  </div>
);
```

cours django : https://www.youtube.com/watch?v=_MAdUhH49so&list=PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm&index=7
