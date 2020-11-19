# Build

ionic build --prod
npx cap copy | npx cap sync

# Build android

ionic build --prod
npx cap copy android | npx cap sync android
npx cap open android

From Android studio Build >

android/app/build.gradle -> Modify version number + name
Build bundle or APK

# Build ios

ionic build --prod
npx cap copy ios | npx cap sync ios
npx cap open ios

From Xcode >

Modify version number + name
Product > Archive
