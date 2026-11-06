import React from 'react';
import { UserRole } from '../types/laudo';
import { Sun, Moon, Plus, Car } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'new_laudo';
  onNavigate: (view: 'dashboard' | 'new_laudo') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userRole: UserRole;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
  userRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
            AL
          </div>
          <span>AutoLaudo Pro</span>
        </button>

        {/* Zone 2: Navigation Links (single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              currentView === 'dashboard' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
            }`}
          >
            Painel de Laudos
          </button>
          <button
            type="button"
            onClick={() => onNavigate('new_laudo')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 ${
              currentView === 'new_laudo' ? 'text-sky-600 dark:text-sky-400 font-bold' : ''
            }`}
          >
            Nova Vistoria
          </button>
          <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
            FIPE Tempo Real
          </span>
          <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
          <span className="text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
            WhatsApp & PDF
          </span>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors"
            title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {userRole !== 'consultor' ? (
            <button
              type="button"
              onClick={() => onNavigate('new_laudo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Vistoria
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Consultar Laudos
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
