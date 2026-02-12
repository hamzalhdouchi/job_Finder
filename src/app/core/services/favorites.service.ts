import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface FavoriteOffer {
  id?: number;
  userId: number;
  offerId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url?: string;
  notes?: string;
  savedAt: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favoritesOffers`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getUserId(): number {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  loadFavorites(): Observable<FavoriteOffer[]> {
    const userId = this.getUserId();
    return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addFavorite(offer: Omit<FavoriteOffer, 'id' | 'userId' | 'savedAt'>): Observable<FavoriteOffer> {
    const userId = this.getUserId();

    return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offer.offerId}`).pipe(
      switchMap(existing => {
        if (existing.length > 0) {
          return throwError(() => new Error('This job is already in your favorites'));
        }

        const favorite: FavoriteOffer = {
          ...offer,
          userId,
          savedAt: new Date().toISOString()
        };

        return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
      })
    );
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateNotes(id: number, notes: string): Observable<FavoriteOffer> {
    return this.http.patch<FavoriteOffer>(`${this.apiUrl}/${id}`, { notes });
  }

  isFavorite(offerId: string): Observable<boolean> {
    const userId = this.getUserId();
    return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`).pipe(
      map(results => results.length > 0)
    );
  }
}
