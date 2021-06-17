# Build

We use Capacitor (https://capacitorjs.com/docs/v3) to build the native application.

The build is in three steps:

1. Buid the ionic application
2. Copy the build into the related native folder (android, ios)
3. Build the application using the native SDK (https://capacitorjs.com/docs/v3/android)

For example:

    ionic build --prod
    npx cap copy android && npx cap sync android

Between steps 2 and 3 you might need to adjust settings directly into the
native folder (android or ios).

For android for example you might modify the android/app/build.gradle to change
the application version.

# Build android

    ionic build --prod
    npx cap copy android && npx cap sync android
    npx cap open android

From Android studio Build : Modify version number + name

    android/app/build.gradle

Build bundle or APK using Android Studio.

# Build ios

    ionic build --prod
    npx cap copy ios && npx cap sync ios
    npx cap open ios

From Xcode >

Modify version number + name
Product > Archive

# Build Test version

With mock data and MSW handler:

    ionic build --configuration=test
    ionic serve --configuration=test
