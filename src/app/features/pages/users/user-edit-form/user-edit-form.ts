import { HttpAuth } from '../../../../core/services/http-auth';
import { RoleService } from '../../../../core/services/role.services';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpUsers } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm implements OnInit {

  formData!: FormGroup;
  userId!: string;
  rolesList: string[] = ['Cliente', 'Propietario', 'Admin'];
  isOwnProfile: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpUser: HttpUsers,
    private httpAuth: HttpAuth,
    private roleService: RoleService
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
    this.userId = this.route.snapshot.paramMap.get('id')!;
    
    const currentUser: any = this.httpAuth.getLocalStorageData().userStr;

    if(currentUser && currentUser._id === this.userId){
      this.isOwnProfile = true;
    }

    //Normalizar el rol: si llega como string, convertirlo a array
    const allowedRoles = ['Admin', 'Cliente', 'Propietario'];
    const userRoles = Array.isArray(currentUser?.role) ? currentUser.role : [currentUser?.role];

    //Validar si al menos uno de los roles del usuario está en la lista de roles permitidos
    const hasPermission = userRoles.some((r: string) => allowedRoles.includes(r));
    if (!hasPermission){
        return alert(`Error: El rol ${currentUser?.role} no tiene permiso para realizar esta acción`);
    }

    //Verificar si el usuario es Admin
    this.isAdmin = userRoles.includes('Admin');

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
        if(!currentUser?.role?.includes('Admin')){
          rolesArray.at(i).disable();
        }
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

    solicitarCambioRol(): void {
      const message = "Hola, solicito ser Propietario para publicar mis fincas.";
      
      // Preguntamos al usuario si está seguro
      if(confirm('¿Estás seguro de solicitar el rol de Propietario?')) {
          this.roleService.createRoleRequest(message).subscribe({
            next: () => {
              alert('¡Solicitud enviada! Te notificaremos por correo.');
            },
            error: (err) => {
              console.error(err);
              // Si el backend responde 409 es que ya tiene una pendiente
              if(err.status === 409) {
                alert('Ya tienes una solicitud pendiente en revisión.');
              } else {
                alert('Error al enviar la solicitud.');
              }
            }
          });
      }
    }


}

