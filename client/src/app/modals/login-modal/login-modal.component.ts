import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
  providers: [BsModalService],
})
export class LoginModalComponent implements OnInit {
  modalRef?: BsModalRef;
  model?: any = {};

  constructor(
    private modalService: BsModalService,
    public accountService: AccountService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  login(): void {
    this.accountService.login(this.model).subscribe(
      () => this.router.navigateByUrl('/members'),
      (error: HttpErrorResponse) => {
        console.log(error);
        this.toaster.error(error.error);
      }
    );
    this.closeDialog();
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  closeDialog(): void {
    this.modalRef?.hide();
  }

  ngOnInit(): void {}
}
