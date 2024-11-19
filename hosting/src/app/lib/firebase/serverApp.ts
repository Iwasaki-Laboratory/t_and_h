import "server-only";

import { headers } from "next/headers";
import { initializeServerApp } from "firebase/app";

import { firebaseConfig } from "./config";
import { getAuth, connectAuthEmulator } from "firebase/auth";

export async function getAuthenticatedAppForUser() {
  const idToken = headers().get("Authorization")?.split("Bearer ")[1];

  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  );
  const auth = getAuth(firebaseServerApp);

  if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT == 'true') {
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }
  }

  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}