import { User } from '@prisma/client';

export type JwtPayload = Pick<
  User,
  | 'authProvider'
  | 'createdAt'
  | 'email'
  | 'id'
  | 'name'
  | 'profileImageUrl'
  | 'pushSubscription'
>;
