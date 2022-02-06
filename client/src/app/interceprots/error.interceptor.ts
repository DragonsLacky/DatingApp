import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toaster: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400: {
              if (error.error.errors) {
                const errors = Object.values(error.error.errors);
                throw errors.flat();
              } else if (typeof error.error === 'object') {
                this.toaster.error(
                  error.error.title,
                  error.error.status.toString()
                );
              } else {
                this.toaster.error(error.error, error.status.toString());
              }
              break;
            }
            case 401: {
              this.toaster.error('Unauthorized', error.status.toString());
              break;
            }
            case 404: {
              this.router.navigateByUrl('/not-found');
              break;
            }
            case 500: {
              const navExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navExtras);
              break;
            }
            default:
              this.toaster.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
