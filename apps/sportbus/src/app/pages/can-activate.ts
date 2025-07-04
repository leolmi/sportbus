import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { FALLBACK_PAGE_ROUTE } from './default.routes';
import { SPORTBUS_PAGES } from '@olmi/common';


export function canActivatePage(route: string): CanActivateFn {
  return (aroute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const pages = inject(SPORTBUS_PAGES);
    const router = inject(Router);
    if (state.url.startsWith(`/${route}`)) {
      const page = pages.find(p => p.route === route);
      const cannav = !page?.disabled;
      if (!cannav) router.navigate([FALLBACK_PAGE_ROUTE]);
      return cannav;
    }
    return true;
  };
}
