import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalIngredientPage } from './modal-ingredient';

@NgModule({
  declarations: [
    ModalIngredientPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalIngredientPage),
  ],
})
export class ModalIngredientPageModule {}
