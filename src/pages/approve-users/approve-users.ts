import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ApproveUsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approve-users',
  templateUrl: 'approve-users.html',
})
export class ApproveUsersPage {

  constructor(public userprovider:UserProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveUsersPage');
    this.userprovider.load_new_users();
  }
  approve(user){
    this.userprovider.approve_user(user);
  }
}
