import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { LikesService } from 'src/app/services/likes.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css'],
})
export class MembersCardComponent implements OnInit {
  @Input() member: Member;

  constructor(
    private likeService: LikesService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  likeUser() {
    this.likeService.addLike(this.member.userName).subscribe(() => {
      this.toaster.success(`You have liked ${this.member.knownAs}`);
    });
  }
}
