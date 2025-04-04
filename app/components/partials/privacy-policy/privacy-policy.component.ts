import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule] 
})
export class PrivacyPolicyComponent implements OnInit{

  content:string='';
  loading:boolean=true;

  constructor(private api:ApiService){

  }
  ngOnInit(): void {
      this.api.getPrivacyPolicy().subscribe({
        next:(res:any)=>{
          console.log(res);
          this.content=res[0].privacyContent;
          this.loading=false;
        },
        error:(err:any)=>{
          console.log(err);
          this.loading=false;
        }
      })
  }

}
