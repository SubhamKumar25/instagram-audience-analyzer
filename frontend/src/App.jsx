import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Moon, Scale, RefreshCw, Layers } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ApiDocs from './pages/ApiDocs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SkeletonLoader from './components/SkeletonLoader';
import CompareModal from './components/CompareModal';
import { API_BASE_URL } from './config';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activePage, setActivePage] = useState('home');
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    // Dark mode default
    document.documentElement.classList.add('dark');
    
    // Check parameters for share links
    const queryParams = new URLSearchParams(window.location.search);
    const userQuery = queryParams.get('user');
    if (userQuery) {
      triggerShareAudit(userQuery);
    }
  }, []);

  const triggerShareAudit = async (un) => {
    setIsLoading(true);
    setActivePage('dashboard');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/analyze`, {
        profile_url: `https://instagram.com/${un}`
      });
      setUsername(response.data.profile.username);
      setAnalysisData(response.data);
    } catch (err) {
      console.error(err);
      setActivePage('home');
      alert('Failed to automatically analyze profile from shared link.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  const handleAnalyzeStart = () => {
    setIsLoading(true);
    setAnalysisData(null);
    setActivePage('dashboard');
  };

  const handleAnalyzeSuccess = (data) => {
    setAnalysisData(data);
    setIsLoading(false);
  };

  const handleAnalyzeFail = (msg) => {
    setIsLoading(false);
    setActivePage('home');
  };

  const handleReset = () => {
    setAnalysisData(null);
    setUsername('');
    setActivePage('home');
    // Clear URL parameters
    window.history.pushState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-dark-bg light:bg-light-bg text-gray-100 light:text-slate-800 transition-colors duration-300">
      
      {/* Elegant glass headers */}
      <nav className="border-b border-white/10 light:border-slate-200 py-4 px-6 sticky top-0 bg-dark-bg/85 light:bg-light-bg/85 backdrop-blur-md z-40 select-none no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo link */}
          <div onClick={handleReset} className="flex items-center space-x-2.5 cursor-pointer">
            <Layers className="w-5.5 h-5.5 text-purple-400" />
            <span className="font-extrabold text-white light:text-slate-900 tracking-tight text-lg">
              Audience<span className="text-purple-400 font-extrabold">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider text-slate-400">
            <button 
              onClick={handleReset} 
              className={`hover:text-white transition-colors cursor-pointer ${activePage === 'home' ? 'text-white font-extrabold border-b border-purple-400 pb-0.5' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { setActivePage('about'); setAnalysisData(null); }} 
              className={`hover:text-white transition-colors cursor-pointer ${activePage === 'about' ? 'text-white font-extrabold border-b border-purple-400 pb-0.5' : ''}`}
            >
              How It Works
            </button>
            <button 
              onClick={() => { setActivePage('api'); setAnalysisData(null); }} 
              className={`hover:text-white transition-colors cursor-pointer ${activePage === 'api' ? 'text-white font-extrabold border-b border-purple-400 pb-0.5' : ''}`}
            >
              Developer API
            </button>
            <button 
              onClick={() => { setActivePage('privacy'); setAnalysisData(null); }} 
              className={`hover:text-white transition-colors cursor-pointer ${activePage === 'privacy' ? 'text-white font-extrabold border-b border-purple-400 pb-0.5' : ''}`}
            >
              Privacy
            </button>
          </div>

          {/* Utilities */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/5 light:bg-slate-200 border border-white/5 light:border-slate-300 text-xs font-semibold text-white light:text-slate-900 cursor-pointer hover:bg-white/10"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>Compare</span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 light:bg-slate-200 border border-white/5 light:border-slate-300 text-slate-400 light:text-slate-700 hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Primary viewport wrapper */}
      <main className="min-h-[75vh] flex flex-col justify-center">
        {isLoading && (
          <div className="w-full max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-8 space-y-2 select-none">
              <RefreshCw className="w-7 h-7 text-purple-500 animate-spin mx-auto" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Auditing Profile...</h3>
              <p className="text-[10px] text-slate-400">Evaluating profile ratios, bio language clues, and scoring risk weights...</p>
            </div>
            <SkeletonLoader />
          </div>
        )}

        {!isLoading && activePage === 'home' && (
          <Home 
            onAnalyzeStart={handleAnalyzeStart}
            onAnalyzeSuccess={handleAnalyzeSuccess}
            onAnalyzeFail={handleAnalyzeFail}
            setUsername={setUsername}
          />
        )}

        {!isLoading && activePage === 'dashboard' && analysisData && (
          <Dashboard data={analysisData} onReset={handleReset} />
        )}

        {!isLoading && activePage === 'about' && <About />}
        {!isLoading && activePage === 'api' && <ApiDocs />}
        {!isLoading && activePage === 'privacy' && <PrivacyPolicy />}
      </main>

      {/* Comparisons */}
      <CompareModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} />

    </div>
  );
}
