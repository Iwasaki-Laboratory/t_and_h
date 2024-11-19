import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged as _onAuthStateChanged,
  NextOrObserver,
  User
} from "@firebase/auth";
import { auth } from "./clientApp";

export function onAuthStateChanged(nextOrObserver: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, nextOrObserver);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return null;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {errorCode, errorMessage};
    });
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch(error) {
    console.error("Error signing out with Google", error);
  }
}

export async function createUserWithEmailAndNickname(email: string, password: string, nickname: string): Promise<User | null> {

  if (!nickname) return null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ニックネームの設定
    await updateProfile(user, {displayName: nickname});

    return user;
  } catch (error) {
    return null;
  }
}