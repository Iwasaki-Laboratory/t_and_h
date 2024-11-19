/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Firestore, Timestamp } from "firebase-admin/firestore";

const {onMessagePublished} = require("firebase-functions/v2/pubsub");
const logger = require("firebase-functions/logger");

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
import { getDeviceStatus, Meter, WoIOSensor, MeterPlus, MeterPro, Hub2 } from "./switchBotUtils";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Firebaseアプリの初期化
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = getFirestore() as Firestore;

exports.updateDeviceStatus = onMessagePublished("updateDeviceStatus", async () => {
  logger.log('updateDeviceStatus');

  (await getUsers()).forEach(async doc => {
    const token = doc.get('sbToken');
    const secretKey = doc.get('sbSecretKey');

    (await getMeters(doc)).forEach(async doc2 => {
      const macAddress = doc2.get('macAddress');
      const meter = await getDeviceStatus(macAddress, token, secretKey);

      updateMeterStatus(doc2, meter);
    });
  });
});

async function getUsers() : Promise<Array<FirebaseFirestore.DocumentSnapshot>> {
  const collectionRef = db.collection('users');
  return db.getAll(...await collectionRef.listDocuments());
}

async function getMeters(doc: FirebaseFirestore.DocumentSnapshot) : Promise<Array<FirebaseFirestore.DocumentSnapshot>> {
  const cr2 = doc.ref.collection('meters');
  return db.getAll(...await cr2.listDocuments());
}

async function updateMeterStatus(doc: FirebaseFirestore.DocumentSnapshot, meter: Meter | WoIOSensor | MeterPlus | MeterPro | Hub2 | null) {
  if (meter === null) return;
  
  await doc.ref.update({
    "celsius": meter.temperature,
    "humidity": meter.humidity,
    "battery": "battery" in meter ? meter.battery : 0,
    "lastUpdateTime": new Timestamp(Math.floor(new Date().getTime() / 1000), 0)
  });
}