# @mrzscanner/nativescript

Reads the machine-readable zone (MRZ) of passports, ID cards and visas, offline: a full-screen
camera with AR mode (a box follows the MRZ and shows the read), or a photo. NativeScript 8+,
Android 7+ (API 24) and iOS 15+.

```
npm install @mrzscanner/nativescript
```

The plugin sets the iOS deployment target (15.0) and a camera usage text (your app's
`App_Resources/iOS/Info.plist` can give its own `NSCameraUsageDescription`).

## Use

```ts
import { MRZScanner } from '@mrzscanner/nativescript';

await MRZScanner.registerLicense('MRZ2...');      // once; without it some fields are masked

const result = await MRZScanner.scan({ documentTypes: ['passport', 'id'] });
if (result.status === 'read') {
  const read = result.reads[0];
  console.log(read.text, read.fields.document_number, read.checkDigitsValid);
}

const fromPhoto = await MRZScanner.scanImage({ path: photoPath });   // or { base64 }
```

`scan(settings)` opens the camera (asking for the permission), and closes after the first read, or
with `continuous: true` collects each new document until Stop. It resolves with
`{ status, reads, elapsedMs }`; `status` is `read`, `stopped`, `timeout`, `permissionDenied`,
`licenseInactive` or `error`. Settings: `continuous`, `duplicateTimeoutMs`, `confirmation`
(`normal` / `fast`), `timeoutMs`, `torch`, `zoom`, `vibrateOnRead`, `arOverlay`,
`documentTypes`, `regionOfInterest`, `isolateMrz`, `isolatedHeight`, `title`.

Each read: `text` (the MRZ lines), `checkDigitsValid`, `kind`, `fields` (`document_number`,
`surnames`, `given_names`, `nationality`, `dob_raw`, `expiration_date_raw`, ...), `corners`,
`isolatedMrz`. The types ship with the package.

`scanImage(image, options)`: `image` is `{ path }` (file path or URI) or `{ base64 }` (JPEG / PNG);
`options`: `{ documentTypes, isolatedHeight }`. Resolves with the read or `null` (it runs on the
calling thread: about 30-100 ms for a photo).

Version 2.7.4. Licence: a commercial MRZ scanner licence (https://mrzscanner.com/).
