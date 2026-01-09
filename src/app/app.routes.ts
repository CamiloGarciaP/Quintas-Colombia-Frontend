import { Routes } from '@angular/router';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from './features/pages/register/register';
import { Error } from './features/pages/error/error';

export const routes: Routes = [
    { path:'home', component: Home },
    { path:'login', component:Login },
    { path: 'register', component:Register },
    { path: '404', component:Error },
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: '404', pathMatch: 'full'},
];
