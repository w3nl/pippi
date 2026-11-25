# The Android app

Villa Villekulla as an app for Android phones and tablets. It is a small app with a WebView, and the game itself is inside the app, so it works without internet. It is built the same way as the Google TV app of [Ardennen Avontuur](https://github.com/w3nl/ardennen).

> **Read [Rights](#rights-before-you-publish) before you put the app in the Google Play Store.**

## How it fits together

| Path | What |
|---|---|
| `android/` | The Android project (Gradle, Kotlin build scripts, Java). The app id is `nl.w3nl.pippi` (it can't change once the app is on Google Play). |
| `android/app/src/main/java/nl/w3nl/pippi/MainActivity.java` | Shows the game full-screen and in landscape. It loads it from `https://appassets.androidplatform.net/assets/game/index.html` (`WebViewAssetLoader`), so the game can fetch its rooms and texts and saving works. The back button calls `window.appBack()`. |
| `tools/android-assets.js` | Copies the game into `android/app/src/main/assets/game` (not in git). **Add new top-level folders of the game to its list.** |
| `js/app.js` | `IN_ANDROID_APP`: in the app there is no service worker and no Install button (the game is already installed and offline). `window.appBack()`: close a close-up, else go to the title screen; on the title screen it returns `false` and the app closes. |
| `privacy.html` | The privacy policy that Google Play asks for (English, Dutch, Swedish). |
| `.github/workflows/android.yml` | Builds the app on every change to the game. On `main` the `.apk` goes to the release **android**. |

## Install it on a phone or tablet (without the Play Store)

1. Open the release **android** on GitHub on the phone (Releases → *Android app*), and download `villa-villekulla.apk`.
2. Open the file. Android asks once to allow installing apps from this source (the browser or the Files app): allow it.
3. Install. Without a fixed key (below), every build is signed with a different key: then remove the old app before installing a new one (your progress in the app is lost).

## A fixed key

With a fixed key, a new version installs over the old one, and the workflow also builds the signed bundle (`.aab`) that Google Play wants. Make the key once, on your own computer (Java's `keytool`), and **keep the file and the password safe**: Google Play needs the same key for every update.

```bash
keytool -genkeypair -v -keystore pippi.jks -alias pippi -keyalg RSA -keysize 2048 -validity 10000
```

Then turn the file into text and store both as repository secrets (Settings → Secrets and variables → Actions):

- `ANDROID_KEYSTORE_BASE64`: the output of `base64 -w0 pippi.jks` (Linux), `base64 -i pippi.jks` (macOS) or `certutil -encode pippi.jks pippi.txt` (Windows, use the text in pippi.txt)
- `ANDROID_KEYSTORE_PASSWORD`: the password (use the same one for the store and the key)

## Google Play (only after reading Rights)

1. A Google Play developer account (one-off fee). The Ardennen account can be used.
2. **Create app**: name, default language, *Game*, *Free*.
3. **App content**: privacy policy `https://kakelbont.online/privacy.html`; no ads; content rating about PEGI 3; data safety: no data collected or shared; target audience including children under 13. That brings the app under the **Families policy**: no ads SDKs, no data collection, and a privacy policy, all of which this app already meets.
4. **Testing → Internal testing**: upload `villa-villekulla.aab` from the workflow run, and add up to 100 testers by e-mail. They get it through the Play Store without the app being public.
5. A new personal developer account must first run a **closed test** with at least 12 testers for 14 days before it can publish publicly.
6. Screenshots: 1920 × 1080 shots of the game (title screen and a few rooms) can be made with Playwright, like `tools/store.js` in Ardennen.

## Rights (before you publish)

The game is an unofficial, non-commercial fan homage. That is fine for playing it yourselves, but **the Play Store is a different matter**:

- **Copyright:** Astrid Lindgren's books and characters (Pippi, Mr Nilsson, the horse, Tommy and Annika, Villa Villekulla, Captain Longstocking, Thunder-Karlsson and Bloom, Kling and Klang) are protected until 70 years after her death (she died in 2002, so until the end of 2072). The game's code, drawings and texts are our own, but the characters, names and world are not.
- **Trademark:** *Pippi Långstrump* / *Pippi Longstocking* / *Pippi Langkous* are registered trademarks, managed by The Astrid Lindgren Company (Astrid Lindgren AB), which licenses them actively.
- **Google Play's policy:** an app may not use someone else's characters, names or trademarks without permission. "Unofficial", "fan game", "free" and "non-commercial" don't change that. A likely outcome is that the app is rejected in review or removed after a complaint by the rights holder, and **repeated violations can get the whole developer account closed**, including other apps on it (such as Ardennen Avontuur).

This isn't legal advice, but the options are:

1. **Ask for permission.** Write to The Astrid Lindgren Company (astridlindgren.com) about a free, ad-free, educational fan game. With written permission (a licence), publishing is fine.
2. **Keep it private.** Install the `.apk` from the GitHub release on your own devices, or use Play's internal testing for a small group of invited testers. That is the same situation as the website: a fan project, not public in the store.
3. **Make it your own.** Replace Pippi and her world with original characters and names (and change the app id, name and texts before the first upload). Then the Play Store is no problem. This is a lot of work: every chapter, the portraits and the texts in three languages.
