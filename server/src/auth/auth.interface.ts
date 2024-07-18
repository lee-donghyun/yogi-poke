import { AuthProvider, User } from '@prisma/client';

export type JwtPayload = Pick<
  User,
  'id' | 'email' | 'name' | 'profileImageUrl' | 'pushSubscription' | 'createdAt'
>;

export type AuthorizedTokenPayload = {
  authProvider: typeof AuthProvider.INSTAGRAM;
  authProviderId: string;
};
