import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { MessageParams } from '../models/messageParams';
import { Pagination } from '../models/pagination';
import { ConfirmService } from '../services/confirm.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  private membersPath = 'members';
  messages: Message[];
  pagination: Pagination;
  messagesParams: MessageParams = new MessageParams();
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmService: ConfirmService
  ) {
    this.messagesParams = this.messageService.messageParams;
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.setMessageParams(this.messagesParams);
    this.messageService.getMessages().subscribe((response) => {
      this.messages = response.items;
      this.pagination = response.pagination;
      this.loading = false;
    });
  }

  deleteMessage(id: number, $event: PointerEvent) {
    this.confirmService
      .confirm(
        'Confirm Delete',
        'This action can not be undone, the other person will swill be able to see the message'
      )
      .subscribe(
        (confirmation) =>
          confirmation &&
          this.messageService.deleteMessage(id).subscribe(() => {
            this.messages = this.messages.filter((msg) => msg.id !== id);
            this.loadMessages();
          })
      );
    $event.stopPropagation();
  }

  pageChanged($event: { page: number; itemsPerPage: number }) {
    if (this.messagesParams.pageNumber !== $event.page) {
      this.messagesParams.pageNumber = $event.page;
      this.messageService.setMessageParams(this.messagesParams);
      this.loadMessages();
    }
  }

  getPathFromUsername(username: string) {
    return `/${this.membersPath}/${username}`;
  }
}
