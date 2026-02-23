import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { Error } from './features/pages/error/error';
import { UserList } from './features/pages/users/user-list/user-list';
import { UserNewForm } from './features/pages/users/user-new-form/user-new-form';
import { UserEditForm } from './features/pages/users/user-edit-form/user-edit-form';
import { Dashboard } from './features/pages/dashboard/dashboard';
import { RequestListComponent } from './features/pages/role-requests/request-list/request-list';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    { path:'home', component: Home },
    { path:'login', component:Login,canActivate: [publicGuard] },
    { path: 'register', component:Register, canActivate: [publicGuard] },
    { path: '404', component:Error },


    //NOTA: /dashboard es la ruta donde debe llegar cualquier usuario autenticado.
    { path:
         'dashboard',
          component: Dashboard,
           canActivate: [authGuard],    //Solo se pone authGuard, porque el roleGuard se pone en cada ruta hija.
           children: [
            { 
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            //NOTA: /dashboard/lo que sea son las rutas de usuarios autenticados con un rol específico( En este caso el Admin).
            { 
                path:
                'user/list',
                component: UserList,
                canActivate: [roleGuard],
                data: {roles: ['Admin']}
            },
            { 
                path:
                'user/new',
                component: UserNewForm,
                canActivate: [roleGuard],
                data: {roles: ['Admin']}
            },
            { 
                path:
                'user/edit/:id',
                component: UserEditForm,
                canActivate: [roleGuard],
                data: {roles: ['Admin']}
            },
            { 
                path:
                'admin/requests',
                component: RequestListComponent,
                canActivate: [roleGuard],
                data: {roles: ['Admin']} 
            },
            
           ]
    },

    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: '404', pathMatch: 'full'},
];
