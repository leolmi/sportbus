import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Dictionary, MANAGEMENT_HEADER } from '@olmi/model';
import { environment } from '../environments/environment';
import { MAX_ATTEMPTS_ACCESS_COUNT, MAX_ATTEMPTS_ACCESS_TIMEOUT } from '../model';
import { isString as _isString } from 'lodash';

interface CallInfo {
  attempts: number;
  last: number;
}
const CALLCACHE: Dictionary<CallInfo> = {};

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<any>();
    const key = (req?.headers||{})[MANAGEMENT_HEADER.toLowerCase()];
    if (!key) return false;
    const { ip } = req;
    // stessa chiave per tutti gli ip non leggibili
    const ip_key = `${ip||'???'}`;
    // console.log(`check key "${key}" on ip "${ip_key}"...`);
    if (!checkAttempts(ip_key)) return false;
    const valid = _isString(key) && (`${key||''}` === environment.managementKey);
    // console.log(`check key valid =`, valid);
    if (!valid) {
      // se la login fallisce incrementa il contatore dei tentativi d'accesso
      // e imposta il time dell'ultimo tentativo
      CALLCACHE[ip_key] = CALLCACHE[ip_key]||{ attempts:0, last:0 };
      CALLCACHE[ip_key].attempts++;
      CALLCACHE[ip_key].last = Date.now();
    } else {
      delete CALLCACHE[ip_key];
    }
    return valid;
  }
}

/**
 * Se il numero di chiamate dall'origine supera il limite consentito entro il limite di tempo
 * imposto (5min) non ammette l'accesso indipendentemente dalla validità del check della password
 * @param key
 */
const checkAttempts = (key: string): boolean => {
  const info: CallInfo|undefined = CALLCACHE[key];
  const isOutOfRange = (info?.attempts||0) >= MAX_ATTEMPTS_ACCESS_COUNT;
  if (isOutOfRange && info) {
    const elapsed = Date.now() - info.last;
    if (elapsed > MAX_ATTEMPTS_ACCESS_TIMEOUT) {
      delete CALLCACHE[key];
    } else {
      return false;
    }
  }
  return true;
}
