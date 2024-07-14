import { Module } from '@nestjs/common';
import { MateModule } from './mate/mate.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';
import { RelationModule } from './relation/relation.module';

@Module({
  imports: [UserModule, MateModule, UtilModule, RelationModule],
})
export class AppModule {}
