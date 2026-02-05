import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class HttpUsers {
  private base_url: string = 'http://localhost:3000/api/v1';
  private slug: string = 'users'
  private slugUserList: string = 'edit' 

  // Se inyecta como dependencia la clase que permite hacer las peticiones HTTP
  constructor(private http: HttpClient,) {}

  //En el futuro se tiene que enviar aquí el token de autenticación para que el backend lo valide.
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/${this.slug}`, userData);
  }
  getUsers(): Observable<any[]> {
    return this.http
    .get<any>(`${this.base_url}/${this.slug}`)
    .pipe(
      map(response => response.data)
    );
  }
  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.base_url}/${this.slug}/${id}`, data);
  }
} 