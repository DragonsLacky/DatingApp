import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];

  constructor(
    private membersService: MembersService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.membersService.getMembers().subscribe((response) => {
      this.members = response;
    });
  }
}
