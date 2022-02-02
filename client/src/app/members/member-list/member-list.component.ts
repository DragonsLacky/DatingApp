import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: any;
  user: User;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getUsers();
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe((response) => {
      this.user = response;
    });
  }

  getUsers() {
    this.http
      .get('https://localhost:5001/api/users', {
        headers: {
          Authorization: `bearer ${this.user.token}`,
        },
      })
      .subscribe(
        (response: any) => {
          console.log(response)
          if (response.length !== undefined) {
            this.users = response;
          } else {
            this.users = [response];
          }
        },
        (error) => console.error(error)
      );
  }
}
