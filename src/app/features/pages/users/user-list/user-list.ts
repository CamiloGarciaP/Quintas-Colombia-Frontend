import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  public users$: Observable<any[]> = new Observable<any[]>();

  constructor ( private httpClient: HttpClient ) {}

  // Usamos el Hook de ciclo de vida que avisa que se esta iniciando el componente
  // ngOnInit(){
  //   this.users$ = this.httpClient.getUser()
  // }




}
