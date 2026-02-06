import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpAuth } from '../../../../core/services/http-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private httpAuth: HttpAuth,
    private router: Router
  ){}

  logout(){
    this.httpAuth.logout();
    this.router.navigate(['/login']);
  }
}
