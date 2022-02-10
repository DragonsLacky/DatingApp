import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { LikesService } from 'src/app/services/likes.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { PresenceService } from 'src/app/services/presence.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messageTabActive: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private likesService: LikesService,
    private presenceService: PresenceService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loadMember();

    this.route.queryParams.subscribe((params) =>
      params.tab
        ? this.selectMessagesTab(params.tab)
        : this.selectMessagesTab(0)
    );

    this.galleryOptions = this.initializeGalleryOptions();

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    return this.member.photos.map((photo) => ({
      small: photo?.url,
      medium: photo?.url,
      big: photo?.url,
    }));
  }

  loadMember() {
    this.route.data.subscribe((data) => {
      this.member = data.member;
    });
  }

  likeUser() {
    this.likesService
      .addLike(this.member.username)
      .subscribe(() =>
        this.toaster.success(`You have liked ${this.member.knownAs}`)
      );
  }

  selectMessagesTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  onMessageTabActivate() {
    !(this.messageTabActive = !this.messageTabActive) &&
      this.messageService.stopHubConnection();
  }

  initializeGalleryOptions() {
    return [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  getOnlineStatus(username: string) {
    return this.presenceService.onlineUsers$.pipe(
      map((usernames) => usernames.includes(username))
    );
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
