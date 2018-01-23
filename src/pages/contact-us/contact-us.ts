import { Component } from '@angular/core';
import { IonicPage, Platform,NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  public storesettings :any;
  constructor(public userprovider:UserProvider,private callNumber: CallNumber,public apavail:AppAvailability,public platform: Platform,public navCtrl: NavController,private iab: InAppBrowser, 
    public navParams: NavParams,private launchNavigator: LaunchNavigator) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    this.storesettings = this.userprovider.get_store_info();
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
    let app: string;
    if (this.platform.is('ios')) {
      app = iosSchemaName;
    } else if (this.platform.is('android')) {
      app = androidPackageName;
    } else {
      let browser = this.iab.create(httpUrl + username, '_system');
      browser.show();
      return;
    }
  
    this.apavail.check(app).then(
      () => { // success callback
        let browser = this.iab.create(appUrl + username, '_system');
        browser.show();
      },
      () => { // error callback
        let browser = this.iab.create(httpUrl + username, '_system');
        browser.show();
      }
    );
  }
  openfb(){
    this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://page/', 'https://www.facebook.com/','321608098254821');  
  }
  openig(){
      this.launchExternalApp('instagram://', 'com.instagram.android', 'instagram://user?username=', 'https://www.instagram.com/', 'cevichelerialabarra');
  }
  call(){
    this.callNumber.callNumber(this.storesettings.phonenumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
  open_maps(){
    this.launchNavigator.navigate([this.storesettings.lat,this.storesettings.long]);
  }
}
