import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  public async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      await this._storage?.set(key, value);
    } catch (error) {
      console.error(`Error setting item in storage: ${error}`);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this._storage?.get(key);
      return value as T;
    } catch (error) {
      console.error(`Error getting item from storage: ${error}`);
      return null;
    }
  }

  public async remove(key: string): Promise<void> {
    try {
      await this._storage?.remove(key);
    } catch (error) {
      console.error(`Error removing item from storage: ${error}`);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this._storage?.clear();
    } catch (error) {
      console.error(`Error clearing storage: ${error}`);
    }
  }

  public async keys(): Promise<string[]> {
    try {
      return (await this._storage?.keys()) || [];
    } catch (error) {
      console.error(`Error retrieving keys from storage: ${error}`);
      return [];
    }
  }

  public async getAllItems(): Promise<{ [key: string]: any }> {
    const items: { [key: string]: any } = {};
    const keys = await this.keys();

    for (const key of keys) {
      const value = await this.get(key);
      items[key] = value;
    }
    return items;
  }
}
