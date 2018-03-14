// Ignite CLI plugin for Onesignal
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = 'react-native-onesignal'
const NPM_MODULE_VERSION = '3.0.5'

// const PLUGIN_PATH = __dirname
const IS_WINDOWS = process.platform === 'win32'
const APP_PATH = process.cwd()
const APP_NAME = require(`${APP_PATH}/app.json`).name

const ANDROID_MANIFEST_CONFIG = `
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
`
const ANDROID_GRADLE_CONFIG = `
        manifestPlaceholders = [onesignal_app_id: "YOUR_ONESIGNAL_ID",
                                onesignal_google_project_number: "REMOTE"]
`

const IOS_IMPORT_ONESIGNAL = `#import <RCTOneSignal.h>`
const IOS_DECLARE_ONESIGNAL = `@property (strong, nonatomic) RCTOneSignal* oneSignal;`
const IOS_SYNTHESIZE_ONESIGNAL = `@synthesize oneSignal = _oneSignal;`
const IOS_ONESIGNAL_CONFIG = `
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                       appId:@"YOUR_ONESIGNAL_APP_ID"
                                                    settings:@{kOSSettingsKeyInFocusDisplayOption : @(OSNotificationDisplayTypeNotification), kOSSettingsKeyAutoPrompt : @YES}];
`

const add = async function (context) {
  const { ignite, print } = context

  // install an NPM module and link it
  await ignite.addModule(NPM_MODULE_NAME, { link: true, version: NPM_MODULE_VERSION })

  print.warning(`⚠️  Both platforms requires a manual setup, follow the instructions bellow ⚠️`)
  print.info('')
  print.info(`  🛠️ ${print.colors.bold('Android Setup')}`)
  print.info(`  Follow OneSignal's instructions on generating a Google Server API Key:`)
  print.info(`  ${print.colors.cyan('https://documentation.onesignal.com/docs/generate-a-google-server-api-key')}`)
  print.info('')
  print.info(`  Place the OneSignal App ID in ${print.colors.bold('android/app/build.gradle')}`)
  print.info('')
  print.info(`${print.colors.bold('        manifestPlaceholders = [onesignal_app_id: "YOUR_ONESIGNAL_ID",')}`)
  print.info(`${print.colors.bold('                                onesignal_google_project_number: "REMOTE"]')}`)
  print.info('')
  print.info('')
  print.info(`  🛠️ ${print.colors.bold('iOS Setup')}`)
  print.info(`  Follow OneSignal's instructions on generating an iOS Push Certificate:`)
  print.info(`  ${print.colors.cyan('https://documentation.onesignal.com/docs/generate-an-ios-push-certificate')}`)
  print.info('')
  print.info(`  Add Required Capabilities`)
  print.info(`  ${print.colors.cyan('https://github.com/OneSignal/react-native-onesignal#add-required-capabilities')}`)
  print.info('')
  print.info(`  Adding Search Paths`)
  print.info(`  ${print.colors.cyan('https://github.com/OneSignal/react-native-onesignal#adding-search-paths')}`)
  print.info('')
  print.info(`  Place the OneSignal App ID in ${print.colors.bold('ios/AppDelegate.m')}`)
  print.info('')
  print.info(`${print.colors.bold('  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions')}`)
  print.info(`${print.colors.bold('               appId:@"YOUR_ONESIGNAL_APP_ID"')}`)
  print.info(`${print.colors.bold(`            settings:@{kOSSettingsKeyInFocusDisplayOption :
    @(OSNotificationDisplayTypeNotification), kOSSettingsKeyAutoPrompt : @YES}];`)}`)
  print.info('')

  // Patching in files

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: ANDROID_MANIFEST_CONFIG,
    after: `<uses-permission android:name="android.permission.INTERNET" />`
  })

  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    insert: ANDROID_GRADLE_CONFIG,
    before: `ndk {`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.h`, {
    insert: IOS_IMPORT_ONESIGNAL,
    after: `#import <UIKit/UIKit.h>`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.h`, {
    insert: IOS_DECLARE_ONESIGNAL,
    before: `@end`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.m`, {
    insert: IOS_SYNTHESIZE_ONESIGNAL,
    after: `@implementation AppDelegate`
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.m`, {
    insert: IOS_ONESIGNAL_CONFIG,
    before: `return YES;`
  })
}

/**
 * Remove yourself from the project.
 */
const remove = async function (context) {
  const { ignite } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })

  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    delete: ANDROID_MANIFEST_CONFIG
  })

  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    delete: ANDROID_GRADLE_CONFIG
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.h`, {
    delete: IOS_IMPORT_ONESIGNAL
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.h`, {
    delete: IOS_DECLARE_ONESIGNAL
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.m`, {
    delete: IOS_SYNTHESIZE_ONESIGNAL
  })

  ignite.patchInFile(`${APP_PATH}/ios/${APP_NAME}/AppDelegate.m`, {
    delete: IOS_ONESIGNAL_CONFIG
  })
}

// Required in all Ignite CLI plugins
module.exports = { add, remove }

