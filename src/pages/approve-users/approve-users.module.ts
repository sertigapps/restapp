import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApproveUsersPage } from './approve-users';

@NgModule({
  declarations: [
    ApproveUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(ApproveUsersPage),
  ],
})
export class ApproveUsersPageModule {}
