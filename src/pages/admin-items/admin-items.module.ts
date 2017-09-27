import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminItemsPage } from './admin-items';

@NgModule({
  declarations: [
    AdminItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminItemsPage),
  ],
})
export class AdminItemsPageModule {}
