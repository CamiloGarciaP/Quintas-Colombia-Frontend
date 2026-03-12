import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { HttpProperties } from '../../../../core/services/http-properties'; 
import { Property } from '../../../../core/interfaces/property';

@Component({
  selector: 'app-public-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-property-list.html',
  styleUrl: './public-property-list.css'
})
export class PublicPropertyList implements OnInit {
  // Observable para guardar la lista de fincas
  properties$!: Observable<Property[]>;

  // Inyectamos el servicio
  constructor(private httpProperties: HttpProperties) {}

  ngOnInit(): void {
    this.properties$ = this.httpProperties.getProperties().pipe(
      map((respuesta: any) => respuesta.realStates)
    );
  }
}