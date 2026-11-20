plugins {
    id("com.android.application")
}

// Optional fixed key (repository secrets ANDROID_KEYSTORE_BASE64 + ANDROID_KEYSTORE_PASSWORD, alias "pippi"), so a new
// version installs over the old one and Google Play accepts the bundle. Without it, GitHub signs with a changing
// debug key: then uninstall the old app first. See docs/android.md.
val keystoreFile = rootProject.file("keystore.jks")
val keystorePassword: String? = System.getenv("ANDROID_KEYSTORE_PASSWORD")

android {
    namespace = "nl.w3nl.pippi"
    compileSdk = 36

    defaultConfig {
        // The application id can't change once the app is on Google Play.
        applicationId = "nl.w3nl.pippi"
        minSdk = 24
        targetSdk = 36
        versionCode = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()
        versionName = "1." + (System.getenv("GITHUB_RUN_NUMBER") ?: "0")
    }

    signingConfigs {
        if (keystoreFile.exists() && keystorePassword != null) {
            create("pippi") {
                storeFile = keystoreFile
                storePassword = keystorePassword
                keyAlias = "pippi"
                keyPassword = keystorePassword
            }
        }
    }

    buildTypes {
        getByName("debug") {
            signingConfigs.findByName("pippi")?.let { signingConfig = it }
        }
        // The release bundle (.aab) for Google Play, signed with the same fixed key (the upload key).
        getByName("release") {
            signingConfigs.findByName("pippi")?.let { signingConfig = it }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.18.0")
}
