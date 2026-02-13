
import { ResumeData } from "../types";
import { securityService } from "./securityService";

const SESSION_KEY = 'ez_secure_session';
const USERS_KEY = 'ez_secure_users';
const DATA_PREFIX = 'ez_secure_vault_';
const DOWNLOAD_TRACKER_KEY = 'ez_download_count';

export const dataService = {
  // Auth & Session
  getCurrentUser: () => {
    const sealed = localStorage.getItem(SESSION_KEY);
    if (!sealed) return null;
    return securityService.unseal(sealed);
  },

  saveSession: (user: { email: string, name: string, token: string }) => {
    const sealed = securityService.seal(user);
    localStorage.setItem(SESSION_KEY, sealed);
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Encrypted Local Resume Data
  saveResumeData: async (email: string, data: ResumeData): Promise<void> => {
    return new Promise((resolve) => {
      const sealed = securityService.seal(data);
      localStorage.setItem(`${DATA_PREFIX}${btoa(email)}`, sealed);
      resolve();
    });
  },

  loadResumeData: (email: string): ResumeData | null => {
    const sealed = localStorage.getItem(`${DATA_PREFIX}${btoa(email)}`);
    if (!sealed) return null;
    return securityService.unseal(sealed);
  },

  // Download Tracking
  getDownloadCount: (): number => {
    const count = localStorage.getItem(DOWNLOAD_TRACKER_KEY);
    return count ? parseInt(count, 10) : 0;
  },

  incrementDownloadCount: () => {
    const current = dataService.getDownloadCount();
    localStorage.setItem(DOWNLOAD_TRACKER_KEY, (current + 1).toString());
    return current + 1;
  },

  // Secure User Management
  getUsers: () => {
    const sealed = localStorage.getItem(USERS_KEY);
    return sealed ? securityService.unseal(sealed) : [];
  },
  
  addUser: (user: any) => {
    const users = dataService.getUsers();
    users.push(user);
    const sealed = securityService.seal(users);
    localStorage.setItem(USERS_KEY, sealed);
  },

  // Vulnerability Check
  isBruteForce: (email: string): boolean => {
    const attempts = parseInt(sessionStorage.getItem(`login_attempts_${email}`) || '0');
    return attempts >= 5;
  },

  recordAttempt: (email: string) => {
    const attempts = parseInt(sessionStorage.getItem(`login_attempts_${email}`) || '0');
    sessionStorage.setItem(`login_attempts_${email}`, (attempts + 1).toString());
  }
};
