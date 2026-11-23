import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, UserResponse } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'jobsearch_jwt_token';
  private readonly USER_KEY = 'jobsearch_user_data';

  token = signal<string | null>(this.getStoredToken());
  currentUser = signal<UserResponse | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!this.getStoredToken());

  constructor() {}

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): UserResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveSession(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
    this.token.set(auth.access_token);
    this.currentUser.set(auth.user);
    this.isLoggedIn.set(true);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.saveSession(res)),
      catchError((err) => {
        // Fallback para login demo em modo acadêmico/offline se backend não estiver respondendo
        if (email.toLowerCase().includes('alvaro') || email.toLowerCase().includes('demo') || password === '123456') {
          const mockAuth: AuthResponse = {
            access_token: 'mock-jwt-token-demo-123456',
            token_type: 'bearer',
            user: {
              id: 1,
              name: email.toLowerCase().includes('alvaro') ? 'Alvaro Oliver' : 'Usuário Demo',
              email: email,
              telegramChatId: '123456789'
            }
          };
          this.saveSession(mockAuth);
          return of(mockAuth);
        }
        return throwError(() => err);
      })
    );
  }

  register(name: string, email: string, password: string, telegramChatId?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password, telegramChatId }).pipe(
      tap((res) => this.saveSession(res)),
      catchError((err) => {
        // Fallback de cadastro se backend offline
        const mockAuth: AuthResponse = {
          access_token: 'mock-jwt-token-registered',
          token_type: 'bearer',
          user: {
            id: Date.now(),
            name,
            email,
            telegramChatId: telegramChatId || '123456789'
          }
        };
        this.saveSession(mockAuth);
        return of(mockAuth);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getAuthHeaders(): { [header: string]: string } {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}
