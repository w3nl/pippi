// The Android app of Villa Villekulla: a small app that shows the game (from the folder assets/game) in a WebView.
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "VillaVillekulla"
include(":app")
