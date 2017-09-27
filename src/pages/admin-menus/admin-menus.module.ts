import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminMenusPage } from './admin-menus';

@NgModule({
  declarations: [
    AdminMenusPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminMenusPage),
  ],
})
export class AdminMenusPageModule {}
