import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchupPage } from './matchup';

@NgModule({
  declarations: [
    MatchupPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchupPage),
  ],
})
export class MatchupPageModule {}
