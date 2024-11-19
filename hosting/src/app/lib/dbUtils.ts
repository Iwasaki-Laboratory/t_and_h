import "server-only";

import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc, collection, Timestamp } from "firebase/firestore"; 
import { connectFirestoreEmulator } from "firebase/firestore";
import { getAuthenticatedAppForUser } from './firebase/serverApp';
import { FirebaseServerApp } from "firebase/app";

async function getDb(firebaseServerApp: FirebaseServerApp) {
  const db = getFirestore(firebaseServerApp);

  if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT == 'true') {
    try {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }
    catch (error) {
      //console.log(error);
    }
  }

  return db;
}

export async function setSbToken(token: string, secretKey: string):Promise<string | undefined> {

  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = await getDb(firebaseServerApp);
  const uid = currentUser?.uid;

  if (uid === undefined) {
    return 'ユーザー情報が取得できません。';
  }

  // スイッチボットのトークンとシークレットキーをDBへセット
  await setDoc(doc(db, "users", uid), {
    sbToken: token,
    sbSecretKey: secretKey
  });

  return undefined;
}

export type User = {
  sbToken: string,
  sbSecretKey: string
}

export async function getSbToken(uid: string): Promise<User | null> {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = await getDb(firebaseServerApp);

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as User;
}

export type MeterStatus = {
  macAddress: string,
  deviceName: string,
  battery: number | undefined,
  celsius: number,
  humidity: number,
  lastUpdateTime: Timestamp
};

export async function registDevice(uid: string, dbid: string | null, status: MeterStatus) : Promise<string | null> {

  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = await getDb(firebaseServerApp);
  let newDbId = dbid;

  if (dbid) {
    const docRef = doc(db, "users", uid, "meters", dbid);
    const deviceInfo = await getDoc(docRef);
    // 該当のDBが存在しなければエラー
    if (!deviceInfo.exists()) return null;

    // データの更新
    await setDoc(docRef, status);
  }
  else {
    // データの更新
    newDbId = (await addDoc(collection(db, "users", uid, "meters"), status)).id;
  }

  return newDbId;
}

export async function getDevice(uid: string, dbid: string) : Promise<MeterStatus | null> {

  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = await getDb(firebaseServerApp);

  const docRef = doc(db, "users", uid, "meters", dbid);
  const deviceInfo = await getDoc(docRef);

  if (deviceInfo.exists()) {
    return deviceInfo.data() as MeterStatus;
  }

  return null;
}

export async function getDevices(uid: string): Promise<{ id:string, meter: MeterStatus}[]> {

  let meters : { id:string, meter: MeterStatus}[] = [];

  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = await getDb(firebaseServerApp);

  const q = await getDocs(collection(db, "users", uid, "meters"));
  q.forEach((doc) => {
    meters.push({id: doc.id, meter: doc.data() as MeterStatus});
  });
  
  return meters;
}