// The types of @mrzscanner/nativescript (index.android.ts and index.ios.ts implement them).
import type { MRZScannerApi } from './mrzscanner';

export * from './mrzscanner';

/** The MRZ scanner: registerLicense, scan (the camera), scanImage (a photo), version. */
export declare const MRZScanner: MRZScannerApi;
