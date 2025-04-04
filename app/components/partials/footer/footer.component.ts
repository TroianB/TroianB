import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{

  allTours:any;
  extractedData:any[]=[];
  constructor(private router: Router,private api:ApiService) { }

  ngOnInit(): void {
      this.getAllTours();
  }

  getAllTours() {
    this.api.getTours().subscribe((res: any) => {
      console.log("Tours", res)
      this.allTours = res.tours;

      if(this.allTours.length>3){
        this.extractedData = this.allTours.slice(0, 4).map((item:any) => ({
          name: item.name,
          id: item._id
        }));
      }
      else{
        this.extractedData = this.allTours.map((item:any) => ({
          name: item.name,
          id: item._id
        }));
      }
      console.log(this.extractedData);
    })
  }

  toursSection() {
    this.router.navigate(['']);
    setTimeout(() => {
      const element = document.getElementById('container-3');
      if (element) {
        console.log(element);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }
  completeJurnySection(){
    this.router.navigate(['']);
    setTimeout(() => {
      const element = document.getElementById('container-4');
      if (element) {
        console.log(element);
        element.scrollIntoView({ behavior: 'smooth' });
      }
      else{
        console.log(element);
      }
    }, 0);
  }
}
