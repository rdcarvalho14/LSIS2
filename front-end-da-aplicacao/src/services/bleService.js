const SOS_SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const SOS_CHARACTERISTIC_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
const DEVICE_NAME = 'SOS_Button';

class BLEService {
  constructor() {
    this.device = null;
    this.characteristic = null;
    this.onSOSCallback = null;
  }

  isSupported() {
    if (!navigator.bluetooth) {
      console.error('Web Bluetooth API não suportada neste browser');
      return false;
    }
    return true;
  }

  async connect(onSOSReceived) {
    if (!this.isSupported()) {
      throw new Error('Bluetooth não suportado neste browser. Use Chrome, Edge ou Opera.');
    }

    this.onSOSCallback = onSOSReceived;

    try {
      console.log('🔍 Procurando dispositivo SOS...');
      
      // Solicitar dispositivo
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ name: DEVICE_NAME }],
        optionalServices: [SOS_SERVICE_UUID]
      });

      console.log('✅ Dispositivo encontrado:', this.device.name);

      // Conectar ao GATT Server
      const server = await this.device.gatt.connect();
      console.log('🔗 Conectado ao GATT Server');

      // Obter serviço
      const service = await server.getPrimaryService(SOS_SERVICE_UUID);
      console.log('📡 Serviço SOS obtido');

      // Obter característica
      this.characteristic = await service.getCharacteristic(SOS_CHARACTERISTIC_UUID);
      console.log('✨ Característica SOS obtida');

      // Iniciar notificações
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', this.handleSOSNotification.bind(this));
      console.log('🔔 Notificações ativadas');

      // Monitorar desconexão
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar:', error);
      throw error;
    }
  }

  handleSOSNotification(event) {
    const value = event.target.value;
    const sosValue = value.getUint8(0);
    
    console.log('📩 Notificação recebida:', sosValue);

    if (sosValue === 1) {
      console.log('🚨 SOS ATIVADO!');
      if (this.onSOSCallback) {
        this.onSOSCallback();
      }
    }
  }

  onDisconnected() {
    console.log('❌ Dispositivo desconectado');
    this.device = null;
    this.characteristic = null;
  }

  async disconnect() {
    if (this.device && this.device.gatt.connected) {
      await this.device.gatt.disconnect();
      console.log('🔌 Desconectado manualmente');
    }
  }

  isConnected() {
    return this.device && this.device.gatt.connected;
  }
}

export default new BLEService();