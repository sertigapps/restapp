import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler,IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { UploaderProvider } from '../providers/uploader/uploader';
import { Keychain } from '@ionic-native/keychain';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from '../providers/user/user';
import { MenuProvider } from '../providers/menu/menu';
import { Push } from '@ionic-native/push';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { CartProvider } from '../providers/cart/cart';
import { CallNumber } from '@ionic-native/call-number';
import { PipesModule } from "../pipes/pipes.module";
import { TranslationPipe } from "../pipes/translation/translation";
import { LaunchNavigator } from '@ionic-native/launch-navigator';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    LaunchNavigator, 
    TranslationPipe,
    CallNumber,
    InAppBrowser,
    AppAvailability,
    Device,
    StatusBar,
    File,
    Transfer,
    Camera,
    FilePath,
    SplashScreen,
    Keychain,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    UploaderProvider,
    UploaderProvider,
    Push,
    UploaderProvider,
    UploaderProvider,
    UserProvider,
    MenuProvider,
    CartProvider
  ]
})
export class AppModule {}
