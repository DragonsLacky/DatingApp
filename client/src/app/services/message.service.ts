import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/pagination.helper';
import { Message, MessageBody } from '../models/message';
import { MessageParams } from '../models/messageParams';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private controller = 'messages';
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) {}
  messageParams: MessageParams = new MessageParams();

  getMessages() {
    const params = this.getMessagePaginationHeaders(this.messageParams);

    return getPaginatedResult<Message[]>(
      `${this.baseUrl}/${this.controller}`,
      params,
      this.http
    );
  }

  startConnection(user: User, otherUsername: string) {
    this.hubConnection = this.createHubConnection(otherUsername, user.token);
    this.hubConnection.start().catch((error) => console.log(error));
    this.attachListeners(otherUsername);
  }

  attachListeners(otherUsername: string) {
    this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) =>
      this.messageThreadSource.next(messages)
    );

    this.hubConnection.on('ReceiveMessage', (message: Message) =>
      this.messageThread$
        .pipe(take(1))
        .subscribe((messages) =>
          this.messageThreadSource.next([message, ...messages])
        )
    );

    this.hubConnection.on(
      'UpdatedGroup',
      (group: Group) =>
        group.connections.some(
          (connection) => connection.username === otherUsername
        ) &&
        this.messageThread$.pipe(take(1)).subscribe((messages) =>
          this.messageThreadSource.next(
            messages.map((msg) => ({
              ...msg,
              dateRead: new Date(Date.now()),
            }))
          )
        )
    );
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  createHubConnection(username: string, token: string) {
    return new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/${this.controller}?user=${username}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
  }

  setMessageParams(messageParams: MessageParams) {
    this.messageParams = messageParams;
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      `${this.baseUrl}/${this.controller}/thread/${username}`
    );
  }

  async sendMessage(messageBody: MessageBody) {
    return this.hubConnection
      .invoke('SendMessage', messageBody)
      .catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/${this.controller}/${id}`);
  }

  private getMessagePaginationHeaders({
    container,
    pageNumber,
    pageSize,
  }: MessageParams) {
    let params = new HttpParams();

    params = getPaginationHeaders({ pageNumber, pageSize }, params);

    params = params.append('Container', container.toString());

    return params;
  }
}
