import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

import { passKeyConstants } from './auth.constant';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: PrismaService,
  ) {}
  createUserToken(user: JwtPayload) {
    return this.jwtService.sign(user);
  }
  async generatePasskeyAuthenticationOptions(userId: number) {
    const userPasskeys = await this.db.passkey.findMany({
      where: { userId },
    });

    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        allowCredentials: userPasskeys.map((passkey) => ({
          id: passkey.id,
          transports: passkey.transports?.split(
            ',',
          ) as AuthenticatorTransportFuture[],
        })),
        rpID: passKeyConstants.rpID,
      });

    await this.db.user.update({
      data: { passkeyOptions: JSON.stringify(options) },
      where: { id: userId },
    });

    return options;
  }
  async generatePasskeyRegistrationOptions(user: JwtPayload) {
    const userPasskeys = await this.db.passkey.findMany({
      where: { userId: user.id },
    });

    const options = await generateRegistrationOptions({
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports?.split(
          ',',
        ) as AuthenticatorTransportFuture[],
      })),
      rpID: passKeyConstants.rpID,
      rpName: passKeyConstants.rpName,
      userName: user.name,
    });

    await this.db.user.update({
      data: { passkeyOptions: JSON.stringify(options) },
      where: { id: user.id },
    });

    return options;
  }
  validateRequest(request: { user?: JwtPayload | null } & Request): boolean {
    request.user = null;
    const token = request.headers.authorization;

    if (!token) return false;
    try {
      const user = this.verifyUserToken(token);
      request.user = user;
      return true;
    } catch {
      request.user = null;
      return false;
    }
  }

  async verifyPasskeyAuthenticationResponse(
    userId: number,
    response: AuthenticationResponseJSON,
  ) {
    const user = await this.db.activeUser.findUniqueOrThrow({
      select: {
        authProvider: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        profileImageUrl: true,
        pushSubscription: true,
      },
      where: { id: userId },
    });
    const currentOptions = JSON.parse(
      (await this.db.user.findUniqueOrThrow({ where: { id: userId } }))
        .passkeyOptions as string,
    ) as PublicKeyCredentialCreationOptionsJSON;

    const passkey = await this.db.passkey.findUniqueOrThrow({
      where: { id: response.id, userId },
    });

    const verification = await verifyAuthenticationResponse({
      credential: {
        counter: passkey.counter as unknown as number,
        id: passkey.id,
        publicKey: passkey.publicKey,
        transports: passkey.transports?.split(
          ',',
        ) as AuthenticatorTransportFuture[],
      },
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: passKeyConstants.origin,
      expectedRPID: passKeyConstants.rpID,
      response,
    });

    if (!verification.verified) {
      throw new UnauthorizedException('Invalid passkey');
    }

    void this.db.passkey.update({
      data: { counter: BigInt(verification.authenticationInfo.newCounter) },
      where: { id: passkey.id },
    });

    return this.createUserToken(user);
  }
  async verifyPasskeyRegistrationResponse(
    user: JwtPayload,
    response: RegistrationResponseJSON,
  ) {
    const currentOptions = JSON.parse(
      (await this.db.user.findUniqueOrThrow({ where: { id: user.id } }))
        .passkeyOptions as string,
    ) as PublicKeyCredentialCreationOptionsJSON;

    const verification = await verifyRegistrationResponse({
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: passKeyConstants.origin,
      expectedRPID: passKeyConstants.rpID,
      response: response,
    });

    const { registrationInfo } = verification;
    if (!registrationInfo) {
      throw new UnauthorizedException('Invalid passkey');
    }
    const { credential, credentialBackedUp, credentialDeviceType } =
      registrationInfo;

    await this.db.passkey.create({
      data: {
        backedUp: credentialBackedUp,
        counter: credential.counter as unknown as bigint,
        deviceType: credentialDeviceType,
        id: credential.id,
        publicKey: credential.publicKey,
        transports: credential.transports?.join(','),
        userId: user.id,
        webauthnUserID: currentOptions.user.id,
      },
    });
  }

  verifyUserToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
