import { Component } from '@angular/core';
import { NavController,MenuController, AlertController, IonicPage, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TranslationPipe } from "../../pipes/translation/translation";
 
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { email: '', password: '' };  
 
  constructor(public translate : TranslationPipe,public menu: MenuController,private nav: NavController, private auth: AuthServiceProvider, public loadingController:LoadingController,private alertCtrl: AlertController) {
    this.menu.enable(false, 'sidenav'); 
   }
 
  public register() {
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
        if (!regExp.test(this.registerCredentials.email)) {
          
        this.showPopup(this.translate.transform('invalid_email'), this.translate.transform('problem_creating_account'));
          return ;
        }
    let loading = this.loadingController.create({content : this.translate.transform('registering_message')});
    loading.present();
    this.auth.register(this.registerCredentials).subscribe(res => {
      loading.dismissAll();
      if (!res.errorMessage) {
        this.createSuccess = true;
        this.showPopup(this.translate.transform('success'), this.translate.transform('account_created'));
      } else {
        this.showPopup(this.translate.transform(res.errorMessage), this.translate.transform('problem_creating_account'));
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