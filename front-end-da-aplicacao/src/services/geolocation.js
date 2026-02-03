// Geolocation API - Obter localização GPS

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let message = 'Não foi possível obter a localização.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permissão de localização negada.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Localização indisponível.';
            break;
          case error.TIMEOUT:
            message = 'Tempo esgotado ao buscar localização.';
            break;
          default:
            break;
        }
        
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const formatLocationUrl = (latitude, longitude) => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

export const formatLocationText = (latitude, longitude) => {
  const lat = latitude.toFixed(6);
  const lng = longitude.toFixed(6);
  return `${lat}, ${lng}`;
};

export const checkLocationPermission = async () => {
  if (!navigator.permissions) {
    return 'unavailable';
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return 'unavailable';
  }
};
