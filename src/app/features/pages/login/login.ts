import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAuth } from '../../../core/services/http-auth';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formData!: FormGroup;
  public showPassword: boolean = false;

  constructor(
    private httpAuth: HttpAuth
  ) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.formData.valid) {
      // console.log(this.formData.value); // Se eliminó para no mostrar la contraseña en consola
      this.httpAuth.login(this.formData.value).subscribe({
        next: (data) => {
          console.log('Usuario Logueado', data);
        },
        error: (error) => {
          console.log('Error al loguear el usuario', error);
        },
        complete: () => {
          console.log('Solicitud completada');
          this.formData.reset();
        }
      });
    } else {
      console.log('Formulario Invalido');
    }
  }

  onReset(): void {
    this.formData.reset();
    this.formData.markAsPristine();
    this.formData.markAsUntouched();
  }
}
