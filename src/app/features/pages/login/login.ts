import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formData!: FormGroup;

  constructor(private httpAuth: HttpAuth) { 
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }
  
  onSubmit(){
    if(this.formData.valid){
      console.log(this.formData.value);
      this.httpAuth.login(this.formData.value).subscribe({
        next: (data) => {
          console.log('Usuario Logueado', data)
        },
        error: (error) => {
          console.log('Error al loguear el usuario', error)
        },
        complete: () => {
          console.log('Solicitud completada')
        }
      })
    }else{
      console.log('Formulario Invalido')
    }
  }
  
  onReset(){
    this.formData.reset();
    this.formData.markAsPristine();
    this.formData.markAsUntouched();
  }

}

