import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css'],
})
export class TestErrorsComponent implements OnInit {
  baseUrl = environment.apiUrl;
  controller = 'Buggy';
  validationErrors: string[] = [];

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {}

  get404Error() {
    this.http.get(`${this.baseUrl}/${this.controller}/not-found`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get401Error() {
    this.http.get(`${this.baseUrl}/${this.controller}/auth`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get500Error() {
    this.http.get(`${this.baseUrl}/${this.controller}/server-error`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get400Error() {
    this.http.get(`${this.baseUrl}/${this.controller}/bad-request`).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        this.validationErrors = error;
      }
    );
  }
  get400ValidationError() {
    this.accountService.login({}).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }
}
