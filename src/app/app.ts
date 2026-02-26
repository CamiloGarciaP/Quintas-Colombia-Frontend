import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { Header } from './features/shared/layout/header/header';
import { Footer } from './features/shared/layout/footer/footer';

@Component({
  selector: 'app-root',         //Es el componente que permite visualizar la aplicación.
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, Header, Footer ],     //Importa las características, ya sean de terceros o propias.
})
export class App implements OnInit {    //Implemenctación del OnInit
  protected readonly title = signal('frontend');
  
  //Variable para mostrar/oculatr el diseño público.
  showPublicLayout: boolean = true;

  //Inyecta el servicio de Roter
  constructor(private router: Router) {}

  //Se inicia el componente
  ngOnInit() {
    this.router.events.subscribe((event) => {
      //Detecta el fin de la navegación
      if (event instanceof NavigationEnd) {
        //Si la URL incluye '/dashboard', oculta el diseño público
        if(event.urlAfterRedirects.includes('/dashboard')){
          this.showPublicLayout = false;
        }else{
          this.showPublicLayout = true;
        }
      }
    });  
  }
}
