import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt?: string;
}

export interface AuthSession {
    user: User;
    expiresAt: number;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const SESSION_KEY = 'jobfinder_session';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/users`;
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidSession());

    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkSessionExpiration();
    }

    private hashPassword(password: string): string {
        return btoa(password + '_jobfinder_salt_2026');
    }

    private verifyPassword(password: string, hashedPassword: string): boolean {
        return this.hashPassword(password) === hashedPassword;
    }

    login(credentials: { email: string; password: string }): Observable<User> {
        const hashedPassword = this.hashPassword(credentials.password);

        return this.http.get<any[]>(`${this.apiUrl}?email=${credentials.email}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('Invalid email or password');
                }

                const user = users[0];

                const isValidPassword = user.password === hashedPassword || 
                                        user.password === credentials.password;

                if (!isValidPassword) {
                    throw new Error('Invalid email or password');
                }

                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword as User;
            })
        );
    }

    register(userData: { 
        firstName: string; 
        lastName: string; 
        email: string; 
        password: string;
    }): Observable<User> {
        return this.http.get<any[]>(`${this.apiUrl}?email=${userData.email}`).pipe(
            switchMap(existingUsers => {
                if (existingUsers.length > 0) {
                    return throwError(() => new Error('An account with this email already exists'));
                }

                const userToStore = {
                    ...userData,
                    password: this.hashPassword(userData.password),
                    createdAt: new Date().toISOString()
                };

                return this.http.post<any>(this.apiUrl, userToStore).pipe(
                    map(user => {
                        const { password, ...userWithoutPassword } = user;
                        return userWithoutPassword as User;
                    })
                );
            })
        );
    }

    checkEmailExists(email: string): Observable<boolean> {
        return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
            map(users => users.length > 0)
        );
    }

    updateProfile(id: number, data: Partial<User>): Observable<User> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, data).pipe(
            map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword as User;
            }),
            tap(user => {
                const session = this.getSession();
                if (session) {
                    this.setSession({ ...session.user, ...user });
                }
            })
        );
    }

    changePassword(id: number, currentPassword: string, newPassword: string): Observable<boolean> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            switchMap(user => {
                const isValidPassword = this.verifyPassword(currentPassword, user.password) ||
                                        user.password === currentPassword;

                if (!isValidPassword) {
                    return throwError(() => new Error('Current password is incorrect'));
                }

                return this.http.patch(`${this.apiUrl}/${id}`, {
                    password: this.hashPassword(newPassword)
                }).pipe(map(() => true));
            })
        );
    }

    deleteAccount(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.logout())
        );
    }

    setSession(user: User): void {
        const session: AuthSession = {
            user,
            expiresAt: Date.now() + SESSION_DURATION_MS
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.isAuthenticatedSubject.next(true);
    }

    getSession(): AuthSession | null {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (!sessionStr) return null;

        try {
            const session: AuthSession = JSON.parse(sessionStr);

            if (Date.now() > session.expiresAt) {
                this.logout();
                return null;
            }

            return session;
        } catch {
            this.logout();
            return null;
        }
    }

    getCurrentUser(): User | null {
        const session = this.getSession();
        return session?.user || null;
    }

    hasValidSession(): boolean {
        return this.getSession() !== null;
    }

    private checkSessionExpiration(): void {
        const session = this.getSession();
        if (!session) {
            this.isAuthenticatedSubject.next(false);
            return;
        }

        const timeUntilExpiry = session.expiresAt - Date.now();

        if (timeUntilExpiry <= 0) {
            this.logout();
        } else {
            setTimeout(() => {
                this.logout();
            }, timeUntilExpiry);
        }
    }

    logout(): void {
        localStorage.removeItem(SESSION_KEY);
        this.isAuthenticatedSubject.next(false);
    }

    refreshSession(): void {
        const session = this.getSession();
        if (session) {
            this.setSession(session.user);
        }
    }
}
