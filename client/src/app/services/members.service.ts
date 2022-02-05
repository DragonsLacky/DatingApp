import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  private controller = 'Users';
  members: Member[] = [];
  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) {
      return of(this.members);
    }
    return this.http
      .get<Member[]>(`${this.baseUrl}/${this.controller}`)
      .pipe(map((members) => (this.members = members)));
  }

  getMember(username: string) {
    const member = this.members.find((m) => m.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(
      `${this.baseUrl}/${this.controller}/${username}`
    );
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/${this.controller}`, member).pipe(
      map(() => {
        const index = this.members.findIndex(
          (m) => m.userName === member.userName
        );
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.patch(
      `${this.baseUrl}/${this.controller}/photo/${photoId}`,
      {}
    );
  }
  deletePhoto(photoId: number) {
    return this.http.delete(
      `${this.baseUrl}/${this.controller}/photo/${photoId}`
    );
  }
}
