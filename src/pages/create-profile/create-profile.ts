import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TabsPage } from '../tabs/tabs';
import * as firebase from 'firebase';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController, Loading, ActionSheetController } from 'ionic-angular';
import 'firebase/auth';
import 'firebase/database';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Crop } from '@ionic-native/crop';
import { WindowCapacitor } from '@capacitor/core/dist/esm/definitions';
import { Storage } from "@ionic/storage";
import { File, } from "@ionic-native/file";
// import { Transfer, TransferObject } from "@ionic-native/transfer";
import { FilePath, } from "@ionic-native/file-path";
import { Camera } from "@ionic-native/camera";

declare var cordova: any; 


@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
  providers: [FirebaseServiceProvider, ProfileServiceProvider]
})
export class CreateProfilePage {
  public infoForm: FormGroup;

  public freeTime: any;
  public movies: any;
  public relationship: any;
  public romance: any;
  public animals: any;
  public job: any;
  public flexibility: any;
  public open: any;
  public location: any;
  public description: any;

  public profilePicture: string = null;
  public lastImage: string = null;
  public base64Image: string = null;
  public loading: Loading;

  public Fbref: any;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public imgUrl: any;
  captureDataUrl: string;
  savedPicture;
  selectedPhoto;
  someTextUrl;
  currentImage;
  navigateToTabs() {
    this.navCtrl.setRoot(TabsPage)
  }
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public firebaseService: FirebaseServiceProvider, formBuilder: FormBuilder, private storage: Storage,
    public ProfileService: ProfileServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public toastCtrl: ToastController, private sanitizer: DomSanitizer,
    public camera: Camera, public actionSheetCtrl: ActionSheetController,
    public platform: Platform, private Crop: Crop, private file: File, private filePath: FilePath,
  ) {
    this.Fbref = firebase.storage().ref()

    this.infoForm = formBuilder.group({
      freeTime: ['', Validators.required],
      movies: ['', Validators.required],
      relationship: ['', Validators.required],
      romance: ['', Validators.required],
      animals: ['', Validators.required],
      job: ['', Validators.required],
      flexibility: ['', Validators.required],
      open: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
    });


    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
  }



  async uploadpic() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      buttons: [
        {
          text: "Select from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      allowEdit: true,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();

      this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);

      this.upload();
    }, (err) => {
      console.log('error', err);
    });
  }
  getUrl(){
    const currentUserId = firebase.auth().currentUser.uid;
    let url = firebase.storage().ref(`userProfile/${currentUserId}/profilePic.png`).getDownloadURL();
    console.log(url)
  }

  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };
  upload() {  
    if (this.selectedPhoto) {
      const currentUserId = firebase.auth().currentUser.uid;
      var uploadTask = firebase.storage().ref().child(`userProfile/${currentUserId}/profilePic.png`).put(this.selectedPhoto);
      uploadTask.then(this.onSuccess, this.onError);
    }
  }
  onSuccess = snapshot => {
    // const currentUserId = firebase.auth().currentUser.uid;
    this.currentImage = snapshot.downloadURL;
    // firebase.database().ref(`userProfile/${currentUserId}/profilePic`).set( this.currentImage )
    console.log(this.currentImage)
    this.loading.dismiss(); 
  };
  
  onError = error => {
    console.log("error", error);
    this.loading.dismiss();
  };


  async navigateToApp() {

    var info = {
      freeTime: this.infoForm.value.freeTime,
      movie: this.infoForm.value.movies,
      relationship: this.infoForm.value.relationship,
      romance: this.infoForm.value.romance,
      animals: this.infoForm.value.animals,
      job: this.infoForm.value.job,
      flexibility: this.infoForm.value.flexibility,
      open: this.infoForm.value.open,
      location: this.infoForm.value.location,
      description: this.infoForm.value.description, 
    };
    if (!this.infoForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.infoForm.value}`
      );
      let toast = this.toastCtrl.create({
        message: 'Complete entire form',
        duration: 3000,
        position: 'top'
      })
      toast.present();
    } else {
      var loader = this.loadingCtrl.create({ content: "Please wait..." });
      loader.present();
      // this.ProfileService.addPic(profilePicture).then(()=>{
      //   this.profilePicture = null;
      // })
      this.ProfileService.addInfo(info).then(() => {
        loader.dismiss().then(() => {
          this.navCtrl.setRoot(TabsPage);
        });
      });
    }
  }



}
