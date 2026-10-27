// Safe Storage Adapter with In-Memory Fallback
// Guarantees zero crashes even if native bridge is momentarily unready or running across web/mobile.

import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore: Record<string, string> = {};

export const SafeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
      return memoryStore[key] || null;
    } catch (err) {
      return memoryStore[key] || null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryStore[key] = value;
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      // In-memory store already updated
    }
  },

  async removeItem(key: string): Promise<void> {
    delete memoryStore[key];
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      // In-memory store already updated
    }
  },

  async clear(): Promise<void> {
    for (const k of Object.keys(memoryStore)) {
      delete memoryStore[k];
    }
    try {
      await AsyncStorage.clear();
    } catch (err) {
      // In-memory store already cleared
    }
  },
};

