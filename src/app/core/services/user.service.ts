import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
// import { User, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class HttpUsers {
  private apiUrl = `${environment.apiUrl}/users`;       //remplaza base_url y slug

  // Se inyecta como dependencia la clase que permite hacer las peticiones HTTP
  constructor(private http: HttpClient,) {}

  //En el futuro se tiene que enviar aquí el token de autenticación para que el backend lo valide.
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, userData);
  }
  getUsers(): Observable<any[]> {
    return this.http
    .get<any>(`${this.apiUrl}`)
    .pipe(
      map(response => response.data)
    );
  }
  updateUser(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }
} 