import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Application Epargne</h1>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/about">À propos</Link>
        </nav>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      
      <footer>
        <p>© 2025 Application Epargne</p>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <div className="home-page">
      <h2>Bienvenue sur l'application Epargne</h2>
      <p>Cette application vous aide à gérer vos finances personnelles.</p>
      <div className="features">
        <div className="feature-card">
          <h3>Suivez vos dépenses</h3>
          <p>Gardez un œil sur où va votre argent</p>
        </div>
        <div className="feature-card">
          <h3>Fixez des objectifs</h3>
          <p>Définissez et atteignez vos objectifs d'épargne</p>
        </div>
        <div className="feature-card">
          <h3>Analysez vos habitudes</h3>
          <p>Obtenez des insights sur vos habitudes financières</p>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="about-page">
      <h2>À propos de l'application Epargne</h2>
      <p>
        L'application Epargne est conçue pour vous aider à prendre le contrôle de vos finances personnelles.
        Notre mission est de rendre la gestion financière accessible à tous.
      </p>
      <h3>Notre équipe</h3>
      <p>
        Nous sommes une équipe passionnée par les technologies et les finances personnelles,
        dédiée à créer des outils qui améliorent votre vie quotidienne.
      </p>
    </div>
  )
}

export default App