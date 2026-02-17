import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpAuth } from '../../../../core/services/http-auth';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMenuOpen: boolean = false;

  constructor(
    public httpAuth: HttpAuth,
    private router: Router
  ){}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // get isLoggedIn(): boolean {
  //   return !!this.httpAuth.getToken();
  // }

  logout(): void {
    this.httpAuth.logout();
    this.router.navigate(['/login']);
  }
}
