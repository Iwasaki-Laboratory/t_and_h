"use server"

import { getDeviceStatus, Hub2 } from '../../lib/switchBotUtils';
import { getAuthenticatedAppForUser } from '../../lib/firebase/serverApp';
import { getSbToken, MeterStatus, registDevice } from '../../lib/dbUtils';
import { Timestamp } from 'firebase/firestore';

export interface ServerResponse {
  dbid: string | null;
  message: string | null;
  error: boolean;
}

export async function registSwitchBotDevice(prevState: ServerResponse, formData: FormData): Promise<ServerResponse> {

  try {
    const macAddress = String(formData.get("mac_address")).toUpperCase().replaceAll(':', '');
    const deviceName = String(formData.get("device_name"));
    const dbid = formData.get("dbid") ? String(formData.get("dbid")) : null;

    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) {
      return { message: 'ユーザー情報の取得に失敗しました。', error: true, dbid: null};
    }

    const uid = currentUser.uid ?? '';

    const user = await getSbToken(uid);

    const token = user?.sbToken;
    const secretKey = user?.sbSecretKey;

    if (!token || !secretKey) {
      return {message: 'トークンおよびシークレットキーが設定されていません。', error: true, dbid: null};
    }

    // 入力チェック
    // MACアドレス
    if (macAddress.length <= 0) {
      return {message: 'MACアドレスが未入力です。', error: true, dbid: null};
    }

    // デバイス名
    if (deviceName.length <= 0) {
      return {message: 'デバイス名が未入力です。', error: true, dbid: null};
    }

    // ステータスの取得を試みてSwitch-Botにデバイスが存在しているかチェック
    const meterStatus = await getDeviceStatus(macAddress, token, secretKey);

    if (meterStatus === null) {
      return {message: 'MACアドレスの指定に誤りがあるか、温度計以外が指定されました。', error: true, dbid: null};
    }

    // データベースへ登録を行う
    const newDbId = await registDevice(
                            uid,
                            dbid,
                            { macAddress: macAddress,
                              deviceName: deviceName,
                              battery: 'battery' in meterStatus ? meterStatus.battery : 0,
                              celsius: meterStatus.temperature ?? 0,
                              humidity: meterStatus.humidity ?? 0,
                              lastUpdateTime: new Timestamp(Math.floor(Date.now() / 1000), 0)});

    if (!newDbId) return {message: '登録に失敗しました。', error: true, dbid: null}

    return {message: '登録が完了しました。', error: false, dbid: newDbId};
  }
  catch (error) {
    console.error(error);
    return {message: '内部エラーが発生しました。:' + error, error: true, dbid: null};
  }
}