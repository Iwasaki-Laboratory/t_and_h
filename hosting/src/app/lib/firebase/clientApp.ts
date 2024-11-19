'use client';

import { initializeApp, getApps } from "@firebase/app";
import { firebaseConfig } from "./config";
import { getAuth, connectAuthEmulator } from "@firebase/auth";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);

// debug mode
if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT == 'true') {
  if (!auth.emulatorConfig) connectAuthEmulator(auth, "http://localhost:9099");
}

export function getDb() {
  const db = getFirestore(firebaseApp);

  if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT == 'true') {
    try {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }catch (e){
      console.log(e);
    }
  }

  return db;
}

