import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpUsers } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm implements OnInit {

  formData!: FormGroup;
  userId!: string;
  rolesList: string[] = ['Cliente', 'Propietario', 'Admin'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpUser: HttpUsers
  ) {}

  ngOnInit(): void {

    //Crea el formulario
    this.formData = this.fb.group({
      fullName: [''],
      username: [''],
      email: [''],
      phone: [''],
      roles: new FormArray(this.rolesList.map(() => new FormControl(false))),
      isActive: [true],
    });

    // ID desde la URL
    this.userId= this.route.snapshot.paramMap.get('id')!;


    // Obtiene los usuarios y carga los datos
    this.httpUser.getUsers().subscribe(users => {

      const user = users.find(u => u._id === this.userId);
      if (!user) {
        console.error('Usuario no encontrado por ID:', this.userId);
        return;
      }

      this.formData.patchValue({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
      });

      // Marca los checkboxes de los roles que tiene el usuario
      const rolesArray = this.formData.get('roles') as FormArray;
      this.rolesList.forEach((role, i) => {
        rolesArray.at(i).setValue(user.role?.includes(role) ?? false);
      });
    });
  }

  get rolesFormArray(): FormArray {
    return this.formData.get('roles') as FormArray;
  }

  onSubmit(): void {
    if (this.formData.invalid) return;

    // Convierte los checkboxes a un array de strings
    const selectedRoles = this.rolesList.filter((_, i) => this.rolesFormArray.at(i).value);

    const dataToSend = {
      ...this.formData.value,
      role: selectedRoles,  // Envía como 'role' (nombre del campo en el backend)
    };
    delete dataToSend.roles; // Elimina el campo auxiliar 'roles'

    this.httpUser.updateUser(this.userId, dataToSend)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/user/list']);
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
        }
      });
}

}

