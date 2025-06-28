/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string; role: string }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }
signup(data: { email: string; password: string }) {
  return this.http.post(`${this.apiUrl}/signup`, data);
}
  saveToken(token: string, role?: string) {
    localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // THIS MUST RETURN A BOOLEAN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
*/
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Credentials { email: string; password: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  /* In‑memory store */
  private users: Credentials[] = [
    { email: 'test@example.com', password: '123456' }
  ];
  private readonly dummyToken = 'dummy-jwt-token';

  login(cred: Credentials): Observable<{ token: string }> {
    const found = this.users.find(u => u.email === cred.email && u.password === cred.password);
    return found ? of({ token: this.dummyToken }).pipe(delay(300))
                 : throwError(() => new Error('Invalid credentials'));
  }

  signup(cred: Credentials): Observable<{ token: string }> {
    if (this.users.some(u => u.email === cred.email)) {
      return throwError(() => new Error('Email already in use'));
    }
    this.users.push(cred);
    return of({ token: this.dummyToken }).pipe(delay(300));
  }

  /* token helpers */
  saveToken(token: string) { localStorage.setItem('auth_token', token); }
  getToken()              { return localStorage.getItem('auth_token'); }
  isLoggedIn()            { return !!this.getToken(); }
  logout()                { localStorage.removeItem('auth_token'); }
}
