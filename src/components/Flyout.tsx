// src/components/Flyout.tsx
import React from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import type { Character } from '../types';

const Flyout: React.FC = () => {  
  const { selectedCharacters, clearSelection } = useCharacterStore();
  const count = selectedCharacters.length;
  
  if (count === 0) return null;
  
  const handleDownloadCSV = () => {
    if (count === 0) return;
    
    const headers = ['ID', 'Name', 'Status', 'Species', 'Gender', 'Location'];    
    const rows = selectedCharacters.map((char: Character) => [
      char.id,
      `"${char.name}"`,
      char.status,
      char.species,
      char.gender,
      `"${char.location.name}"`
    ]);
    
    const csvContent = [headers, ...rows]
      .map((e) => e.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);    
    
    const link = document.createElement('a');
    link.href = url;    
    
    link.setAttribute('download', `${count}_items.csv`);    
    
    document.body.appendChild(link);
    link.click();    
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout-container">
      <div className="flyout-content">
        <span className="flyout-info">
          Выбрано персонажей: <strong>{count}</strong>
        </span>
        
        <div className="flyout-actions">
          {/* Кнопка очистки стейта */}
          <button className="btn-unselect" onClick={clearSelection}>
            Снять выделение со всех
          </button>
          
          {/* Кнопка скачивания */}
          <button className="btn-download" onClick={handleDownloadCSV}>
            Скачать CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flyout;