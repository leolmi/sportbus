import { Injectable } from '@nestjs/common';
import { version } from '../../../../package.json'
import {
  checkNumber,
  SPORTBUS_AUTHOR,
  SPORTBUS_SESSION_POLLING_TIMEOUT,
  SPORTBUS_SESSION_STANDARD,
  SPORTBUS_TITLE,
  SportbusInfo
} from '@olmi/model';

@Injectable()
export class AppService {

  getData(): SportbusInfo {
    return new SportbusInfo({
      version,
      pollingTimeout: checkNumber(parseInt(`${process.env.SPORTBUS_POLLING_TIMEOUT||SPORTBUS_SESSION_POLLING_TIMEOUT}`, 10), 1000, 60000),
      author: process.env.SPORTBUS_AUTHOR || SPORTBUS_AUTHOR,
      title: process.env.SPORTBUS_TITLE || SPORTBUS_TITLE,
      sessionType: process.env.SPORTBUS_SESSION || SPORTBUS_SESSION_STANDARD
    });
  }
}
