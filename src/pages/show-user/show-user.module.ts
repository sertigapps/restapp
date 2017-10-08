import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowUserPage } from './show-user';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ShowUserPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ShowUserPage),
  ],
})
export class ShowUserPageModule {}
