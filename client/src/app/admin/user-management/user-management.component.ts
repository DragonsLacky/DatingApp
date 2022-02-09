import { Component, OnInit } from '@angular/core';
import { NgxGalleryThumbnailsComponent } from '@kolkov/ngx-gallery';
import { ToastrService } from 'ngx-toastr';
import { RolesEnum } from 'src/app/models/roles';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]>;
  role: Record<string, RolesEnum> = {};
  roles: RolesEnum[] = Object.values(RolesEnum);

  constructor(
    private adminService: AdminService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsersWithRoles();
  }

  loadUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe((users) => (this.users = users));
  }

  saveRoles(user: User) {
    this.adminService
      .editRoles(user.username, user.roles)
      .subscribe(() =>
        this.toaster.success(`Updated the roles for ${user.username}`)
      );
  }

  addRole(user: User) {
    let role = this.role[user.username];
    if (user && role) {
      user.roles = [...user.roles, role];
      this.role[user.username] = undefined;
    }
  }

  removeRole(user: User, role: string) {
    user.roles = user.roles.filter((r) => r !== role);
  }

  computeRoles(user: User) {
    return this.roles.filter((r) => user.roles.indexOf(r) === -1);
  }
}
