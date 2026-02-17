import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpAuth } from './http-auth';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/role-requests`;

  constructor(private http: HttpClient, private authService: HttpAuth) {}

  createRoleRequest(message: string): Observable<any> {
    const token = this.authService.getLocalStorageData().token;
    // Tu backend espera el header 'X-Token'
    const headers = new HttpHeaders({ 'X-Token': token || '' });
    
    return this.http.post(this.apiUrl, { message }, { headers });
  }

  // 1. Obtener TODAS las solicitudes (Para el Admin)
  getAllRequests(): Observable<any> {
    const token = this.authService.getLocalStorageData().token;
    const headers = new HttpHeaders({ 'X-Token': token || '' });
    return this.http.get(this.apiUrl, { headers });
  }

  // 2. Aprobar una solicitud
  approveRequest(idRequest: string): Observable<any> {
    const token = this.authService.getLocalStorageData().token;
    const headers = new HttpHeaders({ 'X-Token': token || '' });
    // Hacemos PATCH a /api/v1/role-requests/:id/approve
    return this.http.patch(`${this.apiUrl}/${idRequest}/approve`, {}, { headers });
  }

  // 3. Rechazar una solicitud
  rejectRequest(idRequest: string): Observable<any> {
    const token = this.authService.getLocalStorageData().token;
    const headers = new HttpHeaders({ 'X-Token': token || '' });
    // Hacemos PATCH a /api/v1/role-requests/:id/reject
    return this.http.patch(`${this.apiUrl}/${idRequest}/reject`, {}, { headers });
  }
}
