import { Component } from '@angular/core';
import { NavController,MenuController, AlertController, IonicPage, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TranslationPipe } from "../../pipes/translation/translation";

/**
 * Generated class for the RecoverPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
    createSuccess = false;
    registerCredentials = { emailaddress: '' };  
   
    constructor(public translate : TranslationPipe,public menu: MenuController,private nav: NavController, private auth: AuthServiceProvider, public loadingController:LoadingController,private alertCtrl: AlertController) {
      this.menu.enable(false, 'sidenav'); 
     }
   
    public recover() {
      let loading = this.loadingController.create({content : this.translate.transform('recover_message')});
      loading.present();
      this.auth.recover(this.registerCredentials).subscribe(res => {
        loading.dismissAll();
        if (!res.errorMessage) {
          this.createSuccess = true;
          this.showPopup(this.translate.transform('success'), this.translate.transform('account_recover'));
        } else {
          this.showPopup(res.errorMessage, this.translate.transform('problem_recovering'));
        }
      },
        error => {
          loading.dismissAll();
          this.showPopup(this.translate.transform('error_on_request'), this.translate.transform(error));
        });
    }
   
    showPopup(title, text) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: text,
        buttons: [
          {
            text: 'OK',
            handler: data => {
              if (this.createSuccess) {
                this.nav.popToRoot();
              }
            }
          }
        ]
      });
      alert.present();
    }
  }