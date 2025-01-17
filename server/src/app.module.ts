import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import { AuthModule } from './auth/auth.module';
import { MateModule } from './mate/mate.module';
import { RelationModule } from './relation/relation.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

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
