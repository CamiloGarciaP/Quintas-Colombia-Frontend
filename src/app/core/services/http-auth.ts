import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/auth-response';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {
  private apiUrl = environment.apiUrl;
  private currentToken = new BehaviorSubject<string | null>(null);
  private currentUser = new BehaviorSubject<User | null>(null);


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
  getToken(): string | null{
    return localStorage.getItem('token');
  }
  getUser(): User | null{
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  getLocalStorageData(){
    const token = localStorage.getItem('token');
    this.currentToken.next(token ? token : null)
    
    const userStr = localStorage.getItem('user');
    this.currentUser.next(userStr ? JSON.parse(userStr) : null);

    return {token, userStr};
  }

  clearLocalStorageData(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentToken.next(null);
    this.currentUser.next(null);
  }

  checkAuthStatus(){
    //Paso1: Verificar si el token existe en el localStorage 
    const {token} = this.getLocalStorageData();
    //Responder al cliente si no existe el token(false) o si existe(true)
    if( ! token ){
      this.clearLocalStorageData(); //Limpiar cualquier dato residual en caso de que el token no exista
      return false;               //Bloquea el flujo de la logica del algoritmo
    }

    //Paso2: Crear el encabezado con el nombre del campo que va a contener el token enviado por el backend
    const headers = new HttpHeaders().set( 'X-Token', token );
    
    //Paso3: Realizar la peticion al backend para verificar el estado de autenticacion
    return this.http.get(`${this.apiUrl}/renewtoken`, {headers})
    return true;        //Permite el flujo de la logico del algoritmo
  }
}
