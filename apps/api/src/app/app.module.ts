import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppLoggerMiddleware } from './app.logger';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, 'public/browser') }),
    SessionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AppLoggerMiddleware).forRoutes('/*path');
  }
}
