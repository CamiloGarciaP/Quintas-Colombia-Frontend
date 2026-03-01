import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { HttpProperties } from '../../../../core/services/http-properties';
import { Property } from '../../../../core/interfaces/property';

@Component({
  selector: 'app-property-list',
  imports: [RouterModule, DecimalPipe],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
})
export class PropertyList implements OnInit {
  
  // 1. Variable principal donde guardaremos los datos del backend
  properties: Property[] = [];

  // 2. Inyectamos nuestro servicio HTTP y el servicio de Rutas
  constructor(
    private httpProperties: HttpProperties,
    private router: Router
  ) {}

  // 3. inicio del componente
  ngOnInit(): void {
    this.loadProperties();
  }

  // Obtener todas las propiedades
  loadProperties(): void {
    this.httpProperties.getProperties().subscribe({
      next: (data: any) => {
        this.properties = data; // Guardamos los datos en nuestra variable
        console.log('Propiedades cargadas con éxito:', this.properties); // Para verla en la consola
      },
      error: (err: any) => {
        console.error('Error cargando las propiedades:', err);
      }
    });
  }

  // Navegar a la vista de edición llevando el ID
  goToEdit(id: string | undefined): void {
    if (id) {
      // Aquí es donde usamos la ruta dinámica que configuraste en app.routes.ts
      this.router.navigate(['/dashboard/property/edit', id]);
    }
  }

  // Eliminar una propiedad
  deleteProperty(id: string | undefined): void {
    // Siempre es buena práctica pedir confirmación antes de borrar algo en base de datos
    if (id && confirm('¿Estás completamente seguro de eliminar esta propiedad?')) {
      this.httpProperties.deleteProperty(id).subscribe({
        next: () => {
          // Si el backend responde que todo salió bien, recargamos la lista para que desaparezca
          this.loadProperties();
        },
        error: (err: any) => {
          console.error('Error al intentar eliminar:', err);
        }
      });
    }
  }
}