import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {
  constructor(private http: HttpClient) {}

  register(credentials: User) : Observable<User> {
    return this.http.post<User>( 'http://localhost:3000/api/v1/auth/register', credentials);
  }

  login(credentials: User) : Observable<User> {
    return this.http.post<User>( 'http://localhost:3000/api/v1/auth/login', credentials);
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
