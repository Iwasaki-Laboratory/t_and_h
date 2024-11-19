
import { getAuthenticatedAppForUser } from '@app/lib/firebase/serverApp';
import { getSbToken } from '@app/lib/dbUtils';
import { InputForm } from './inputForm';
import { notFound } from 'next/navigation';

export default async function Home() {

  let token = '';
  let secretKey = '';

  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) notFound();

  const u = await getSbToken(currentUser.uid);
  if (u) {
    // データベースに存在したら初期値として取得
    token = u.sbToken;
    secretKey = u.sbSecretKey;
  }

  return <InputForm token={token} secretKey={secretKey} />;
}
