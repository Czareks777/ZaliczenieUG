import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('AuthInterceptor - token:', token); 
    console.log('AuthInterceptor - Original URL:', req.url); // 🚨 Sprawdź URL żądania

    if (token) {
      const clonedReq = req.clone({
        setHeaders: { 
            Authorization: `Bearer ${token}`,
        }
      });
      console.log('AuthInterceptor - Cloned Request Headers:', clonedReq.headers); // 🚨 Sprawdź nagłówki
      return next.handle(clonedReq);
    }
    return next.handle(req);
}
}
