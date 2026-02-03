import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpUsers } from '../../../../core/services/http-users';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {

  public users$!: Observable<any[]>;

  constructor ( 
    private httpUser: HttpUsers
  ) {}

  ngOnInit(): void {
    this.users$ = this.httpUser.getUsers();
  }
}
