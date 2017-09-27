import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminIngredientsPage } from './admin-ingredients';

@NgModule({
  declarations: [
    AdminIngredientsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminIngredientsPage),
  ],
})
export class AdminIngredientsPageModule {}
