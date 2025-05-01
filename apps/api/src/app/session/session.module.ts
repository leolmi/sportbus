import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { sessionProviders } from '../../model';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionController],
  providers: [SessionService, ...sessionProviders],
})
export class SessionModule {}
