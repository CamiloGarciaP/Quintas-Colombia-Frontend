import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpUsers {
  constructor(private http: HttpClient) {}

  //En el futuro se tiene que enviar aquí el token de autenticación para que el backend lo valide.
  createUser(userData: any) {
    return this.http.post('http://localhost:3000/api/v1/users', userData);
  }
} 