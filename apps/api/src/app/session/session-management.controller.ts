import { SessionService } from './session.service';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../app.guards';
import { SessionDoc } from '../../model';

/**
 * GESTIONE DELLE SESSIONI
 * metodi accessibili solo con header di autenticazione
 */
@Controller('')
export class SessionManagementController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * ping per il test dalla password
   */
  @Get('ping')
  @UseGuards(AuthGuard)
  ping(): boolean {
    return true;
  }

  /**
   * elimina una sessione e tutti i suoi dati giornalieri
   */
  @Delete('delete/:code')
  @UseGuards(AuthGuard)
  async delete(@Param() prms: any): Promise<boolean> {
    return this.sessionService.deleteSession(prms.code);
  }

  /**
   * elimina tutto
   */
  @Delete('delete-all')
  @UseGuards(AuthGuard)
  async deleteAll(): Promise<boolean> {
    return this.sessionService.deleteAll();
  }

  /**
   * elimina tutte le session-on-day
   */
  @Delete('delete-all-sod')
  @UseGuards(AuthGuard)
  async deleteAllSod(): Promise<any> {
    return this.sessionService.deleteAllSessionOnDays();
  }

  /**
   * elimina le session-on-day della sessione indicata
   */
  @Delete('delete-sod/:code')
  @UseGuards(AuthGuard)
  async deleteSod(@Param() prms: any): Promise<any> {
    return this.sessionService.deleteSessionOnDays(prms.code);
  }

  /**
   * restituisce l'elenco delle sessioni esistenti
   */
  @Get('sessions')
  @UseGuards(AuthGuard)
  async getSessions(): Promise<SessionDoc[]> {
    return this.sessionService.getAllSessions();
  }
}
