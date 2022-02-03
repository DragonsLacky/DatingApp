import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  private controller = 'users';

  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}/${this.controller}`);
  }

  getMember(username: string) {
    return this.http.get<Member>(
      `${this.baseUrl}/${this.controller}/${username}`
    );
  }
}
