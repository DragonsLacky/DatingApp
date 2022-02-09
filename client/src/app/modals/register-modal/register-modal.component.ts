import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
})
export class RegisterModalComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  modalRef?: BsModalRef;
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    public accountService: AccountService,
    private formBuilderService: FormBuilder,
    public bsModalRef: BsModalRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeFormGroup() {
    this.registerForm = this.formBuilderService.group({
      username: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls.password.valueChanges.subscribe(() =>
      this.registerForm.controls.confirmPassword.updateValueAndValidity()
    );
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) =>
      control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { matching: true };
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      () => {
        this.router.navigateByUrl('/members');
        this.closeDialog();
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  closeDialog() {
    this.bsModalRef.hide();
  }

  close() {
    this.closeDialog();
    // console.log('cancel');
    // this.cancelRegister.emit(false);
  }

  switchToRegister() {
    this.accountService.switchModalDialog(this.accountService.registerModalId);
  }
}
