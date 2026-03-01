import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpProperties } from '../../../../core/services/http-properties';
import { HttpAuth } from '../../../../core/services/http-auth'; // Para saber quién es el dueño
import { Property } from '../../../../core/interfaces/property';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule], // Necesario para que funcione tu [formGroup] en el HTML
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {
  formData!: FormGroup;
  pageTitle: string = 'Nueva Propiedad';
  isEditMode: boolean = false;
  serverError: string = '';
  currentOwnerId: string = ''; // Aquí guardaremos el ID del usuario logueado

  constructor(
    private fb: FormBuilder,
    private httpProperties: HttpProperties,
    private httpAuth: HttpAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos el ID del usuario logueado (Él será el 'owner')
    this.httpAuth.currentUser$.subscribe(user => {
      if (user && user._id) {
        this.currentOwnerId = user._id;
      }
    });

    // 2. Inicializamos el formulario con los campos planos de tu HTML
    this.initForm();

    // (Más adelante aquí agregaremos la lógica para el modo Edición)
  }

  // --- CONFIGURACIÓN DEL FORMULARIO ---
  initForm(): void {
    this.formData = this.fb.group({
      // Info Básica
      nameProperty: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      propertyType: ['', Validators.required],
      
      // Capacidad (Recuerda que los pusimos en null para que se vea el placeholder)
      maxGuests: [null, Validators.required],
      bedrooms: [null, Validators.required],
      beds: [null, Validators.required],
      bathrooms: [null, Validators.required],

      // Ubicación
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],

      // Precios
      pricePerNight: [null, Validators.required],
      currency: ['COP', Validators.required],
      cleaningFee: [0],
      minimumNights: [1],

      // Reglas y Estado
      houseRules: [''],
      isPublished: [false]
    });
  }

  // --- ENVÍO AL BACKEND ---
  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched(); // Muestra los mensajes de error en rojo
      this.serverError = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    this.serverError = '';
    const formValues = this.formData.value;

    // 3. EL TRUCO DE MAGIA: Transformamos los datos planos al formato anidado de tu Backend
    const newProperty: Property = {
      owner: this.currentOwnerId, // Asignamos el dueño automáticamente
      nameProperty: formValues.nameProperty,
      description: formValues.description,
      propertyType: formValues.propertyType,
      maxGuests: Number(formValues.maxGuests),
      bedrooms: Number(formValues.bedrooms),
      beds: Number(formValues.beds),
      bathrooms: Number(formValues.bathrooms),
      
      // Armamos el objeto Location
      location: {
        state: formValues.state,
        city: formValues.city,
        address: formValues.address,
        reference: formValues.reference,
        coordinates: { lat: 0, lng: 0 } // Coordenadas por defecto por ahora
      },
      
      // Armamos el objeto Pricing
      pricing: {
        pricePerNight: Number(formValues.pricePerNight),
        currency: formValues.currency,
        cleaningFee: Number(formValues.cleaningFee),
        minimumNights: Number(formValues.minimumNights)
      },

      houseRules: formValues.houseRules,
      isPublished: formValues.isPublished,
      isActive: true, // Activa por defecto al crear

      // 4. DATOS TEMPORALES (Mocks) para pasar las validaciones del backend
      // Como aún no tenemos input para subir imágenes ni seleccionar comodidades, 
      // enviamos datos por defecto para que Mongoose no nos rechace la petición.
      amenities: ['WiFi'], 
      photos: [{ 
        url: 'https://via.placeholder.com/800x600?text=Foto+de+la+Propiedad', 
        description: 'Foto principal' 
      }],
      
      // Fechas requeridas por la interfaz (El backend las sobreescribirá)
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 5. Enviamos la propiedad construida al servicio HTTP
    console.log('Enviando propiedad al backend:', newProperty);
    
    this.httpProperties.createProperty(newProperty).subscribe({
      next: (response) => {
        console.log('¡Propiedad creada con éxito!', response);
        alert('¡Propiedad creada correctamente!');
        this.router.navigate(['/dashboard/property/list']); // Redirigimos a la tabla
      },
      error: (err) => {
        console.error('Error del backend:', err);
        this.serverError = 'Ocurrió un error al guardar. Revisa la consola para más detalles.';
      }
    });
  }
}