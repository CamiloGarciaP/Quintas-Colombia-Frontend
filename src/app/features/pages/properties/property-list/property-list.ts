import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, DecimalPipe } from '@angular/common'; 
import { HttpProperties } from '../../../../core/services/http-properties';
import { Property } from '../../../../core/interfaces/property';
import { Observable, map } from 'rxjs'; 

@Component({
  selector: 'app-property-list',
  imports: [RouterModule, DecimalPipe, AsyncPipe], 
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
})
export class PropertyList implements OnInit {
  
  public properties$!: Observable<Property[]>;

  constructor(
    private httpProperties: HttpProperties,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.properties$ = this.httpProperties.getProperties().pipe(
      map((data: any) => {
        const properties = data.realStates ? data.realStates : data;
        console.log('Propiedades reactivas cargadas:', properties);
        return properties;
      })
    );
  }

  goToEdit(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/dashboard/property/edit', id]);
    }
  }

    deleteProperty(id: string | undefined): void {
    if (id && confirm('¿Estás completamente seguro de eliminar esta propiedad?')) {
      this.httpProperties.deleteProperty(id).subscribe({
        next: () => {
          this.loadProperties(); 
        },
        error: (err: any) => {
          console.error('Error al intentar eliminar:', err);
        }
      });
    }
  }
}