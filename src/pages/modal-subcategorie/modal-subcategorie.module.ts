import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSubcategoriePage } from './modal-subcategorie';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalSubcategoriePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalSubcategoriePage),
  ],
})
export class ModalSubcategoriePageModule {}
