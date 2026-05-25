// rsschool-cv\src\store\useCharacterStore.ts
import { create } from 'zustand';
import type { Character } from '../types';

interface CharacterState {
  selectedCharacters: Character[];  
  toggleCharacter: (char: Character) => void; 
  clearSelection: () => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({ 
  selectedCharacters: [],

  toggleCharacter: (char) => set((state) => {
    const isAlreadySelected = state.selectedCharacters.some((item) => item.id === char.id);

    if (isAlreadySelected) {     
      return {
        selectedCharacters: state.selectedCharacters.filter((item) => item.id !== char.id),
      };
    } else {      
      return {
        selectedCharacters: [...state.selectedCharacters, char],
      };
    }
  }),
  
  clearSelection: () => set({ selectedCharacters: [] }),
}));
