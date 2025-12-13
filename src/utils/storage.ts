export class StorageManager {
  static readonly PREFIX = "admin_";

  static set(key: string, value: any): void {
    try {
      const prefixedKey = this.PREFIX + key;
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to set storage:", error);
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const prefixedKey = this.PREFIX + key;
      const value = localStorage.getItem(prefixedKey);
      return value ? JSON.parse(value) : defaultValue ?? null;
    } catch (error) {
      console.error("Failed to get storage:", error);
      return defaultValue ?? null;
    }
  }

  static remove(key: string): void {
    try {
      const prefixedKey = this.PREFIX + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error("Failed to remove storage:", error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }
}

export default StorageManager;
