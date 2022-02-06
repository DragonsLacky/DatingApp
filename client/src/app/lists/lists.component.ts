import { Component, OnInit } from '@angular/core';
import { LikesParams } from '../models/likesParams';
import { Member } from '../models/member';
import { Pagination } from '../models/pagination';
import { LikesService } from '../services/likes.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  pagination: Pagination;
  likesParams = new LikesParams();

  constructor(private likeService: LikesService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likeService.setLikesParams(this.likesParams);
    this.likeService.getLikes().subscribe((response) => {
      this.members = response.items;
      this.pagination = response.pagination;
    });
  }

  pageChanged($event: { page: number; itemsPerPage: number }) {
    this.likesParams.pageNumber = $event.page;
    this.likeService.setLikesParams(this.likesParams);
    this.loadLikes();
  }
}
