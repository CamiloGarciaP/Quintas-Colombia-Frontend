import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
//TODO Preguntar al profe como crear el Core/Services para usuarios.
// import { HttpUsers } from 'src/app/core/services/http/users/http-users.service';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  formData!: FormGroup;
  //TODO Hasta no tener el core/services/http/users no se puede inyectar el servicio.
  // constructor( private http: HttpUsers ) {}
}
