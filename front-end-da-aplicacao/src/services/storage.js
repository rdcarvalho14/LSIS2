
import Dexie from 'dexie';

// Função para obter dados do usuário (mock, pode ser expandido)
export async function getUserData() {
  // TODO: Integrar com autenticação real
  // Exemplo: buscar de settings ou contexto
  const name = await settingsStorage.get('userName');
  const phone = await settingsStorage.get('userPhone');
  return { name, phone };
}

// Função para obter dados do agressor
export async function getAggressorData() {
  return await aggressorStorage.get();
}

// Função para obter contatos de confiança ativos
export async function getEmergencyContacts() {
  const all = await contactsStorage.getAll();
  return all.filter(c => c.active);
}

const db = new Dexie('SafetyAppDB');

db.version(1).stores({
  diary: '++id, timestamp, text',
  contacts: '++id, name, phone, active',
  aggressor: 'id, name, phone, photo',
  settings: 'key, value'
});

export const diaryStorage = {
  async add(entry) {
    try {
      const id = await db.diary.add({
        timestamp: entry.timestamp || Date.now(),
        text: entry.text || '',
        photos: entry.photos || [],
        hasPhoto: entry.hasPhoto || false,
        hasAudio: entry.hasAudio || false,
      });
      return id;
    } catch (error) {
      console.error('Erro ao salvar entrada do diário:', error);
      throw new Error('Não foi possível salvar a entrada.');
    }
  },
  
  async getAll() {
    try {
      const entries = await db.diary.orderBy('timestamp').reverse().toArray();
      return entries;
    } catch (error) {
      console.error('Erro ao buscar entradas:', error);
      throw new Error('Não foi possível carregar as entradas.');
    }
  },
  
  async getById(id) {
    try {
      const entry = await db.diary.get(id);
      return entry;
    } catch (error) {
      console.error('Erro ao buscar entrada:', error);
      throw new Error('Não foi possível carregar a entrada.');
    }
  },
  
  async deleteAll() {
    try {
      await db.diary.clear();
    } catch (error) {
      console.error('Erro ao limpar diário:', error);
    }
  }
};

export const contactsStorage = {
  async add(contact) {
    try {
      const id = await db.contacts.add({
        name: contact.name,
        phone: contact.phone,
        active: contact.active !== false,
        createdAt: Date.now(),
      });
      return id;
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      throw new Error('Não foi possível adicionar o contato.');
    }
  },
  
  async getAll() {
    try {
      const contacts = await db.contacts.toArray();
      return contacts;
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      return [];
    }
  },
  
  async update(id, updates) {
    try {
      await db.contacts.update(id, updates);
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      throw new Error('Não foi possível atualizar o contato.');
    }
  },
  
  async delete(id) {
    try {
      await db.contacts.delete(id);
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      throw new Error('Não foi possível deletar o contato.');
    }
  }
};

export const aggressorStorage = {
  async set(data) {
    try {
      await db.aggressor.put({
        id: 1,
        ...data,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao salvar informações do agressor:', error);
      throw new Error('Não foi possível salvar as informações.');
    }
  },
  
  async save(data) {
    return this.set(data);
  },
  
  async get() {
    try {
      const data = await db.aggressor.get(1);
      return data || null;
    } catch (error) {
      console.error('Erro ao buscar informações do agressor:', error);
      return null;
    }
  },
  
  async delete() {
    try {
      await db.aggressor.delete(1);
    } catch (error) {
      console.error('Erro ao deletar informações:', error);
    }
  }
};

export const settingsStorage = {
  async set(key, value) {
    try {
      await db.settings.put({ key, value });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  },
  
  async get(key) {
    try {
      const setting = await db.settings.get(key);
      return setting ? setting.value : null;
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      return null;
    }
  }
};

export default db;
