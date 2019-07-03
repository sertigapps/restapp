import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalChargePage } from './modal-charge';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalChargePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalChargePage),
  ],
})
export class ModalChargePageModule {}
