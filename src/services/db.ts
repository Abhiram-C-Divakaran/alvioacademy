// ============================================================
// IndexedDB Database Service
// Handles client-side persistent storage for users, authentication
// sessions, and dynamic learning progress data.
// ============================================================

import type { User, LearningProgress, TopicProgress } from '../types/user';

const DB_NAME = 'CoddyCloneDB';
const DB_VERSION = 1;

export interface DBUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  passwordHash: string;
  createdAt: string;
  settings: {
    theme: 'dark' | 'light';
    voiceEnabled: boolean;
    animationSpeed: number;
    notifications: boolean;
  };
}

export interface DBSession {
  userId: string;
  token: string;
  expiresAt: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // User store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
          // Create email index for lookup during login
          const usersStore = request.transaction?.objectStore('users');
          usersStore?.createIndex('email', 'email', { unique: true });
        }

        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'userId' });
        }

        // Session store
        if (!db.objectStoreNames.contains('session')) {
          db.createObjectStore('session', { keyPath: 'userId' });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    return this.init().then((db) => {
      const transaction = db.transaction(storeName, mode);
      return transaction.objectStore(storeName);
    });
  }

  // SHA-256 helper for security simulation
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Generate simple token mock
  private generateToken(): string {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  // User Operations
  async registerUser(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // 1. Check if user already exists BEFORE starting write transaction
    const existing = await this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'usr_' + Math.random().toString(36).slice(2, 9);
    const passwordHash = await this.hashPassword(password);
    const now = new Date().toISOString();

    const dbUser: DBUser = {
      id: userId,
      name,
      email,
      passwordHash,
      createdAt: now,
      settings: {
        theme: 'dark',
        voiceEnabled: false,
        animationSpeed: 1,
        notifications: true,
      },
    };

    // Create default progress for user
    const defaultTopics: TopicProgress[] = [
      { topicId: 'array', topicName: 'Arrays', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'linked-list', topicName: 'Linked Lists', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'stack', topicName: 'Stacks', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'queue', topicName: 'Queues', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'binary-tree', topicName: 'Binary Trees', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'avl-tree', topicName: 'AVL Trees', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'graph', topicName: 'Graphs', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
      { topicId: 'hash-table', topicName: 'Hash Tables', status: 'not-started', completionPercent: 0, timeSpentMinutes: 0, quizScore: null, lastAccessed: now },
    ];

    const defaultProgress: LearningProgress = {
      userId,
      topics: defaultTopics,
      totalTimeSpentMinutes: 0,
      overallScore: 0,
      streak: 1,
      badges: [],
      weakAreas: [],
      recommendedTopics: ['array', 'stack'],
    };

    // 2. Perform write transaction synchronously for both stores
    const db = await this.init();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['users', 'progress'], 'readwrite');
      const usersStore = transaction.objectStore('users');
      const progressStore = transaction.objectStore('progress');

      usersStore.put(dbUser);
      progressStore.put(defaultProgress);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });

    const user: User = {
      id: userId,
      name,
      email,
      createdAt: now,
      settings: dbUser.settings,
    };

    const token = this.generateToken();
    await this.saveSession(userId, token);

    return { user, token };
  }

  async loginUser(email: string, password: string): Promise<{ user: User; token: string; progress: LearningProgress }> {
    const dbUser = await this.getUserByEmail(email);
    if (!dbUser) {
      throw new Error('Invalid email or password.');
    }

    const hash = await this.hashPassword(password);
    if (dbUser.passwordHash !== hash) {
      throw new Error('Invalid email or password.');
    }

    const progress = await this.getProgress(dbUser.id);
    if (!progress) {
      throw new Error('User progress not found.');
    }

    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      createdAt: dbUser.createdAt,
      settings: dbUser.settings,
    };

    const token = this.generateToken();
    await this.saveSession(dbUser.id, token);

    return { user, token, progress };
  }

  private async getUserByEmail(email: string): Promise<DBUser | null> {
    const store = await this.getStore('users');
    const index = store.index('email');
    return new Promise((resolve, reject) => {
      const req = index.get(email);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  // Session Management
  async saveSession(userId: string, token: string): Promise<void> {
    const db = await this.init();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('session', 'readwrite');
      const store = transaction.objectStore('session');
      
      store.clear();

      const session: DBSession = {
        userId,
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      store.put(session);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getSession(): Promise<{ user: User; token: string; progress: LearningProgress } | null> {
    try {
      const store = await this.getStore('session');
      const sessions = await new Promise<DBSession[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      if (sessions.length === 0) return null;

      const session = sessions[0];
      if (Date.now() > session.expiresAt) {
        await this.clearSession();
        return null;
      }

      // Load user
      const userStore = await this.getStore('users');
      const dbUser = await new Promise<DBUser | null>((resolve, reject) => {
        const req = userStore.get(session.userId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });

      if (!dbUser) return null;

      // Load progress
      const progress = await this.getProgress(dbUser.id);
      if (!progress) return null;

      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        createdAt: dbUser.createdAt,
        settings: dbUser.settings,
      };

      return { user, token: session.token, progress };
    } catch (e) {
      console.warn('Failed to retrieve session from database:', e);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    const store = await this.getStore('session', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Progress Operations
  async getProgress(userId: string): Promise<LearningProgress | null> {
    const store = await this.getStore('progress');
    return new Promise((resolve, reject) => {
      const req = store.get(userId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async saveProgress(progress: LearningProgress): Promise<void> {
    const store = await this.getStore('progress', 'readwrite');
    await new Promise<void>((resolve, reject) => {
      const req = store.put(progress);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async updateUserSettings(userId: string, settings: User['settings']): Promise<void> {
    const store = await this.getStore('users', 'readwrite');
    const dbUser = await new Promise<DBUser | null>((resolve, reject) => {
      const req = store.get(userId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (!dbUser) return;

    dbUser.settings = settings;

    await new Promise<void>((resolve, reject) => {
      const req = store.put(dbUser);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async updateUserProfile(userId: string, data: { name?: string; avatar?: string; email?: string }): Promise<void> {
    const store = await this.getStore('users', 'readwrite');
    const dbUser = await new Promise<DBUser | null>((resolve, reject) => {
      const req = store.get(userId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (!dbUser) return;

    if (data.name) dbUser.name = data.name;
    if (data.avatar !== undefined) dbUser.avatar = data.avatar;
    if (data.email) dbUser.email = data.email;

    await new Promise<void>((resolve, reject) => {
      const req = store.put(dbUser);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const dbService = new IndexedDBService();
