import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.css'],
})
export class MembersMessagesComponent implements OnInit {
  @Input() member: Member;
  messages: Message[] = [];
  registerForm: FormGroup;
  user: User;
  loading = false;

  constructor(
    public messageService: MessageService,
    private formBuilderService: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.connectToThread();
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilderService.group({
      content: [''],
      recipientUsername: [this.member.username],
    });
  }

  loadUser() {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.member.username)
      .pipe(take(1))
      .subscribe((response) => {
        this.messages = response;
      });
  }

  connectToThread() {
    this.messageService.startConnection(this.user, this.member.username);
  }

  sendMessage() {
    this.loading = true;
    this.messageService
      .sendMessage(this.registerForm.value)
      .then(() => this.registerForm.controls['content'].reset())
      .finally(() => (this.loading = false));
  }
}
