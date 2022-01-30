import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
  providers: [BsModalService],
})
export class RegisterModalComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  modalRef?: BsModalRef;

  // openModal(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, {
  //     class: 'modal-sm modal-dialog-centered',
  //   });
  // }

  constructor(
    private modalService: BsModalService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe(
      (response) => {
        console.log(response);
        this.cancel();
      },
      (err) => console.log(err)
    );
  }

  cancel() {
    console.log('cancel');
    this.cancelRegister.emit(false);
  }
}
