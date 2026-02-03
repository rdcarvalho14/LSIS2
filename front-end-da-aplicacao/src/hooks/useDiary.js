// Custom hook para usar DiaryContext
import { useContext } from 'react';
import { DiaryContext } from '../contexts/DiaryContext';

export const useDiary = () => {
  const context = useContext(DiaryContext);
  
  if (!context) {
    throw new Error('useDiary deve ser usado dentro de DiaryProvider');
  }
  
  return context;
};

export default useDiary;
