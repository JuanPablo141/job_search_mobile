import { Injectable, signal } from '@angular/core';

/**
 * Segundo Service obrigatório do projeto (Requisito 4: Mínimo 2 services).
 * Responsabilidade: Gerenciar estado e persistência local de favoritos (LocalStorage).
 * Não depende do HttpClient, atendendo à exigência de não duplicar serviços para a mesma API.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesStorageService {
  private readonly STORAGE_KEY = 'jobsearch_favorites_ids';

  // Angular Signal para reatividade instantânea entre páginas
  private favoritesSignal = signal<number[]>(this.loadFavoritesFromStorage());
  readonly favoriteIds = this.favoritesSignal.asReadonly();

  constructor() {}

  private loadFavoritesFromStorage(): number[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Erro ao ler favoritos do localStorage:', e);
    }
    // Favorito padrão inicial
    return [1];
  }

  private saveToStorage(ids: number[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
      this.favoritesSignal.set([...ids]);
    } catch (e) {
      console.error('Erro ao salvar favoritos no localStorage:', e);
    }
  }

  isFavorite(jobId: number): boolean {
    return this.favoritesSignal().includes(Number(jobId));
  }

  toggleFavorite(jobId: number): boolean {
    const numericId = Number(jobId);
    const current = this.favoritesSignal();
    let updated: number[];

    if (current.includes(numericId)) {
      updated = current.filter(id => id !== numericId);
    } else {
      updated = [...current, numericId];
    }

    this.saveToStorage(updated);
    return updated.includes(numericId);
  }

  getFavoriteCount(): number {
    return this.favoritesSignal().length;
  }

  clearFavorites(): void {
    this.saveToStorage([]);
  }
}
