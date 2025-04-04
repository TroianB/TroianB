import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit {

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) { }


  tourId: any;
  spotId: any;
  allSpots: any;
  tourDetails: any;
  allActivities: any[] = [];
  allToursDetails: any[] = [];
  currentTourIndex: number = 0;
  spotsStatus: boolean = true;
  activityStatus: boolean = true;


  allDetailsForCheckout: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id: any) => {
      this.tourId = id.id;
      console.log(id.id);

      this.getAllSpots();
      this.getTourDetails();
      this.getAllTours();

    });
  }

  getAllTours() {
    this.api.getTours().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allToursDetails = res.tours;

        this.currentTourIndex = this.allToursDetails.findIndex(tour => tour._id === this.tourId);

      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  getCurrentTourId(): number {
    console.log(this.currentTourIndex);
    return this.allToursDetails[this.currentTourIndex]._id;
  }


  onNext(): void {
    if (this.currentTourIndex < this.allToursDetails.length - 1) {
      this.currentTourIndex++;
      this.navigateToTour(this.getCurrentTourId());
    }
  }

  onPrev(): void {
    if (this.currentTourIndex > 0) {
      this.currentTourIndex--;
      this.navigateToTour(this.getCurrentTourId());
    }
  }

  navigateToTour(id: number): void {
    // Navigate to the tour detail page based on the ID
    console.log(id);
    this.router.navigate(['/tours/tour', id]);
  }

  getAllSpots() {
    this.api.getSpots(this.tourId).subscribe((res: any) => {
      console.log("spots", res)
      this.allSpots = res;
      this.spotsStatus = true;

      this.allSpots = this.allSpots.map((spot: any) => {
        return { ...spot, added: false };
      });
      this.allSpots[0].added = true;
      this.spotId = this.allSpots[0]._id;
      this.getAllActivities(0);

    }, (err: any) => {
      console.log(err);
      this.allSpots = [];
      this.allActivities = [];
      this.spotsStatus = false;
    })
  }
  //in this method need index for set status false when return empty array
  getAllActivities(index: any) {
    this.api.getActivities(this.spotId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.activityStatus = false;
        res = res.map((item: any) => {
          return { ...item, added: false }
        })
        if (res.length) {
          this.allActivities.splice(index, 0, res);
          // this.allActivities.push([...res]);
        }
        else {
          this.allSpots[index].added = false;
        }
        console.log(this.allActivities);
      }, error: (err) => {
        console.log(err);
        this.activityStatus = true;
      }
    })
  }

  getTourDetails() {
    this.api.getSingleTourDetails(this.tourId).subscribe((res: any) => {
      console.log("tour details", res);
      this.tourDetails = res;
      this.allDetailsForCheckout.push(this.tourDetails);
    })
  }

  addSpot(index: number, action: string) {
    if (action == 'add') {
      this.allSpots[index].added = true;
      this.spotId = this.allSpots[index]._id;
      this.getAllActivities(index);
    }
    else {
      this.allSpots[index].added = false;
      console.log(this.allSpots);
      this.allActivities.splice(index, 1);
    }
  }
  addActivity(index1: number, index2: number, action: string) {
    if (action == 'add') {
      this.allActivities[index1][index2].added = true;
      this.allDetailsForCheckout.push(this.allActivities[index1][index2])
      console.log(this.allActivities);
    }
    else {
      console.log(this.allActivities);

      this.allActivities[index1][index2].added = false;
      this.allDetailsForCheckout.pop();

    }
  }
  onCheckout() {
    this.api.setData(this.allDetailsForCheckout);
    this.router.navigate(['tours/checkout']);
  }
  onTourDetailsPage() {
    this.api.setData(this.allDetailsForCheckout);
    this.router.navigate(['tours/tour-details', this.tourId]);
  }

  toursDetailsSection() {
    this.router.navigate([`/tours/tour-details/${this.tourId}`], {
      fragment: 'carousel'
    });
  }
}
