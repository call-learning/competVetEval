# Installation

Installer ionic via npm:

- node v14.19.2 (npm v6.14.17)
- npm install

## Configuration capacitor

Modifier capacitor.config.json

```
ionic build --prod
```

npx cap add android|ios

## Configuration android

Vérifier :

```
android/app/src/main/AndroidManifest.xml -> package name
android/app/src/main/res/values/strings.xml -> all
android/app/build.gradle -> Modify package name
```

## Configuration ios

Générer sur portail apple appid, certificats, profils
Configurer Signing et capabilities dans Xcode

## Update platforms (after plugin installation)

`npx cap update`

Si build apk ne marche pas, essayer :

```
npx jetifier
npx cap sync
```

# Icons and splashscreens

```
cordova-res (android|ios) --skip-config --copy
```

resources/icon.png (1024x1024)
resources/splash.png (2732x2732 + elements in 1200x1200 square)
resources/android/icon-background.png
resources/android/icon-foreground.png
