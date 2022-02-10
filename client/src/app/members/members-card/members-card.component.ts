import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { LikesService } from 'src/app/services/likes.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css'],
})
export class MembersCardComponent implements OnInit {
  @Input() member: Member;

  constructor(
    private likeService: LikesService,
    private toaster: ToastrService,
    public presenceService: PresenceService
  ) {}

  ngOnInit(): void {
    this.getOnlineStatus('hart');
  }

  likeUser() {
    this.likeService.addLike(this.member.username).subscribe(() => {
      this.toaster.success(`You have liked ${this.member.knownAs}`);
    });
  }

  getOnlineStatus(username: string) {
    return this.presenceService.onlineUsers$.pipe(
      map((usernames) => usernames.includes(username))
    );
  }
}
