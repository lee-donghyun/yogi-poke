import {
  type PublicKeyCredentialCreationOptionsJSON,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

import { useUser } from "../../ui/provider/Auth";

const PASSKEY_USER_ID_PERSIST_KEY = "PASSKEY_USER_ID";

export const usePasskey = () => {
  const { client, myInfo, registerToken } = useUser();

  const register = async (options?: {
    token?: string;
    useAutoRegister?: boolean;
    userId?: number;
  }) => {
    const userId = options?.userId ?? myInfo?.id;
    if (userId == undefined) {
      throw new Error("User id not found");
    }
    const optionsJSON = await client
      .get("auth/passkey/registration", {
        ...(options?.token && { headers: { Authorization: options?.token } }),
      })
      .json<PublicKeyCredentialCreationOptionsJSON>();
    const registration = await startRegistration({
      optionsJSON,
      useAutoRegister: options?.useAutoRegister,
    });
    await client.post("auth/passkey/registration", {
      json: registration,
      ...(options?.token && { headers: { Authorization: options?.token } }),
    });
    localStorage.setItem(PASSKEY_USER_ID_PERSIST_KEY, userId.toString());
  };

  const authenticate = async () => {
    const id = localStorage.getItem(PASSKEY_USER_ID_PERSIST_KEY);
    if (!id) {
      throw new Error("Passkey user id not found");
    }
    const optionsJSON = await client
      .get("auth/passkey/authentication", { searchParams: { id } })
      .json<PublicKeyCredentialCreationOptionsJSON>();
    const registration = await startAuthentication({ optionsJSON });
    const token = await client
      .post("auth/passkey/authentication", {
        json: registration,
        searchParams: { id },
      })
      .text();
    await registerToken(token);
  };

  return { authenticate, register };
};
