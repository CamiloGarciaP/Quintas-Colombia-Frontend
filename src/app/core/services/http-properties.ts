import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http"; 
import { Observable } from "rxjs";
import { Property } from "../interfaces/property";

@Injectable({
    providedIn: 'root'
})
export class HttpProperties {
    
    private apiUrl = `${environment.apiUrl}/real-state`;

    constructor(private http: HttpClient) { }

    private get headers() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('X-Token', token || '');
    }

    getProperties(): Observable<Property[]> {
        return this.http.get<Property[]>(this.apiUrl, { headers: this.headers });
    }

    getPropertyById(id: string): Observable<Property> {
        return this.http.get<Property>(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
    
    createProperty(propertyData: FormData): Observable<any> {
        return this.http.post<any>(this.apiUrl, propertyData, { headers: this.headers });
    }

    updateProperty(id: string, propertyData: FormData): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, propertyData, { headers: this.headers });
    }

    deleteProperty(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}