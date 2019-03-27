import { Component ,Directive} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import {ProfilePage} from '../profile/profile'
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {AutoresizeDirective} from '../../directives/autoresize/autoresize';
import * as $ from 'jquery';



@IonicPage() 
@Component({
  selector: 'page-update-status',
  templateUrl: 'update-status.html',
  providers:[AutoresizeDirective]
})

export class UpdateStatusPage {
  public statusForm: FormGroup;
  public userProfile: any;

  constructor(public menuCtrl:MenuController,public navCtrl: NavController, public navParams: NavParams,
    public profileService:ProfileServiceProvider,formBuilder: FormBuilder, public platform: Platform) {
    this.statusForm = formBuilder.group({
      status: ['', Validators.required]
    });
  }
  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.menuCtrl.enable(false, 'myMenu');
      this.menuCtrl.swipeEnable(false);
    })

  }
 
  ionViewWillLeave() {
    this.menuCtrl.enable(true,'myMenu');
    this.menuCtrl.swipeEnable(true);
  }
  ngOnInit() {
    this.profileService.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
    })
  }

  uploadStatus(){
    this.profileService.updateStatus(this.statusForm.value.status);
    this.navCtrl.pop()
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateStatusPage');
  }

 

}
