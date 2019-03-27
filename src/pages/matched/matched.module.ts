import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchedPage } from './matched';

@NgModule({
  declarations: [
    MatchedPage,
  ],
  imports: [
    IonicPageModule.forChild(MatchedPage),
  ],
})
export class MatchedPageModule {}
