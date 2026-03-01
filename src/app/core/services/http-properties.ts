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
    
    createProperty(property: Property): Observable<Property> {
        return this.http.post<Property>(this.apiUrl, property, { headers: this.headers });
    }

    updateProperty(property: Property): Observable<Property> {
        return this.http.put<Property>(`${this.apiUrl}/${property._id}`, property, { headers: this.headers });
    }

    deleteProperty(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}