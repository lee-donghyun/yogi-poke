import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AuthenticatorTransportFuture,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  verifyRegistrationResponse,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/server';
import { passKeyConstants } from './auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: PrismaService,
  ) {}
  validateRequest(request: any): boolean {
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
  verifyUserToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  createUserToken(user: JwtPayload) {
    return this.jwtService.sign(user) as string;
  }
  async generatePasskeyRegistrationOptions(user: JwtPayload) {
    const userPasskeys = await this.db.passkey.findMany({
      where: { userId: user.id },
    });

    const options = await generateRegistrationOptions({
      rpName: passKeyConstants.rpName,
      rpID: passKeyConstants.rpID,
      userName: user.name,
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports.split(
          ',',
        ) as AuthenticatorTransportFuture[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    await this.db.user.update({
      data: { passkeyOptions: JSON.stringify(options) },
      where: { id: user.id },
    });

    return options;
  }

  async verifyPasskeyRegistrationResponse(
    user: JwtPayload,
    response: RegistrationResponseJSON,
  ) {
    const currentOptions = JSON.parse(
      (await this.db.user.findUnique({ where: { id: user.id } }))
        .passkeyOptions as string,
    ) as PublicKeyCredentialCreationOptionsJSON;

    const verification = await verifyRegistrationResponse({
      response: response,
      expectedChallenge: currentOptions.challenge,
      expectedOrigin: passKeyConstants.origin,
      expectedRPID: passKeyConstants.rpID,
    });

    const { registrationInfo } = verification;
    const { credential, credentialDeviceType, credentialBackedUp } =
      registrationInfo;

    await this.db.passkey.create({
      data: {
        webauthnUserID: currentOptions.user.id,
        id: credential.id,
        publicKey: credential.publicKey,
        counter: credential.counter as unknown as bigint,
        transports: credential.transports.join(','),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        userId: user.id,
      },
    });
  }
}
