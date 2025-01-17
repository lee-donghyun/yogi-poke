import { AuthProvider, User } from '@prisma/client';

export interface AuthorizedTokenPayload {
  authProvider: typeof AuthProvider.INSTAGRAM;
  authProviderId: string;
}

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
