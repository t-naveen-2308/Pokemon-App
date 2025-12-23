import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyTeam from './pages/MyTeam';
import './App.css';

function App() {
  return (
    <PokemonProvider>
      <Router>
        <div className="container">
          <header>
            <Navbar />
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<MyTeam />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PokemonProvider>
  );
}

export default App;
