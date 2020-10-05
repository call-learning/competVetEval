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

android/app/src/main/AndroidManifest.xml -> package name + activity name
android/app/src/main/res/values/strings.xml -> all

# Configuration ios

TODO

# Build

ionic build --prod

npx cap copy (android|ios) OR npm cap sync (android|ios)

(copy -> web assets only / sync -> also updates native dependencies)

npx cap open android|ios

# Update platforms (after plugin installation)

npx cap update

# Icons and splashscreens

cordova-res (android|ios) --skip-config --copy
