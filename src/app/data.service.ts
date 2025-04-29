import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbName = 'GymDB';
  workoutStoreName = 'workout';
  exerciseTypeStoreName = 'exerciseType';
  private db!: IDBDatabase;

  constructor() {}

  init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;
        if (!this.db.objectStoreNames.contains(this.workoutStoreName)) {
          this.db.createObjectStore(this.workoutStoreName, { keyPath: 'id' });
        }
        if (!this.db.objectStoreNames.contains(this.exerciseTypeStoreName)) {
          this.db.createObjectStore(this.exerciseTypeStoreName, {
            keyPath: 'id',
          });
        }
      };
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');
        resolve();
      };
      request.onerror = (event: any) => {
        console.error('Error initializing database:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  addData(storeName: string, data: any): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }
  getAllData(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  updateData(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  deleteData(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
