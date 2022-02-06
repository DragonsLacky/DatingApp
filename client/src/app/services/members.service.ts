import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
  members: Member[] = [];
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
    let cachedMembers = this.membersCache.get(userParams.key());
    if (cachedMembers) {
      return of(cachedMembers);
    }

    let params = this.getPaginationHeaders(userParams);

    return this.getPaginatedResult<Member[]>(
      `${this.baseUrl}/${this.controller}`,
      params
    ).pipe(
      map(
        (response) => this.cacheMembers(userParams.key(), response) && response
      )
    );
  }

  cacheMembers(key: string, value: PaginatedResult<Member[]>) {
    if (this.membersCache.size >= this.cacheSize) {
      this.membersCache.delete(this.membersCache.keys().next()?.value);
    }
    return this.membersCache.set(key, value);
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

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http
      .get<T>(url, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.items = response.body;
          let paginationHeader = response.headers.get('Pagination');
          if (paginationHeader) {
            paginatedResult.pagination = JSON.parse(paginationHeader);
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders({
    pageNumber,
    pageSize,
    minAge,
    maxAge,
    gender,
    orderBy,
  }: UserParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('minAge', minAge.toString());
    params = params.append('maxAge', maxAge.toString());
    params = params.append('gender', gender);
    params = params.append('orderBy', orderBy);

    return params;
  }
}
