import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../interfaces/user';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {
  private apiUrl = environment.apiUrl;

  // 1.  BehaviorSubject para manejar los datos del usuario y el token (Fuente de persistencia de datos)
  private currentToken = new BehaviorSubject<string | null>(null);
  private currentUser = new BehaviorSubject<User | null>(null);

    // 2. Definir el Observable para datos actuales
  public currentUser$ = this.currentUser.asObservable();
  public currentToken$ = this.currentToken.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Inicializar los datos del usuario y el token desde el local storage si existen (Esto asegura persistencia al recargar la página)
    this.getLocalStorageData();
  }

  register(credentials: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, credentials);
  }

  login(credentials: Partial<User>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(
      tap( data => {
        if(data.token && data.user){
          this.currentToken.next(data.token);
          this.currentUser.next(data.user);
          this.saveLocalStorageData(data.token, data.user);
          this.router.navigate(['/dashboard']);
        }
      })
    )
  }
  
  saveLocalStorageData( token: string , userData: User){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    this.currentToken.next( token );
    this.currentUser.next( userData );
  }
  logout(){
    this.clearLocalStorageData();
    this.router.navigate(['/login']);
  }
  // getToken(): string | null{
  //   return localStorage.getItem('token');
  // }
  // getUser(): User | null{
  //   const userStr = localStorage.getItem('user');
  //   return userStr ? JSON.parse(userStr) : null;
  // }
  getLocalStorageData(){
    const token = localStorage.getItem('token');
    this.currentToken.next(token ? token : null)
    
    const userStr: any = localStorage.getItem('user');
    this.currentUser.next(userStr ? JSON.parse(userStr) : null);

    return {
      token: token ? token : undefined, 
      userStr: userStr?JSON.parse(userStr) : undefined };
  }

  clearLocalStorageData(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentToken.next(null);
    this.currentUser.next(null);
  }

  checkAuthStatus(): Observable<boolean>{
    //Paso1: Verificar si el token existe en el localStorage 
    const {token} = this.getLocalStorageData();
    console.log(token);
    //Responder al cliente si no existe el token(false) o si existe(true)
    if( ! token ){
      this.clearLocalStorageData(); //Limpiar cualquier dato residual en caso de que el token no exista
      return of(false);               //Bloquea el flujo de la logica del algoritmo
    }

    //Paso2: Crear el encabezado con el nombre del campo que va a contener el token enviado por el backend
    const headers = new HttpHeaders().set( 'X-Token', token );

    //Paso3: Realizar la peticion al backend para verificar el estado de autenticacion
    return this.http.get<any>(`${this.apiUrl}/auth/renewtoken`, {headers})
      .pipe(
        tap( ( response ) => {
          console.log('Respuesta del backend', response);
        }),
        map( ( response ) => {
          console.info(response);
          if (!response.token && !response.user){
            return false;
          }
          //Paso4: Actualizar el estado de autenticacion
          this.saveLocalStorageData(response.token, response.user);     //Actualiza los datos en el local Storage
          return true;                                            //Permite el flujo de la logico del algoritmo
        }),
        catchError( error => {
          console.error('ERROR:', error);
          return of(false);          
        })
      );
  }
}
