// Custom hook para usar geolocalização
import { useState } from 'react';
import { getCurrentPosition } from '../services/geolocation';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const position = await getCurrentPosition();
      setLocation(position);
      return position;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };
  
  return {
    location,
    loading,
    error,
    getLocation,
    clearLocation,
  };
};

export default useGeolocation;
