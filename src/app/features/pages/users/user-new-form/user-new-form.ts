import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpUsers } from '../../../../core/services/http-users';
import { required } from '@angular/forms/signals';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  formData!: FormGroup;
  constructor(private httpUsers: HttpUsers) {
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
  onSubmit() {
    console.log(this.formData.value);
    this.httpUsers.createUser(this.formData.value).subscribe({
      next: (data) => {
        console.log('Usuario creado exitosamente', data);
      },
      error: (error) => {
        console.error('Error, usuario no creado', error);
      },
      complete: () => {
        console.log('Solicitud de creación de usuario completada');
      }
    });
  }
}

