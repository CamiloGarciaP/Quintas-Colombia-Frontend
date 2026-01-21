import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from './features/shared/layout/header/header';
import { Footer } from './features/shared/layout/footer/footer';
import { Counter } from "./features/components/counter/counter";

@Component({
  selector: 'app-root',         //Es el componente que permite visualizar la aplicación.
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, Header, Footer, Counter],    //Importa las características, ya sean de terceros o propias.
})
export class App {
  protected readonly title = signal('frontend');
}
