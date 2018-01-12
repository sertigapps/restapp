import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the AboutUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  about_us_title: any;
  about_us_text: any;
  image_url:any;
  store_name:any;
  constructor(public userprovider:UserProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.about_us_text = "";
    this.about_us_title = "";
    this.image_url = "";
    this.store_name = "";
    this.userprovider.get_store_about_us().subscribe((data)=>{
      this.about_us_text = data.description;
      this.about_us_title = data.title;
      this.image_url = data.image_url;
      this.store_name = data.store_name;
    });
  }

}
