import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  pendingRequests = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  loading() {
    this.pendingRequests++;
    this.spinnerService.show(undefined, {
      type: 'ball-atom',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#333333',
    });
  }

  idle() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.pendingRequests = 0;
      this.spinnerService.hide();
    }
  }
}
