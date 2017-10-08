import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalIngredientPage } from './modal-ingredient';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalIngredientPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalIngredientPage),
  ],
})
export class ModalIngredientPageModule {}
