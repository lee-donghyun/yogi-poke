import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './auth.interface';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
