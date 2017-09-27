import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPostsPage } from './admin-posts';

@NgModule({
  declarations: [
    AdminPostsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminPostsPage),
  ],
})
export class AdminPostsPageModule {}
