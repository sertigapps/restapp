import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApproveUsersPage } from './approve-users';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ApproveUsersPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ApproveUsersPage),
  ],
})
export class ApproveUsersPageModule {}
