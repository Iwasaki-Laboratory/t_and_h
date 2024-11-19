"use server"

import { getDeviceList } from '../lib/switchBotUtils';
import { setSbToken } from '../lib/dbUtils';

interface ServerResponse {
  message: string | null;
  error: boolean;
}

export async function setSwitchBotAuthInfo(prevState: ServerResponse, formData: FormData) : Promise<ServerResponse> {

  try {
    const token = String(formData.get("token"));
    const secretKey = String(formData.get("secret_key"));
  
      // tokenとsecret keyが正しいか確認するため、試しにコマンドを実行してみる
    const { response } = await getDeviceList(token, secretKey);
    
    if (response.status != 200) {
      return {message: 'TokenまたはSecret Keyに誤りがあります。', error: true};
    }

    // DBへスイッチボットのトークンとシークレットキーを登録
    const errorMessage = await setSbToken(token, secretKey);
    if (errorMessage !== undefined) {
      return {message: errorMessage, error: true};
    }
  }
  catch (error) {
    console.error(error);
    return {message: '内部エラーが発生しました。:' + error, error: true};
  }

  return {message: '正常に設定されました。', error: false};

};
