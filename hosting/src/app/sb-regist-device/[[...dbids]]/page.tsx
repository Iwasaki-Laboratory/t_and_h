import { InputForm } from './inputForm';
import { getAuthenticatedAppForUser } from '../../lib/firebase/serverApp';
import { getDevice } from '../../lib/dbUtils';
import { notFound } from 'next/navigation';

export default async function Home({ params } : { params: {dbids: string[] | null}}) {

  const { currentUser } = await getAuthenticatedAppForUser();

  let dbid = params.dbids ? params.dbids[0] : null;
  let macAddress = '';
  let deviceName = '';

  if (dbid && currentUser) {
    const meterStatus = await getDevice(currentUser.uid, dbid);

    if (meterStatus) {
      macAddress = meterStatus.macAddress;
      deviceName = meterStatus.deviceName;
    }
    else {
      // データベースからの取得に失敗
      notFound();
    }

  }

  return <InputForm dbid={dbid} macAddress={macAddress} deviceName={deviceName} />;
}
