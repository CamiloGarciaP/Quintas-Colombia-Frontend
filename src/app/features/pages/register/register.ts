import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpUsers } from '../../../core/services/user.service';
// import { required } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  formData!: FormGroup;
  registerSubscirbed!: Subscription;
  
  serverError: string | null = null; 


  constructor(
    private httpUsers: HttpUsers,
    private router: Router,
    private httpAuth: HttpAuth
  ) {
  //Definie la estructura del formulario
    this.formData = new FormGroup({
      fullName: new FormControl('', [ Validators.required ]),
      username: new FormControl('', [ Validators.required ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(8),  ]),
      phone: new FormControl(''),
      role: new FormControl('Cliente'),
      isActive: new FormControl(true),
    });
  }
  //Getters
  get fullName(){
    return this.formData.get('fullName');
  }
  get username(){
    return this.formData.get('usernmane');
  }
  get email(){
    return this.formData.get('email');
  }
  get password(){
    return this.formData.get('password');
  }
  get phone(){
    return this.formData.get('phone');
  }
  get role(){
    return this.formData.get('role');
  }

  //Método con el que vamos a capturar los datos del formulario al presionar el botón de 'Crear Usuario'
  onSubmit() {

    //Verificar si el formulario es válido
    //IMPORTANTE:Si los campos del formulario no tienen validaciones, el formulario siempre será válido.
    if(this.formData.valid){
      console.log(this.formData.value);
      
      this.httpAuth.register(this.formData.value).
      subscribe ({
        next: (data) => {
          console.log('Usuario Creado', data)
          // Voy a redireccionar al login
          this.router.navigate(['/login'])
        },
        error: (error) => {
          console.log('Error al crear el usuario', error)
        },
        complete: () => {
          console.log('Solicitud completada')
        }
      });
      }else{
        console.log('Formulario Invalido')
      }
    }

  ngOnDestroy(): void {
    console.info('ngOnDestroy')
    if(this.registerSubscirbed){
      console.info('unSubscribe')
      this.registerSubscirbed?.unsubscribe();   //Desuscribirme manualmente
    }
  }
}

