import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralSettingsPage } from './general-settings';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    GeneralSettingsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(GeneralSettingsPage),
  ],
})
export class GeneralSettingsPageModule {}
