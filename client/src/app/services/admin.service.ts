import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RolesEnum } from '../models/roles';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.apiUrl;
  private controller = 'Admin';

  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(
      `${this.baseUrl}/${this.controller}/users-with-roles`
    );
  }

  editRoles(username: string, roles: RolesEnum[]) {
    let params = this.getParams(roles);

    return this.http.post(
      `${this.baseUrl}/${this.controller}/edit-roles/${username}`,
      {},
      { params }
    );
  }

  getParams(roles: RolesEnum[]) {
    let params = new HttpParams();

    params = params.append('roles', roles.join(','));

    return params;
  }
}
