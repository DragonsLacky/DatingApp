import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  loginModalRef: BsModalRef;
  currentUser$: Observable<User>;

  constructor(
    public accountService: AccountService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  showLogin() {
    this.loginModalRef = this.accountService.openLoginModal();
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
