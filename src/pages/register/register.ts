import { Component } from '@angular/core';
import { NavController,MenuController, AlertController, IonicPage, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
 
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { email: '', password: '' };  
 
  constructor(public menu: MenuController,private nav: NavController, private auth: AuthServiceProvider, public loadingController:LoadingController,private alertCtrl: AlertController) {
    this.menu.enable(false, 'sidenav'); 
   }
 
  public register() {
    let loading = this.loadingController.create({content : "Registering, please wait ....."});
    loading.present();
    this.auth.register(this.registerCredentials).subscribe(res => {
      loading.dismissAll();
      if (!res.errorMessage) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup(res.errorMessage, "Problem creating account.");
      }
    },
      error => {
        loading.dismissAll();
        this.showPopup("Error on Request", error);
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