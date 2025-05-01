import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { badRequest, SessionDoc, SessionOnDayDoc } from '../../model';


/**
 * GESTIONE DELLE SESSIONI
 *
 *  - get    /session
 *  - post   /session { ...session }
 *  - get    /create
 */
@Controller('')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * restituisce una sessione esistente
   */
  @Get('session/:code')
  async getSession(@Param() prms: any): Promise<SessionDoc|undefined> {
    return this.sessionService.getSession(prms.code);
  }

  /**
   * aggiorna una sessione esistente
   * @param session
   */
  @Post('session')
  async update(@Body() session: Partial<SessionDoc>): Promise<Partial<SessionDoc>|undefined> {
    if (!session?.code) badRequest('undefined code');
    return this.sessionService.upsertSession(session);
  }

  /**
   * crea una nuova sessione
   */
  @Get('create')
  async create(): Promise<SessionDoc|undefined> {
    return this.sessionService.createSession();
  }

  /**
   * elimina una sessione e tutti i suoi dati giornalieri
   */
  @Delete('delete/:code')
  async delete(@Param() prms: any): Promise<boolean> {
    return this.sessionService.deleteSession(prms.code);
  }

  /**
   * dati giornalieri della sessione
   * @param prms
   */
  @Get('session-on-day/:code/:day')
  async getSessionOnDay(@Param() prms: any): Promise<SessionOnDayDoc|undefined> {
    return this.sessionService.getSessionOnDay(prms.code, prms.day);
  }

  /**
   * aggiorna i dati giornalieri della sessione
   * @param sessionOnDay
   */
  @Post('session-on-day')
  async updateSessionOnDay(@Body() sessionOnDay: Partial<SessionOnDayDoc>): Promise<Partial<SessionOnDayDoc>|undefined> {
    if (!sessionOnDay?.session) badRequest('undefined session code');
    return this.sessionService.upsertSessionOnDay(sessionOnDay);
  }

  /**
   * elimina tutto
   */
  @Delete('delete-all')
  async deleteAll(): Promise<boolean> {
    return this.sessionService.deleteAll();
  }

  /**
   * elimina tutte le session-on-day
   */
  @Delete('delete-all-sod')
  async deleteAllSod(): Promise<boolean> {
    return this.sessionService.deleteAllSessionOnDays();
  }
}
