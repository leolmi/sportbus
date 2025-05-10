import { Inject, Injectable, OnModuleInit, UseGuards } from '@nestjs/common';
import { Model } from 'mongoose';
import { SessionDoc, SessionOnDayDoc } from '../../model';
import { environment } from '../../environments/environment';
import { BUS_PREFIX, checkNumber, Group, guid, sanitizeCode, Session, SessionOnDay } from '@olmi/model';
import { cloneDeep } from 'lodash';
import { AuthGuard } from '../app.guards';


@Injectable()
export class SessionService implements OnModuleInit {

  constructor(@Inject('SESSION_MODEL') private readonly sessionModel: Model<SessionDoc>,
              @Inject('SESSION_ON_DAY_MODEL') private readonly sessionOnDayModel: Model<SessionOnDayDoc>) {}

  async getSession(code: string): Promise<SessionDoc|undefined> {
    return await this.sessionModel.findOne({ _id: sanitizeCode(code) }).exec();
  }

  async upsertSession(session: Partial<SessionDoc>): Promise<Partial<SessionDoc>|undefined> {
    if (environment.debug) console.log(...BUS_PREFIX, 'update session request', session);
    try {
      const code = sanitizeCode(session._id);
      const ssc = new Session(session);
      // lastUpdate è gestito internamente
      ssc.lastUpdate = Date.now();
      const result = await this.sessionModel.updateOne({ _id: code }, { $set: ssc }, { upsert: true }).exec();
      if (environment.debug) console.log(...BUS_PREFIX, `update session results for "${session.code}"`, result);
      if (result.acknowledged) return session;
    } catch (err) {
      console.error(`error while updating session "${session.code}"`, err);
    }
    return undefined;
  }

  async createSession(): Promise<SessionDoc|undefined> {
    let result: SessionDoc|undefined;
    const code = sanitizeCode(guid('xxx-xxx-xxx'));
    const session = new Session({
      _id: code,
      code,
      name: 'New Session',
      groups: [new Group({ name: 'Default' })]
    });
    try {
      result = await this.sessionModel.create(session);
      if (environment.debug) console.log(...BUS_PREFIX, `create session results`, result);
    } catch (err) {
      console.error(`error while creating new session "${session.code}"`, err);
    }
    return result;
  }

  async deleteSession(code: string): Promise<boolean> {
    if (environment.debug) console.log(...BUS_PREFIX, 'delete session request', code);
    try {
      const mainres = await this.sessionModel.deleteOne({ _id: code }).exec();
      if (environment.debug) console.log(...BUS_PREFIX, `delete session results for "${code}"`, mainres);
      if (mainres.acknowledged) {
        const datares = await this.sessionOnDayModel.deleteMany({ session: code }).exec();
        if (environment.debug) console.log(...BUS_PREFIX, `delete session-on-day results for "${code}"`, datares);
        return datares.acknowledged;
      }
    } catch (err) {
      console.error(`error while deleting session "${code}"`, err);
    }
    return false;
  }

  async getSessionOnDay(code: string, day: string): Promise<SessionOnDayDoc|undefined> {
    const filter = <Partial<SessionOnDay>>{ session: sanitizeCode(code), date: parseInt(day) };
    const result = await this.sessionOnDayModel.find(filter).exec();
    return result[0];
  }

  async upsertSessionOnDay(sod: Partial<SessionOnDayDoc>): Promise<Partial<SessionOnDayDoc>|undefined> {
    if (environment.debug) console.log(...BUS_PREFIX, 'update session-on-day request', sod);
    try {
      const result: any = await this.sessionOnDayModel.updateOne({
        session: sanitizeCode(sod.session),
        date: sod.date
      }, { $set: sod }, { upsert: true });
      if (environment.debug) console.log(...BUS_PREFIX, `update session-on-day results for "${sod.session}" on "${sod.date}"`, result);
      if (result?.acknowledged) return sod;
    } catch (err) {
      console.error(`error while updating session-on-day "${sod.session}" on "${sod.date}"`, err);
    }
    return undefined;
  }

  /**
   * elimina le sessioni scadute
   */
  private async _checkExpired(): Promise<any> {
    const duration = checkNumber(environment.sessionDurationDays, 30, 300);
    const horizon = Date.now() - (duration * (24 * 60 * 60 * 1000));
    const resp: any = { expired: 0, warnings: 0 };
    const expired = await this.sessionModel.find({ lastUpdate: { $lte: horizon } }).exec();
    for (const exp of expired) {
      const exp_del = await this.deleteSession(exp._id);
      if (exp_del) {
        resp.expired++;
        console.log(...BUS_PREFIX, `session "${exp.code}" was expired`, exp);
      } else {
        resp.warnings++;
        console.warn(...BUS_PREFIX, `cannot delete expired session "${exp?.code}"`, exp);
      }
    }
    return resp;
  }

  private async _deleteDeprecatedSessionOnDays(): Promise<boolean> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = await this.sessionOnDayModel.deleteMany({ date: { $lte: yesterday } }).exec();
      console.log(`checking for deprecated session-on-day: ${result.deletedCount} items deleted`);
      return true;
    } catch (err) {
      console.error(`error while deleting all deprecated sessions-on-day`, err);
    }
    return false;
  }


  async deleteAll(): Promise<boolean> {
    try {
      await this.sessionModel.deleteMany().exec();
      await this.sessionOnDayModel.deleteMany().exec();
      return true;
    } catch (err) {
      console.error(`error while deleting all`, err);
    }
    return false;
  }

  async deleteAllSessionOnDays(): Promise<any> {
    try {
      return await this.sessionOnDayModel.deleteMany().exec();
    } catch (err) {
      console.error(`error while deleting all sessions-on-day`, err);
    }
    return false;
  }

  async deleteSessionOnDays(session: string): Promise<any> {
    if (!session) return false;
    try {
      return await this.sessionOnDayModel.deleteMany({ session }).exec();
    } catch (err) {
      console.error(`error while deleting all sessions-on-day`, err);
    }
    return false;
  }

  async getAllSessions(): Promise<SessionDoc[]> {
    return this.sessionModel.find().exec();
  }

  async onModuleInit() {
    const result = await this._checkExpired();
    console.log('check expired result', result);

    await this._deleteDeprecatedSessionOnDays();
  }
}
