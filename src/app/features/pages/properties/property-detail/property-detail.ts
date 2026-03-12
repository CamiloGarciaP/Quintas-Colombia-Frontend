import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpProperties } from '../../../../core/services/http-properties';
import { Property } from '../../../../core/interfaces/property';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetail implements OnInit {
  propertyId: string | null = null;

  propertyData$!: Observable<Property>;

  constructor(
    private route: ActivatedRoute, // Para leer la URL
    private httpProperties: HttpProperties // Para hablar con el backend
  ) {}

  ngOnInit(): void {
    // 1. Atrapamos el ID de la URL
    this.propertyId = this.route.snapshot.paramMap.get('id');

    if (this.propertyId) {
      this.propertyData$ = this.httpProperties.getPropertyById(this.propertyId).pipe(
        map((respuesta: any) => respuesta.realStateFound)
      );
    }
  }
}