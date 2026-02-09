import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/auth-response';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(credentials: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, credentials);
  }

  login(credentials: Partial<User>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }
  
  saveLocalStorageData( token: string , userData: User){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
