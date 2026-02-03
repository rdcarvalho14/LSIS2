// DiaryContext - Gerência do diário
import { createContext, useState, useEffect } from 'react';
import { diaryStorage } from '../services/storage';

export const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadEntries();
  }, []);
  
  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await diaryStorage.getAll();
      setEntries(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar diário:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const addEntry = async (data) => {
    try {
      const entryData = {
        timestamp: Date.now(),
        text: data.text,
        photos: data.photos || [],
        hasPhoto: data.hasPhoto || false,
        hasAudio: data.hasAudio || false,
      };
      
      const id = await diaryStorage.add(entryData);
      
      const newEntry = {
        id,
        ...entryData
      };
      
      setEntries(prev => [newEntry, ...prev]);
      return id;
    } catch (err) {
      console.error('Erro ao adicionar entrada:', err);
      throw err;
    }
  };
  
  const getEntry = async (id) => {
    try {
      return await diaryStorage.getById(id);
    } catch (err) {
      console.error('Erro ao buscar entrada:', err);
      throw err;
    }
  };
  
  const clearAll = async () => {
    try {
      await diaryStorage.deleteAll();
      setEntries([]);
    } catch (err) {
      console.error('Erro ao limpar diário:', err);
    }
  };
  
  return (
    <DiaryContext.Provider
      value={{
        entries,
        loading,
        error,
        addEntry,
        getEntry,
        refreshEntries: loadEntries,
        clearAll,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};
