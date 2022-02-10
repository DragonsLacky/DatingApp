import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubUrl = environment.hubUrl;
  private hubName = 'presence';
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toaster: ToastrService, private router: Router) {}

  startHubConnection(user: User) {
    this.hubConnection = this.createHubConnection(user.token);
    this.hubConnection.start().catch((error) => console.log(error));
    this.attachListeners();
  }

  stopHubConnection() {
    this.hubConnection.stop().catch((error) => console.log(error));
  }

  private createHubConnection(token: string) {
    return new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/${this.hubName}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
  }

  private attachListeners() {
    this.hubConnection.on('UserIsOnline', (username) =>
      this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
        this.onlineUsersSource.next([...usernames, username]);
      })
    );

    this.hubConnection.on('UserIsOffline', (username) =>
      this.onlineUsers$.pipe(take(1)).subscribe((usernames) => {
        this.onlineUsersSource.next(
          usernames.filter((user) => user !== username)
        );
      })
    );

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('NewMessageNotification', ({ username, knownAs }) =>
      this.toaster
        .info(`New message received from ${knownAs}!`)
        .onTap.pipe(take(1))
        .subscribe(() =>
          this.router.navigateByUrl(`/members/${username}?tab=3`)
        )
    );
  }
}
