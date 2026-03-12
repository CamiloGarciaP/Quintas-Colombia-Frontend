import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { HttpProperties } from '../../../core/services/http-properties'; 
import { Property } from '../../../core/interfaces/property'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  // Aquí guardaremos las propiedades que lleguen del backend
  properties$!: Observable<Property[]>;

  // Inyectamos nuestro servicio
  constructor(private httpProperties: HttpProperties) {}

  ngOnInit(): void {
    // Al iniciar la página, disparamos la petición al servidor
    this.properties$ = this.httpProperties.getProperties().pipe(
      map((respuesta: any) => respuesta.realStates.slice(0, 3))
    );
  }
}
