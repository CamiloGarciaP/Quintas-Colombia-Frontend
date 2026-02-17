import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../../core/services/role.services';
import { HttpAuth } from '../../../../core/services/http-auth';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './request-list.html',
  styleUrls: ['./request-list.css']
})
export class RequestListComponent implements OnInit {

  requests: any[] = []; 

  constructor(
    private roleService: RoleService,
    private authService: HttpAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario esté autenticado antes de cargar las solicitudes
    const token = this.authService.getLocalStorageData().userStr;
    if (!token) {
      Swal.fire('Acceso denegado', 'Debes iniciar sesión para acceder a esta página.', 'warning');
      this.router.navigate(['/login']);
      return;
    }
    this.loadRequests();
  }

  loadRequests() {
    this.roleService.getAllRequests().subscribe({
      next: (res: any) => {
        // Tu backend devuelve { data: [...] } según el controlador getAllRoleRequests
        this.requests = res.data; 
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 401) {
          Swal.fire('Sesión expirada', 'Tu sesión ha expirado. Inicia sesión nuevamente.', 'warning');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          Swal.fire('Acceso denegado', 'No tienes permisos de Administrador para ver esta página.', 'error');
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  aprobar(request: any) {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      text: `El usuario ${request.user.fullName} será Propietario.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aprobar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        
        this.roleService.approveRequest(request._id).subscribe({
          next: (res: any) => {
            Swal.fire('¡Aprobado!', 'El usuario ha sido notificado por correo.', 'success');
            this.loadRequests(); // Recargamos la lista para ver el cambio de estado
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo aprobar la solicitud.', 'error');
          }
        });

      }
    });
  }

  rechazar(request: any) {
    Swal.fire({ 
      title: '¿Rechazar solicitud?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, rechazar'
    }).then((result : any) => {
      if (result.isConfirmed) {
        
        this.roleService.rejectRequest(request._id).subscribe({
          next: (res: any) => {
            Swal.fire('Rechazado', 'La solicitud ha sido rechazada.', 'success');
            this.loadRequests();
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
          }
        });

      }
    });
  }
}