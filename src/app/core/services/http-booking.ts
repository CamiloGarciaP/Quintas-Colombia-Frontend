import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class HttpBookingService {
  
  // Asumiendo que la ruta en tu backend de Node.js es algo como /api/booking
  private apiUrl = `${environment.apiUrl}/booking`; 

  constructor(private http: HttpClient) {}

  // Método para disparar la reserva hacia el Backend
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }
}