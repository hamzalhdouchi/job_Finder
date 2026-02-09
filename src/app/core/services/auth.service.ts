import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}?email=${credentials.email}`).pipe(
            map(users => {
                const user = users.find(u => u.password === credentials.password);
                if (user) {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                } else {
                    throw new Error('Invalid credentials');
                }
            })
        );
    }

    register(user: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}?email=${user.email}`).pipe(
            switchMap(existingUsers => {
                if (existingUsers.length > 0) {
                    return throwError(() => new Error('Email already exists'));
                }

                return this.http.post(this.apiUrl, user);
            })
        );
    }

    updateProfile(id: number, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, data);
    }

    deleteAccount(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    setSession(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getSession(): any {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    logout() {
        localStorage.removeItem('user');
    }
}
