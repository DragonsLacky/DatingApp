import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
    public accountService: AccountService
  ) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  login(): void {
    this.accountService.login(this.model).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    this.closeDialog();
  }

  logout(): void {
    this.accountService.logout();
  }

  closeDialog(): void {
    this.modalRef?.hide();
  }

  ngOnInit(): void {}
}
