import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { InnerblogComponent } from './innerblog/innerblog.component';

const routes: Routes = [
  {
    path:'',component:BlogsComponent
  },
  {
    path:'blog/:id',component:InnerblogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
