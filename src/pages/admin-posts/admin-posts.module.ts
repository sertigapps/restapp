import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPostsPage } from './admin-posts';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminPostsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminPostsPage),
  ],
})
export class AdminPostsPageModule {}
