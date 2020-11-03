# Installation

ionic start myApp blank

npm install angular-svg-icon

npm install husky --save-dev
npm install prettier --save-dev
npm install pretty-quick --save-dev
npm install tslint-config-prettier --save-dev

# Configuration capacitor

Modifier capacitor.config.json

ionic build --prod

npx cap add android|ios

# Configuration android

android/app/src/main/AndroidManifest.xml -> package name
android/app/src/main/res/values/strings.xml -> all
android/app/build.gradle -> Modify package name

# Configuration ios

Générer sur portail apple appid, certificats, profils
Configurer Signing et capabilities dans Xcode

# Update platforms (after plugin installation)

npx cap update

# Icons and splashscreens

cordova-res (android|ios) --skip-config --copy

resources/icon.png (1024x1024)
resources/splash.png (2732x2732 + elements in 1200x1200 square)
resources/android/icon-background.png
resources/android/icon-foreground.png

# Build android

android/app/build.gradle -> Modify version number + name

ionic build --prod

npx cap copy android OR npm cap sync android

(copy -> web assets only / sync -> also updates native dependencies)

npx cap open android

From Android studio Build > Build bundle or APK

# Build ios

ionic build --prod

npx cap copy ios OR npm cap sync ios

(copy -> web assets only / sync -> also updates native dependencies)

npx cap open ios

From Xcode >

Modify version number + name
Product > Archive
