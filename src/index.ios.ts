// The NativeScript plugin on iOS: the SDK's MRZScanObjC (MRZScannerARFramework.xcframework in
// platforms/ios, with MRZScannerCore.xcframework) called directly through its header - its class
// methods take and return strings; the camera screen reports through a block.
import { Utils } from '@nativescript/core';

import { createApi } from './mrzscanner';

export * from './mrzscanner';

declare const MRZScanObjC: any;

function scan(settings: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const from = Utils.ios.getRootViewController();
    let top = from;
    while (top && top.presentedViewController) top = top.presentedViewController;
    if (!top) {
      reject(new Error('No view to show the camera over'));
      return;
    }
    MRZScanObjC.presentFromSettingsDone(top, settings, (json: string) => resolve(json));
  });
}

/** The MRZ scanner: registerLicense, scan (the camera), scanImage (a photo), version. */
export const MRZScanner = createApi(async (method, args) => {
  switch (method) {
    case 'registerLicense':
      return MRZScanObjC.registerLicense(args[0]);
    case 'version':
      return MRZScanObjC.coreVersion();
    case 'scanImage':
      // About 40 ms for a photo, on the calling (main) thread.
      return MRZScanObjC.scanImageOptions(args[0], args[1]);
    case 'scan':
      return scan(args[0]);
  }
});
