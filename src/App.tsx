import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuickEstimate } from './components/QuickEstimate';
import { PersonalizedEstimate } from './components/PersonalizedEstimate';
import { PlanningMode } from './types';
import { Trash2 } from 'lucide-react';

function App() {
  const [mode, setMode] = useState<PlanningMode | null>(null);

  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={clearCache}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Clear Cache"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        {!mode ? (
          <WelcomeScreen onModeSelect={setMode} />
        ) : mode === 'quick' ? (
          <QuickEstimate />
        ) : (
          <PersonalizedEstimate />
        )}
      </div>
    </div>
  );
}

export default App;