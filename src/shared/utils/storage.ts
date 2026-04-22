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

// ---------------------------------------------------------------------------
// Unprefixed citizen-scope helpers
// Phase 2 centralises all raw localStorage access behind these helpers.
// Keys are intentionally unprefixed to preserve existing citizen data in
// the wild. A later phase can migrate to StorageManager's "admin_" prefix.
// ---------------------------------------------------------------------------

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

// --- auth token ---
export const getToken = (): string | null => localStorage.getItem("token");
export const setToken = (token: string): void =>
  localStorage.setItem("token", token);
export const clearToken = (): void => localStorage.removeItem("token");

// Phase-1 aliases retained for the axios interceptor.
export const getAuthToken = getToken;
export const clearAuthToken = clearToken;

// --- citizen info ---
export const getCitizenInfo = <T = Record<string, any>>(): T =>
  safeParse<T>(localStorage.getItem("citizenInfo"), {} as T);
export const setCitizenInfo = (info: unknown): void =>
  localStorage.setItem("citizenInfo", JSON.stringify(info));
export const clearCitizenInfo = (): void =>
  localStorage.removeItem("citizenInfo");

// --- citizen name (transient cache populated by verification flow) ---
export const getCitizenName = <T = Record<string, any>>(): T =>
  safeParse<T>(localStorage.getItem("citizenName"), {} as T);
export const setCitizenName = (name: unknown): void =>
  localStorage.setItem("citizenName", JSON.stringify(name));
export const clearCitizenName = (): void =>
  localStorage.removeItem("citizenName");

// --- admin user (admin auth context) ---
export const getUser = <T = Record<string, any> | null>(): T | null =>
  safeParse<T | null>(localStorage.getItem("user"), null);
export const setUser = (user: unknown): void =>
  localStorage.setItem("user", JSON.stringify(user));
export const clearUser = (): void => localStorage.removeItem("user");

// --- citizen_user (legacy cached profile) ---
export const clearCitizenUser = (): void =>
  localStorage.removeItem("citizen_user");

// --- language ---
export const getLanguage = (): string | null =>
  localStorage.getItem("language");
export const setLanguage = (lang: string): void =>
  localStorage.setItem("language", lang);

// --- tracking number ---
export const getTrackingNumber = (): string | null =>
  localStorage.getItem("trackingNumber");
export const setTrackingNumber = (code: string): void =>
  localStorage.setItem("trackingNumber", code);

// --- clear every citizen-scope key (logout) ---
export const clearCitizenSession = (): void => {
  clearToken();
  clearCitizenInfo();
  clearCitizenName();
  clearCitizenUser();
};
