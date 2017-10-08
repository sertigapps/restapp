import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCategoriePage } from './modal-categorie';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalCategoriePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalCategoriePage),
  ],
})
export class ModalCategoriePageModule {}
