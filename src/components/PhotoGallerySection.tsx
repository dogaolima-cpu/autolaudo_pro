import React, { useRef } from 'react';
import { VehiclePhoto } from '../types/laudo';
import { Camera, Plus, Trash2, Image as ImageIcon, Eye } from 'lucide-react';

interface PhotoGallerySectionProps {
  photos: VehiclePhoto[];
  onChange: (photos: VehiclePhoto[]) => void;
  readOnly?: boolean;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  photos,
  onChange,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoCategories = [
    { id: 'frente', label: 'Frente do Veículo' },
    { id: 'traseira', label: 'Traseira / Tampa' },
    { id: 'lateral_esq', label: 'Lateral Esquerda' },
    { id: 'lateral_dir', label: 'Lateral Direita' },
    { id: 'interior', label: 'Interior / Bancos' },
    { id: 'painel_km', label: 'Painel / Hodômetro KM' },
    { id: 'motor', label: 'Cofre do Motor' },
    { id: 'pneus', label: 'Pneus / Rodas' },
    { id: 'avaria_detalhe', label: 'Detalhe de Avaria' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newPhoto: VehiclePhoto = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'frente',
            title: file.name.replace(/\.[^/.]+$/, ''),
            dataUrl,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            observacao: '',
          };
          onChange([...photos, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  const handleUpdatePhoto = (id: string, updates: Partial<VehiclePhoto>) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-500" />
            Galeria de Fotos da Vistoria Técnica ({photos.length} fotos)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro visual dos 4 ângulos, hodômetro, motor, interior e detalhes de avarias
          </p>
        </div>

        {!readOnly && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Fazer Upload de Fotos
            </button>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div
          onClick={() => !readOnly && fileInputRef.current?.click()}
          className={`py-10 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 ${
            !readOnly ? 'cursor-pointer hover:border-sky-500 bg-slate-50/50 dark:bg-slate-950/30' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nenhuma foto anexada a este laudo ainda
          </div>
          <div className="text-[11px] text-slate-400 mt-1 max-w-sm">
            Clique aqui para selecionar fotos do seu dispositivo (galeria ou câmera) para incluir no laudo em PDF.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col"
            >
              <div className="relative aspect-4/3 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={photo.dataUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md transition-opacity"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <select
                    disabled={readOnly}
                    value={photo.category}
                    onChange={(e) => handleUpdatePhoto(photo.id, { category: e.target.value as any })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-semibold"
                  >
                    {photoCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    readOnly={readOnly}
                    value={photo.observacao || ''}
                    onChange={(e) => handleUpdatePhoto(photo.id, { observacao: e.target.value })}
                    placeholder="Legenda da foto..."
                    className="w-full mt-1.5 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-[11px]"
                  />
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Adicionada às {photo.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
