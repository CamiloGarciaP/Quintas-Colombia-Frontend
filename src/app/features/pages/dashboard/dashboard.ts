import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpAuth } from '../../../core/services/http-auth';

export interface MenuItem {
  title: string;      
  route: string;      
  icon: string;       
  roles: string[];    
}
const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Lista de usuarios',
    route: 'user/list',
    icon: '',
    roles: ['Admin']
  },
  {
    title: 'Nuevo usuario',
    route: 'user/new',
    icon: '',
    roles: ['Admin']
  },
  {
    title: 'Solicitudes de roles',
    route: 'admin/requests',
    icon: '',
    roles: ['Admin']
  },
  {
    title: 'Lista de propiedades',
    route: 'property/list',
    icon: '',
    roles: ['Admin']
  },
  {
    title: 'Nueva propiedad',
    route: 'property/new',
    icon: '',
    roles: ['Admin', 'Propietario']
  },
  {
    title: 'Editar propiedad',
    route: 'property/edit/:id',
    icon: '',
    roles: ['Admin', 'Propietario']
  }
];
@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  menuItems: MenuItem[] = [];

  constructor (private httpAuth: HttpAuth) {}

  ngOnInit(): void {
    this.httpAuth.currentUser$.subscribe(user => {
      
      if (!user || !user.role) {
        this.menuItems = [];
        return;
      }

      const userRoles = user.role;

      this.menuItems = MENU_ITEMS.filter(item => {
        const tienePermiso = userRoles.some(rolUsuario => item.roles.includes(rolUsuario));
        return tienePermiso;
      });
    });
  }
}
