import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { sleep } from '../helpers/general';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';
import { RegisterModalComponent } from '../modals/register-modal/register-modal.component';
import { User } from '../models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = environment.apiUrl;
  private controller = 'account';
  loginModalId = 'login';
  registerModalId = 'register';

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private modalService: BsModalService,
    private presenceService: PresenceService
  ) {}

  login(model: any) {
    return this.http
      .post(`${this.baseUrl}/${this.controller}/login`, model)
      .pipe(
        map((user: User) => {
          if (user) {
            this.setCurrentUser(user);
            this.presenceService.startHubConnection(user);
          }
          return user;
        })
      );
  }

  register(model: any) {
    return this.http
      .post(`${this.baseUrl}/${this.controller}/register`, model)
      .pipe(
        map((user: User) => {
          if (user) {
            this.setCurrentUser(user);
            this.presenceService.startHubConnection(user);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    if (user) {
      const roles = this.getDecodedToken(user.token).role;
      user.roles = Array.isArray(roles) ? roles : [roles];

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
    }
    return user;
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  openLoginModal() {
    return this.modalService.show(LoginModalComponent, {
      id: this.loginModalId,
      class: 'modal-sm modal-dialog-centered',
    });
  }

  openRegisterModal() {
    return this.modalService.show(RegisterModalComponent, {
      id: this.registerModalId,
      class: 'modal-sm modal-dialog-centered',
    });
  }

  closeLoginModal() {
    this.modalService.hide(this.loginModalId);
  }

  switchModalDialog(dialogId: string) {
    if (dialogId === this.loginModalId) {
      this.closeLoginModal();
      sleep(400).then(() => this.openRegisterModal());
    } else {
      this.closeRegisterModal();
      sleep(400).then(() => this.openLoginModal());
    }
  }

  closeRegisterModal() {
    this.modalService.hide(this.registerModalId);
  }
}
