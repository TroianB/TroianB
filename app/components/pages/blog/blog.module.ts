import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogsComponent } from './blogs/blogs.component';
import { InnerblogComponent } from './innerblog/innerblog.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module



@NgModule({
  declarations: [
    BlogsComponent,
    InnerblogComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class BlogModule { }
