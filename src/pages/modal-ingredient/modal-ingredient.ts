import { Component } from '@angular/core';
import { IonicPage,LoadingController,ViewController,ActionSheetController,Platform, NavParams,ToastController,Loading } from 'ionic-angular';
import { Ingredient } from '../../app/models/ingredient';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';
import { Http} from '@angular/http';
import { MenuProvider } from '../../providers/menu/menu';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-modal-ingredient',
  templateUrl: 'modal-ingredient.html',
})
export class ModalIngredientPage {
  public id : number;
  public title : string;
  public image_base : string = "https://s3.amazonaws.com/sertigs3/";
  loading: Loading;
  lastImage: string = null;
  image_uploaded: string = null;
  public title_button : string;
  public ingredient :  Ingredient;
  constructor(  public http: Http,public menuprovider:MenuProvider,public userprovider:UserProvider,private camera: Camera,private transfer: Transfer,
    public params: NavParams, public actionSheetCtrl: ActionSheetController,  private filePath: FilePath,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private file: File,
    public viewCtrl: ViewController) {
    this.id = this.params.get('id');
    if(this.id===0){
      this.ingredient = new Ingredient(0,'',{"id":0, "name":''},this.http);
      this.title = "Create new Ingredient";
      this.title_button = "Create";
    }
    else{
      this.ingredient = this.params.get('ing');
      if(this.ingredient.full_record.image_url){
        this.image_uploaded = this.ingredient.full_record.image_url;
      }
      this.title_button = "Save";
      this.title = "Update Ingredient";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Modal Ingredient');
  }
   dismiss() {
    this.viewCtrl.dismiss();
  }
  submit(){
     this.loading = this.loadingCtrl.create({
    content: 'Saving Ingredient',
  });
  this.loading.present();
    this.ingredient.save(this.userprovider.emailaddress,this.userprovider.token).subscribe(res => {
      this.loading.dismissAll();
      if (!res.errorMessage) {
        if(this.id===0){
          this.menuprovider.ingredients.push( new Ingredient(res.id,res.name,res,this.http));
        }
        else{
          if(res.Attributes){
            this.menuprovider.updateingredient(this.ingredient.id,res.Attributes);
          }
        }
        this.viewCtrl.dismiss();
      } else {
        this.presentToast(JSON.stringify(res));
      }
    },
      error => {
        this.loading.dismissAll();
        this.presentToast("Error on Request");
      });
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast(err);
  });
}
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    this.uploadImage();
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}
public pathForImageShow(img) {
    return this.image_base + this.userprovider.emailaddress.replace('@','_-_')+img;
}
public uploadImage() {
  // Destination URL
  var url = "http://ec2-54-237-201-190.compute-1.amazonaws.com/upload/upload_image.php";
 
  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);
 
  // File name only
  var filename = this.lastImage;
 
  var options = {
    fileKey: "file",
    fileName: this.userprovider.emailaddress.replace('@','_-_')+ filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {
      'fileName': this.userprovider.emailaddress.replace('@','_-_')+ filename,
      'sertig_email': this.userprovider.emailaddress,
      'sertig_token': this.userprovider.token
  }
  };
 
  const fileTransfer: TransferObject = this.transfer.create();
 
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();
 
  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll();
    var data_res= JSON.parse(data['response']);
    if(data_res.error){
      this.presentToast(data_res.message);
    }
    this.image_uploaded = this.pathForImageShow(this.lastImage);
    this.ingredient.full_record.image_url = this.image_uploaded;
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
  });
}

}
