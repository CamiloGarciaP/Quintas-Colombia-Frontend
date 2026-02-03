import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpUsers } from '../../../../core/services/http-users';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm implements OnInit {

  formData!: FormGroup;
  userId!: string;

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
      role: [''],
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
        role: user.role,
        isActive: user.isActive,
      });
    });
  }

  onSubmit(): void {
    if (this.formData.invalid) return;

    this.httpUser.updateUser(this.userId, this.formData.value)
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

