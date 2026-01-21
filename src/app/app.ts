import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from './features/shared/layout/header/header';
import { Footer } from './features/shared/layout/footer/footer';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/login/login';
import { Register } from "./features/pages/register/register";
import { Error } from './features/pages/error/error';

@Component({
  selector: 'app-root',         //Es el componente que permite visualizar la aplicación.
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet,
    Header,
    Footer,
    Home,
    Login,
    Register,
    Error
  ],     //Importa las características, ya sean de terceros o propias.
})
export class App {
  protected readonly title = signal('frontend');
}
