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

export const routes: Routes = [
    { path:'home', component: Home },
    { path:'login', component:Login },
    { path: 'register', component:Register },
    { path: '404', component:Error },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'dashboard/user/list', component: UserList, canActivate: [authGuard]},
    { path: 'dashboard/user/new', component: UserNewForm, canActivate: [authGuard] },
    { path: 'dashboard/user/edit/:id',component: UserEditForm, canActivate: [authGuard]},
    {path: 'dashboard/admin/requests', component: RequestListComponent, canActivate: [authGuard]},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: '404', pathMatch: 'full'},
];
