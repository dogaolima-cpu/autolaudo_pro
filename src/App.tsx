/**
 * AutoLaudo Pro - Sistema de Vistoria, Precificação FIPE e Laudo Técnico Automotivo
 */

import React, { useState, useEffect } from 'react';
import { Laudo, UserRole } from './types/laudo';
import { INITIAL_SAMPLE_LAUDOS } from './constants/initialLaudos';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { NewLaudoWizard } from './components/NewLaudoWizard';
import { LaudoViewerModal } from './components/LaudoViewerModal';

const STORAGE_KEY = 'autolaudo_pro_laudos_v1';
const ROLE_STORAGE_KEY = 'autolaudo_pro_role_v1';

export default function App() {
  const [laudos, setLaudos] = useState<Laudo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((l: any) => {
            // Migra campos de precificação caso venham da versão anterior
            const fipe = l.precificacao?.valorFipe || 70000;
            const vendaSugerida = l.precificacao?.precoVendaSugerido || Math.round(fipe * 1.02);
            const margemPct = l.precificacao?.margemNegociacaoPercentual || 5;
            const minimoNegociacao = l.precificacao?.precoMinimoNegociacao || Math.round(vendaSugerida * (1 - margemPct / 100));

            return {
              ...l,
              precificacao: {
                ...l.precificacao,
                valorFipe: fipe,
                precoVendaSugerido: vendaSugerida,
                precoMinimoNegociacao: minimoNegociacao,
                margemNegociacaoPercentual: margemPct,
                ajusteMercadoRegional: l.precificacao?.ajusteMercadoRegional || 0,
                ajusteConservacaoOpcionais: l.precificacao?.ajusteConservacaoOpcionais || 0,
                custoEstimadoAvarias: l.precificacao?.custoEstimadoAvarias || l.precificacao?.descontoAvariasCarroceria || 0,
              },
            };
          });
        }
      }
    } catch {
      // Ignora erro de parsing
    }
    return INITIAL_SAMPLE_LAUDOS;
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'new_laudo'>('dashboard');
  const [viewingLaudo, setViewingLaudo] = useState<Laudo | null>(null);
  const [editingLaudo, setEditingLaudo] = useState<Laudo | null>(null);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'admin' || savedRole === 'avaliador' || savedRole === 'consultor') {
        return savedRole;
      }
    } catch {
      // Fallback
    }
    return 'avaliador';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Persist laudos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(laudos));
    } catch {
      // LocalStorage full or private browsing
    }
  }, [laudos]);

  // Persist role
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, userRole);
    } catch {
      // Fallback
    }
  }, [userRole]);

  const handleSaveLaudo = (savedLaudo: Laudo) => {
    setLaudos((prev) => {
      const exists = prev.some((l) => l.id === savedLaudo.id);
      if (exists) {
        return prev.map((l) => (l.id === savedLaudo.id ? savedLaudo : l));
      } else {
        return [savedLaudo, ...prev];
      }
    });

    setEditingLaudo(null);
    setCurrentView('dashboard');
    // Open viewer immediately for preview
    setViewingLaudo(savedLaudo);
  };

  const handleDeleteLaudo = (id: string) => {
    if (confirm('Tem certeza que deseja remover este laudo de vistoria?')) {
      setLaudos((prev) => prev.filter((l) => l.id !== id));
      if (viewingLaudo?.id === id) setViewingLaudo(null);
    }
  };

  const handleStartNewLaudo = () => {
    setEditingLaudo(null);
    setCurrentView('new_laudo');
  };

  const handleEditLaudo = (laudo: Laudo) => {
    setEditingLaudo(laudo);
    setCurrentView('new_laudo');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'new_laudo') handleStartNewLaudo();
          else setCurrentView(view);
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        userRole={userRole}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' ? (
          <Dashboard
            laudos={laudos}
            onNewLaudo={handleStartNewLaudo}
            onViewLaudo={(l) => setViewingLaudo(l)}
            onEditLaudo={handleEditLaudo}
            onDeleteLaudo={handleDeleteLaudo}
            userRole={userRole}
            onUserRoleChange={setUserRole}
          />
        ) : (
          <NewLaudoWizard
            initialLaudo={editingLaudo}
            onSave={handleSaveLaudo}
            onCancel={() => {
              setEditingLaudo(null);
              setCurrentView('dashboard');
            }}
            userName={
              userRole === 'admin'
                ? 'Carlos Drummond (Gestor/Admin)'
                : userRole === 'avaliador'
                ? 'Carlos Drummond (Perito Avaliador)'
                : 'Consultor Automotivo'
            }
          />
        )}
      </main>

      {/* Laudo Modal Viewer when requested */}
      {viewingLaudo && (
        <LaudoViewerModal
          laudo={viewingLaudo}
          onClose={() => setViewingLaudo(null)}
          onEdit={
            userRole !== 'consultor'
              ? () => {
                  handleEditLaudo(viewingLaudo);
                  setViewingLaudo(null);
                }
              : undefined
          }
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">AutoLaudo Pro</span> · Laudo Técnico Pericial de Consultoria Automotiva com FIPE
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Dossiê para Venda de Veículos</span>
            <span>·</span>
            <span>Tabela FIPE Oficial</span>
            <span>·</span>
            <span>Laudo em PDF A4</span>
            <span>·</span>
            <span>Compartilhamento WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
