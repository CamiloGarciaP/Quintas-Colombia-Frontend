import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpProperties } from '../../../../core/services/http-properties';
import { HttpAuth } from '../../../../core/services/http-auth';
// Nota: Ya no importamos la interfaz Property aquí porque enviaremos un FormData

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
  
  propertyIdToEdit: string | null = null; 

  // 👇 NUEVA CAJA PARA GUARDAR LAS FOTOS ANTES DE ENVIARLAS 👇
  selectedFiles: File[] = []; 

  constructor(
    private fb: FormBuilder,
    private httpProperties: HttpProperties,
    private httpAuth: HttpAuth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.httpAuth.currentUser$.subscribe(user => {
      if (user && user._id) {
        this.currentOwnerId = user._id;
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.propertyIdToEdit = id;
        this.pageTitle = 'Editar Propiedad';
        this.loadPropertyData(id);
      }
    });
  }

  initForm(): void {
    this.formData = this.fb.group({
      nameProperty: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      propertyType: ['', Validators.required],
      maxGuests: [null, Validators.required],
      bedrooms: [null, Validators.required],
      beds: [null, Validators.required],
      bathrooms: [null, Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      reference: [''],
      pricePerNight: [null, Validators.required],
      currency: ['COP', Validators.required],
      cleaningFee: [0],
      minimumNights: [1],
      houseRules: [''],
      isPublished: [false]
    });
  }

  loadPropertyData(id: string): void {
    this.httpProperties.getPropertyById(id).subscribe({
      next: (property: any) => {
        const data = property.realStateFound ? property.realStateFound : property;

        this.formData.patchValue({
          nameProperty: data.nameProperty,
          description: data.description,
          propertyType: data.propertyType,
          maxGuests: data.maxGuests,
          bedrooms: data.bedrooms,
          beds: data.beds,
          bathrooms: data.bathrooms,
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

  // 👇 NUEVA FUNCIÓN PARA ATRAPAR LAS FOTOS DEL HTML 👇
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      // Convertimos la lista y limitamos a 10 fotos máximo
      this.selectedFiles = Array.from(files).slice(0, 10);
    }
  }

  // 👇 EL NUEVO ONSUBMIT CON FORMDATA 👇
  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      this.serverError = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    this.serverError = '';
    const formValues = this.formData.value;

    // 1. Creamos la "Maleta de viaje"
    const submitData = new FormData();

    // 2. Empacamos los datos simples (textos y números convertidos a texto)
    submitData.append('owner', this.currentOwnerId);
    submitData.append('nameProperty', formValues.nameProperty);
    submitData.append('description', formValues.description);
    submitData.append('propertyType', formValues.propertyType);
    submitData.append('maxGuests', formValues.maxGuests.toString());
    submitData.append('bedrooms', formValues.bedrooms.toString());
    submitData.append('beds', formValues.beds.toString());
    submitData.append('bathrooms', formValues.bathrooms.toString());
    submitData.append('houseRules', formValues.houseRules);
    submitData.append('isPublished', formValues.isPublished);

    // 3. Empacamos los objetos anidados convirtiéndolos en cadenas de texto JSON
    const locationObj = {
      state: formValues.state,
      city: formValues.city,
      address: formValues.address,
      reference: formValues.reference,
      coordinates: { lat: 0, lng: 0 }
    };
    submitData.append('location', JSON.stringify(locationObj));

    const pricingObj = {
      pricePerNight: formValues.pricePerNight,
      currency: formValues.currency,
      cleaningFee: formValues.cleaningFee,
      minimumNights: formValues.minimumNights
    };
    submitData.append('pricing', JSON.stringify(pricingObj));

    // Por ahora, enviamos comodidades por defecto
    submitData.append('amenities', JSON.stringify(['WiFi']));

    // 4. EMPACAMOS LAS FOTOS
    // Tienen que llevar el nombre 'images' para que Multer las reconozca en el backend
    this.selectedFiles.forEach((file) => {
      submitData.append('images', file);
    });

    // 5. ENVIAMOS AL BACKEND
    if (this.isEditMode && this.propertyIdToEdit) {
      
      this.httpProperties.updateProperty(this.propertyIdToEdit, submitData).subscribe({
        next: () => {
          alert('¡Propiedad actualizada correctamente con sus fotos!');
          this.router.navigate(['/dashboard/property/list']);
        },
        error: (error: any) => {
          console.error(error);
          this.serverError = 'Error al actualizar la propiedad.';
        }
      });

    } else {
      
      this.httpProperties.createProperty(submitData).subscribe({
        next: () => {
          alert('¡Propiedad creada correctamente con sus fotos!');
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