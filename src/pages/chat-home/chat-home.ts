import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';



 
@IonicPage()
@Component({
  selector: 'page-chat-home',
  templateUrl: 'chat-home.html',
})
export class ChatHomePage {
  pages = [
    { pageName: 'ChatsPage', title: 'CHATS', icon: 'home', id: 'chatsTab'},
    { pageName: 'MatchesPage', title: 'YOU MATCHED TO', icon: 'checkmark-circle', id: 'matchesTab'},
    { pageName: 'MatchedPage', title: 'MATCHED TO YOU', icon: 'person-add', id: 'matchedTab'},
    { pageName: 'BlockedPage', title: 'BLOCKED', icon: 'eye-off', id: 'blockedTab'}
  ];
 
  selectedTab=0;


  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }
  onTabSelect(ev: any) {
   
      this.selectedTab = ev.index;
      this.superTabs.clearBadge(this.pages[ev.index].id);
    
  }

  


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatHomePage');
  }

}
