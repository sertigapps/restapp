import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopMenuPage } from './top-menu';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TopMenuPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TopMenuPage),
  ],
})
export class TopMenuPageModule {}
