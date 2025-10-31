import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, take, throwError } from 'rxjs';
import { SKIP_AUTH } from '../interceptors/auth-context';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private serverUrl = `${environment.serverUrl}/api`

  constructor(private http: HttpClient) { }

  private handle<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      take(1),
      catchError(err => {
        console.log(err);
        return throwError(() => err)
      })
    )
  }

  get<T>(url: string, params?: string[]): Observable<T> {
    const getParams = params?.length ? '?' + params.join('&') : '';

    return this.handle(this.http.get<T>(`${this.serverUrl}${url}${getParams}`))
  }

  getWithoutToken<T>(url: string, params?: string[]) {
    const getParams = params?.length ? '?' + params.join('&') : ''

    return this.handle(this.http.get<T>(`${this.serverUrl}${url}${getParams}`, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }))
  }

  post<T>(url: string,  body: any): Observable<T> {
    return this.handle(this.http.post<T>(`${this.serverUrl}${url}`, body))
  }

  postWithoutToken<T>(url: string, body: any): Observable<T> {
    return this.handle(this.http.post<T>(`${this.serverUrl}${url}`, body, {
      context: new HttpContext().set(SKIP_AUTH, true)
    }))
  }
}
