# Ignite OneSignal Plugin

This plugin adds [react-native-onesignal](https://github.com/OneSignal/react-native-onesignal)
to your [Ignite](https://github.com/infinitered/ignite) React Native project and
configures it so it works out of the box with Ignite projects.

## Usage

```
$ ignite add onesignal
```

This adds `ignite-onesignal` to your Ignite project.

## Setup instructions
## ⚠️  Both platforms requires a manual setup, follow the instructions bellow ⚠️

🛠️ **Android Setup**
Follow OneSignal's instructions on generating a Google Server API Key:
https://documentation.onesignal.com/docs/generate-a-google-server-api-key

Place the OneSignal App ID in **android/app/build.gradle**.

Replace YOUR_ONESIGNAL_ID by the OneSignal App ID.
```
manifestPlaceholders = [onesignal_app_id: "YOUR_ONESIGNAL_ID",
                        onesignal_google_project_number: "REMOTE"]
```

🛠️ **iOS Setup**
Follow OneSignal's instructions on generating an iOS Push Certificate:
https://documentation.onesignal.com/docs/generate-an-ios-push-certificate

Add Required Capabilities
https://github.com/OneSignal/react-native-onesignal#add-required-capabilities

Adding Search Paths
https://github.com/OneSignal/react-native-onesignal#adding-search-paths

Place the OneSignal App ID in **ios/AppDelegate.m**

Replace YOUR_ONESIGNAL_ID by the OneSignal App ID.
```
self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                appId:@"YOUR_ONESIGNAL_APP_ID"
                        settings:@{kOSSettingsKeyInFocusDisplayOption :
                        @(OSNotificationDisplayTypeNotification), kOSSettingsKeyAutoPrompt : @YES}];
```

## Contributing

1. Clone this repo
2. Run `npm install`
3. Run `npm test`
4. Check out a branch and make your changes
5. Write tests for those changes
6. Submit a pull request back upstream

## License

This plugin is licensed MIT by Lighthouse, LTDA., and was created by Donald Silveira.
