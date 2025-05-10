import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MANAGEMENT_HEADER } from '@olmi/model';
import { getManagementKey } from '@olmi/common';

export function managementAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const key = getManagementKey();
  if (key) {
    const newReq = req.clone({ headers: req.headers.set(MANAGEMENT_HEADER, key) });
    return next(newReq);
  }
  return next(req);
}
