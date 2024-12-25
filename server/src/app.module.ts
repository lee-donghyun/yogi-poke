import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';
import { RelationModule } from './relation/relation.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    UserModule,
    MateModule,
    UtilModule,
    RelationModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
