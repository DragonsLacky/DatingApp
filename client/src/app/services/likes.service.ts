import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/pagination.helper';
import { LikesParams } from '../models/likesParams';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private controller = 'Likes';
  likesParams: LikesParams;

  constructor(private http: HttpClient) {
    this.likesParams = new LikesParams();
  }

  getLikesParams() {
    return this.likesParams;
  }

  setLikesParams(params: LikesParams) {
    this.likesParams = params;
  }

  resetUserParams() {
    return (this.likesParams = new LikesParams());
  }

  addLike(username: string) {
    return this.http.post(`${this.baseUrl}/${this.controller}/${username}`, {});
  }

  getLikes() {
    const params = this.getLikesPaginationHeaders(this.likesParams);

    return getPaginatedResult<Member[]>(
      `${this.baseUrl}/${this.controller}`,
      params,
      this.http
    );
  }

  private getLikesPaginationHeaders({
    pageNumber,
    pageSize,
    predicate,
  }: LikesParams) {
    let params = new HttpParams();

    params = getPaginationHeaders({ pageNumber, pageSize }, params);

    params = params.append('predicate', predicate);

    return params;
  }
}
