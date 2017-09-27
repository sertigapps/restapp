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
import { CartProvider } from '../providers/cart/cart';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
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
