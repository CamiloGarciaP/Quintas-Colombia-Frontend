import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpProperties } from '../../../../core/services/http-properties';
import { HttpAuth } from '../../../../core/services/http-auth';
import { Property } from '../../../../core/interfaces/property';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {
  formData!: FormGroup;
  pageTitle: string = 'Nueva Propiedad';
  isEditMode: boolean = false;
  serverError: string = '';
  currentOwnerId: string = '';
  
  // Nueva variable para guardar el ID de la propiedad que estamos editando
  propertyIdToEdit: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private httpProperties: HttpProperties,
    private httpAuth: HttpAuth,
    private router: Router,
    private route: ActivatedRoute // El "lector" de URLs de Angular
  ) {}

  ngOnInit(): void {
    // 1. Iniciamos el formulario vacío por defecto
    this.initForm();

    // 2. Obtenemos el dueño actual
    this.httpAuth.currentUser$.subscribe(user => {
      if (user && user._id) {
        this.currentOwnerId = user._id;
      }
    });

    // 3. Revisamos la URL para saber si estamos en MODO EDICIÓN
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.propertyIdToEdit = id;
        this.pageTitle = 'Editar Propiedad'; // Cambiamos el título visual
        this.loadPropertyData(id); // Traemos los datos del backend
      }
    });
  }

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

  // --- NUEVO MÉTODO: CARGAR DATOS PARA EDITAR ---
  loadPropertyData(id: string): void {
    this.httpProperties.getPropertyById(id).subscribe({
      next: (property: any) => {
        // Red de seguridad por si el backend devuelve { realStateFound: {...} } o el objeto directo
        const data = property.realStateFound ? property.realStateFound : property;

        // MAGIA: patchValue llena automáticamente los inputs de tu HTML
        this.formData.patchValue({
          nameProperty: data.nameProperty,
          description: data.description,
          propertyType: data.propertyType,
          maxGuests: data.maxGuests,
          bedrooms: data.bedrooms,
          beds: data.beds,
          bathrooms: data.bathrooms,
          // Desempaquetamos los objetos anidados para los inputs planos
          state: data.location?.state,
          city: data.location?.city,
          address: data.location?.address,
          reference: data.location?.reference,
          pricePerNight: data.pricing?.pricePerNight,
          currency: data.pricing?.currency,
          cleaningFee: data.pricing?.cleaningFee,
          minimumNights: data.pricing?.minimumNights,
          houseRules: data.houseRules,
          isPublished: data.isPublished
        });
      },
      error: (err) => {
        console.error('Error al cargar la propiedad:', err);
        this.serverError = 'No se pudo cargar la información de la propiedad.';
      }
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

    // Armamos la propiedad como lo pide el backend
    const propertyData: Property = {
      owner: this.currentOwnerId,
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
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // DECISIÓN: ¿Actualizamos o Creamos?
    if (this.isEditMode && this.propertyIdToEdit) {
      
      // Si estamos editando, le pegamos el ID a la propiedad para que el backend sepa a quién actualizar
      propertyData._id = this.propertyIdToEdit;
      
      this.httpProperties.updateProperty(propertyData).subscribe({
        next: () => {
          alert('¡Propiedad actualizada correctamente!');
          this.router.navigate(['/dashboard/property/list']);
        },
        error: (error: any) => {
          console.error(error);
          this.serverError = 'Error al actualizar la propiedad.';
        }
      });

    } else {
      
      // Mismo código de creación que ya teníamos
      this.httpProperties.createProperty(propertyData).subscribe({
        next: () => {
          alert('¡Propiedad creada correctamente!');
          this.router.navigate(['/dashboard/property/list']);
        },
        error: (error: any) => {
          console.error(error);
          this.serverError = 'Error al guardar la propiedad.';
        }
      });
    }
  }
}