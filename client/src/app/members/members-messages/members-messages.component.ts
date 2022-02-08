import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.css'],
})
export class MembersMessagesComponent implements OnInit {
  @Input() username: string;
  messages: Message[] = [];
  registerForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private formBuilderService: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilderService.group({
      content: [''],
      recipientUsername: [this.username],
    });
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.username)
      .pipe(take(1))
      .subscribe((response) => {
        this.messages = response;
      });
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.registerForm.value)
      .pipe(take(1))
      .subscribe((response) => (this.messages = [response, ...this.messages]));
  }
}
