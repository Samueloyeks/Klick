import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TempFriendsListPage } from './temp-friends-list';

@NgModule({
  declarations: [
    TempFriendsListPage,
  ],
  imports: [
    IonicPageModule.forChild(TempFriendsListPage),
  ],
})
export class TempFriendsListPageModule {}
