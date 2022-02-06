import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginatedResult, PaginationParams } from '../models/pagination';

export const getPaginationHeaders = (
  { pageNumber, pageSize }: PaginationParams,
  params?: HttpParams
) => {
  if (!params) params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
};

export const getPaginatedResult = <T>(
  url: string,
  params: HttpParams,
  http: HttpClient
) => {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http
    .get<T>(url, {
      observe: 'response',
      params,
    })
    .pipe(
      map((response) => {
        paginatedResult.items = response.body;
        let paginationHeader = response.headers.get('Pagination');
        if (paginationHeader) {
          paginatedResult.pagination = JSON.parse(paginationHeader);
        }
        return paginatedResult;
      })
    );
};
