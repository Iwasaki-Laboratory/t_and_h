import "server-only"

const SwitchBotApiUrl = 'https://api.switch-bot.com:443/v1.1/';

function createHeader(token: string, secretKey: string): HeadersInit {

  const CryptoJS = require('crypto-js');

  const t = String(Date.now());
  const nonce = "";
  const data = token + t + nonce;
  const signTerm = CryptoJS.HmacSHA256(CryptoJS.enc.Utf8.parse(data), secretKey);
  const sign = CryptoJS.enc.Base64.stringify(signTerm);

  return { "Authorization": token,
          "sign": sign,
          "nonce": nonce,
          "t": t,
          'Content-Type': 'application/json'}
}

export async function getDeviceList(token: string, secretKey: string) {

  const response = await fetch(SwitchBotApiUrl + 'devices/',
    { method: 'GET',
      cache: 'no-store',
      headers: await createHeader(token, secretKey)
    }
  );

  return {response};
}

interface BaseParam {
  deviceId: string,
  deviceType: string,
  hudDeviceId: string,
  version: string,
};

export interface Meter extends BaseParam {
  temperature: number,
  battery: number,
  humidity: number
};

export interface MeterPlus extends BaseParam {
  temperature: number,
  battery: number,
  humidity: number
};

export interface WoIOSensor extends BaseParam {
  temperature: number,
  battery: number,
  humidity: number
};

export interface Hub2 extends BaseParam {
  temperature: number,
  humidity: number,
  lightLevel: number
};

export interface MeterPro extends BaseParam {
  temperature: number,
  humidity: number,
  battery: number
};

export async function getDeviceStatus(macAddress: string, token: string, secretKey: string) : Promise<Meter | WoIOSensor | MeterPlus | Hub2 | MeterPro | null> {

  // デバイスのステータスを取得
  const response = await fetch(SwitchBotApiUrl + `devices/${macAddress}/status`,
    { method: 'GET',
      cache: 'no-store',
      headers: await createHeader(token, secretKey)
    }
  );

  const bo = await response.json();

  if (bo.body.deviceType === 'Meter') {
    return bo.body as Meter;
  }
  else if (bo.body.deviceType === 'WoIOSensor') {
    return bo.body as WoIOSensor;
  }
  else if (bo.body.deviceType === 'MeterPlus') {
    return bo.body as MeterPlus;
  }
  else if (bo.body.deviceType === 'Hub 2') {
    return bo.body as Hub2;
  }
  else if (bo.body.deviceType === 'MeterPro') {
    return bo.body as MeterPro;
  }
  else {
    return null;
  }
}