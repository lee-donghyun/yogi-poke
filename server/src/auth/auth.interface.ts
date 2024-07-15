import { User } from '@prisma/client';

export type JwtPayload = Pick<
  User,
  'id' | 'email' | 'name' | 'profileImageUrl' | 'pushSubscription' | 'createdAt'
>;
