import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutUsPage } from './about-us';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AboutUsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AboutUsPage),
  ],
})
export class AboutUsPageModule {}
