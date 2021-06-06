import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  save<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key)) as T;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
