import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/pagination.helper';
import { Message, MessageBody } from '../models/message';
import { MessageParams } from '../models/messageParams';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private controller = 'Messages';
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

  setMessageParams(messageParams: MessageParams) {
    this.messageParams = messageParams;
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(
      `${this.baseUrl}/${this.controller}/thread/${username}`
    );
  }

  sendMessage(messageBody: MessageBody) {
    return this.http.post<Message>(
      `${this.baseUrl}/${this.controller}`,
      messageBody
    );
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
