import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpUsers } from '../../../../core/services/http-users';
// import { required } from '@angular/forms/signals';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  formData!: FormGroup;
  registerSubscirbed!: Subscription


  constructor(
    private httpUsers: HttpUsers,
    private router: Router
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
      this.httpUsers.createUser(this.formData.value).subscribe({
        next: (data) => {
          console.log('Usuario creado exitosamente', data);
          this.formData.reset(); //Resetea el formulario
          //Aquí se redirige a otra página
          //TODO Revisar la ruta de UserList
          this.router.navigateByUrl('/dashboard/user/edit/:id')
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.formData.markAllAsTouched();//Marca todos los campos como tocados (sirve para limpiar el formulario)
          console.log('Solicitud de creación de usuario completada');
        }
      });
    }
    else{
      //1. Muestre todos lo mensajes de error de cada uno de los campos en la vista.
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

