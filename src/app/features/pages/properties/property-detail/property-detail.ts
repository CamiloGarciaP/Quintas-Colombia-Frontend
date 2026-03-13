import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { Observable, map, take } from 'rxjs';
import { HttpProperties } from '../../../../core/services/http-properties';
import { Property } from '../../../../core/interfaces/property';
import { HttpAuth } from '../../../../core/services/http-auth'; 
import { HttpBookingService } from '../../../../core/services/http-booking';



@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], 
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetail implements OnInit {
  propertyId: string | null = null;
  propertyData$!: Observable<Property>; 
  
  bookingForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private httpProperties: HttpProperties,
    private httpAuth: HttpAuth,
    private httpBookingService: HttpBookingService

  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');

    // Inicializamos el formulario vacío
    this.bookingForm = new FormGroup({
      llegada: new FormControl('', Validators.required),
      salida: new FormControl('', Validators.required)
    });

    if (this.propertyId) {
      this.propertyData$ = this.httpProperties.getPropertyById(this.propertyId).pipe(
        map((respuesta: any) => respuesta.realStateFound)
      );
    }
  }

  continuarReserva() {
    // 1. Validar que los campos no estén vacíos
    if (this.bookingForm.invalid) {
      alert("Por favor selecciona las fechas de llegada y salida.");
      return;
    }

    // 2. Lógica de Calendario: Validar fechas lógicas
    const llegada = new Date(this.bookingForm.value.llegada);
    const salida = new Date(this.bookingForm.value.salida);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Reseteamos la hora para comparar solo días

    if (llegada < hoy) {
      alert("La fecha de llegada no puede ser en el pasado.");
      return;
    }

    if (salida <= llegada) {
      alert("La fecha de salida debe ser estrictamente posterior a la de llegada.");
      return;
    }

    // (Nota: La validación de fechas "ya ocupadas" la conectaremos cuando traigamos el arreglo de reservas del Backend).

    // 3. Redirección Inteligente (Pausar o Continuar)
    this.httpAuth.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        alert("Para reservar debes tener una cuenta. Te redirigiremos para que te registres.");
        this.router.navigate(['/register'], { queryParams: { returnUrl: this.router.url } });
      } else {
        const reservaPayload = {
          propertyId: this.propertyId,
          checkIn: this.bookingForm.value.llegada,
          checkOut: this.bookingForm.value.salida
        };

        console.log("Enviando reserva al backend...", reservaPayload);

        this.httpBookingService.createBooking(reservaPayload).subscribe({
          next: (respuesta) => {
            console.log("¡Reserva exitosa en la Base de Datos!", respuesta);
            alert("¡Felicidades! Tu reserva ha sido confirmada.");
            this.router.navigate(['/home']); 
          },
          error: (err) => {
            console.error("Error al crear la reserva:", err);
            alert("Hubo un problema al procesar tu reserva. Intenta de nuevo.");
          }
        });
      }
    });
  }
}