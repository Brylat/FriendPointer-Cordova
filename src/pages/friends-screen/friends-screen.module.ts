import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsScreenPage } from './friends-screen';

@NgModule({
  declarations: [
    FriendsScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendsScreenPage),
  ],
})
export class FriendsScreenPageModule {}
