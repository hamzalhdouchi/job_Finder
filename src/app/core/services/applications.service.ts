import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Application {
  id?: number;
  userId: number;
  offerId: string;
  apiSource: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: 'en_attente' | 'accepte' | 'refuse';
  notes: string;
  dateAdded: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private apiUrl = `${environment.apiUrl}/applications`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getUserId(): number {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  loadApplications(): Observable<Application[]> {
    const userId = this.getUserId();
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&_sort=dateAdded&_order=desc`);
  }

  addApplication(data: Omit<Application, 'id' | 'userId' | 'status' | 'dateAdded'>): Observable<Application> {
    const userId = this.getUserId();

    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&offerId=${data.offerId}`).pipe(
      switchMap(existing => {
        if (existing.length > 0) {
          return throwError(() => new Error('You are already tracking this application'));
        }

        const application: Application = {
          ...data,
          userId,
          status: 'en_attente',
          dateAdded: new Date().toISOString()
        };

        return this.http.post<Application>(this.apiUrl, application);
      })
    );
  }

  updateStatus(id: number, status: Application['status']): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
  }

  updateNotes(id: number, notes: string): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
