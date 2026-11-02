// The NativeScript plugin on Android: the SDK's MrzScan (com.barkoder.mrzscanner.ar, the AAR in
// platforms/android) called directly - its static JSON functions take and return strings - and
// its MrzScanActivity for the camera, whose result comes back as an activity result.
import { AndroidActivityResultEventData, AndroidApplication, Application, Utils } from '@nativescript/core';

import { createApi } from './mrzscanner';

export * from './mrzscanner';

declare const com: any;
declare const android: any;

const SETTINGS = 'com.barkoder.mrzscanner.ar.SETTINGS';
const RESULT = 'com.barkoder.mrzscanner.ar.RESULT';
const SCAN_REQUEST = 0x4d525a; // "MRZ"
const STOPPED = '{"status":"stopped","reads":[],"elapsedMs":0}';

const context = () => Utils.android.getApplicationContext();
const MrzScan = () => com.barkoder.mrzscanner.ar.MrzScan;

function scan(settings: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const activity = Application.android.foregroundActivity || Application.android.startActivity;
    if (!activity) {
      reject(new Error('No activity to show the camera over'));
      return;
    }
    const onResult = (e: AndroidActivityResultEventData) => {
      if (e.requestCode !== SCAN_REQUEST) return;
      Application.android.off(AndroidApplication.activityResultEvent, onResult);
      resolve((e.intent && e.intent.getStringExtra(RESULT)) || STOPPED);
    };
    Application.android.on(AndroidApplication.activityResultEvent, onResult);
    const intent = new android.content.Intent(activity, com.barkoder.mrzscanner.ar.MrzScanActivity.class);
    intent.putExtra(SETTINGS, settings);
    activity.startActivityForResult(intent, SCAN_REQUEST);
  });
}

/** The MRZ scanner: registerLicense, scan (the camera), scanImage (a photo), version. */
export const MRZScanner = createApi(async (method, args) => {
  switch (method) {
    case 'registerLicense':
      return MrzScan().registerLicense(context(), args[0]);
    case 'version':
      return MrzScan().version();
    case 'scanImage':
      // About 100 ms for a photo, on the calling (main) thread.
      return MrzScan().scanImage(context(), args[0], args[1]);
    case 'scan':
      return scan(args[0]);
  }
});
