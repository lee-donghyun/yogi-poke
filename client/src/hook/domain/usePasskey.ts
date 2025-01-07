import {
  type PublicKeyCredentialCreationOptionsJSON,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

import { useUser } from "../../ui/provider/Auth";

const PASSKEY_USER_ID_PERSIST_KEY = "PASSKEY_USER_ID";

export const usePasskey = () => {
  const { client, registerToken } = useUser();

  const register = async (
    options?: { useAutoRegister: boolean },
    token?: string,
  ) => {
    const optionsJSON = await client
      .get("auth/passkey/registration", {
        ...(token && { headers: { Authorization: token } }),
      })
      .json<PublicKeyCredentialCreationOptionsJSON>();
    const registration = await startRegistration({
      optionsJSON,
      useAutoRegister: options?.useAutoRegister,
    });
    await client.post("auth/passkey/registration", {
      json: registration,
      ...(token && { headers: { Authorization: token } }),
    });
    localStorage.setItem(PASSKEY_USER_ID_PERSIST_KEY, registration.id);
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
      .json<string>();
    await registerToken(token);
  };

  return { authenticate, register };
};
