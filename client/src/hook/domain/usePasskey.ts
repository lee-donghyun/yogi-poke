import {
  type PublicKeyCredentialCreationOptionsJSON,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

import { useUser } from "../../ui/provider/Auth";

export const usePasskey = () => {
  const { client, registerToken } = useUser();

  const register = async (token?: string) => {
    const optionsJSON = await client
      .get("auth/passkey/registration", {
        ...(token && { headers: { Authorization: token } }),
      })
      .json<PublicKeyCredentialCreationOptionsJSON>();
    const registration = await startRegistration({ optionsJSON });
    await client.post("auth/passkey/registration", {
      json: registration,
      ...(token && { headers: { Authorization: token } }),
    });
  };

  const authenticate = async (id: number | string) => {
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
