import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/pagination.helper';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  private controller = 'Users';
  private cacheSize = 10;
  membersCache = new Map<string, PaginatedResult<Member[]>>();
  user: User;
  userParams: UserParams;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
      this.membersCache = new Map<string, PaginatedResult<Member[]>>();
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    return (this.userParams = new UserParams(this.user));
  }

  getMembers(userParams: UserParams) {
    console.log(this.membersCache);
    let cachedMembers = this.membersCache.get(userParams.key());
    if (cachedMembers) {
      return of(cachedMembers);
    }

    let params = this.getUserPaginationHeaders(userParams);

    return getPaginatedResult<Member[]>(
      `${this.baseUrl}/${this.controller}`,
      params,
      this.http
    ).pipe(
      map(
        (response) => this.cacheMembers(userParams.key(), response) && response
      )
    );
  }

  getMember(username: string) {
    const member = [...this.membersCache.values()]
      .reduce((res, { items }) => [...res, ...items], [])
      .find((member: Member) => member.userName === username);

    if (member) return of(member);

    return this.http.get<Member>(
      `${this.baseUrl}/${this.controller}/${username}`
    );
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/${this.controller}`, member).pipe(
      map(() => {
        [...this.membersCache.entries()].map(([key, { items }]) => {
          const index = items.findIndex((m) => m.userName === member.userName);
          this.membersCache.get(key).items[index] = member;
        });
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

  private cacheMembers(key: string, value: PaginatedResult<Member[]>) {
    if (this.membersCache.size >= this.cacheSize) {
      this.membersCache.delete(this.membersCache.keys().next()?.value);
    }
    return this.membersCache.set(key, value);
  }

  private getUserPaginationHeaders({
    pageNumber,
    pageSize,
    minAge,
    maxAge,
    gender,
    orderBy,
  }: UserParams) {
    let params = new HttpParams();

    params = getPaginationHeaders(
      {
        pageNumber,
        pageSize,
      },
      params
    );

    params = params.append('minAge', minAge.toString());
    params = params.append('maxAge', maxAge.toString());
    params = params.append('gender', gender);
    params = params.append('orderBy', orderBy);

    return params;
  }
}
