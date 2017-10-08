import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminMenusPage } from './admin-menus';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminMenusPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminMenusPage),
  ],
})
export class AdminMenusPageModule {}
