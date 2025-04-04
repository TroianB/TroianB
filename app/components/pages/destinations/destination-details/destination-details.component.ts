import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-destination-details',
  templateUrl: './destination-details.component.html',
  styleUrls: ['./destination-details.component.scss']
})
export class DestinationDetailsComponent implements OnInit, AfterViewInit {

  tourId: any;
  allSpots: any;
  tourDetails: any;
  spot: any;
  spot_id: any;
  allActivities: any[] = [];
  allToursDetails: any[] = [];
  currentTourIndex: number = 0;
  spotStatus: boolean = true;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {

  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((id: any) => {
      // console.log(id.id)
      this.tourId = id.id;
      this.getAllSpots();
      this.getTourDetails();

    });
    this.getAllTours();
  }

  ngAfterViewInit() {
    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        console.log(element)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  getAllSpots() {
    this.api.getSpots(this.tourId).subscribe((res: any) => {
      console.log("spots", res)
      this.allSpots = res;
      this.spotStatus = true;

      this.allSpots = this.allSpots.map((spot: any) => {
        return { ...spot, show: false }
      });
      this.allSpots[0].show = true;
      this.spot = this.allSpots[0];
      this.spot_id = this.spot._id;
      console.log(this.spot_id);
      this.getAllActivities(this.spot_id);

    }, (err: any) => {
      console.log(err);
      this.spotStatus = false;
      this.allSpots = [];
      this.allActivities = [];
      console.log(this.allSpots);
    })
  }
  getAllActivities(id: any) {
    this.api.getActivities(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.allActivities = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  showSpot(index: any) {
    this.allSpots = this.allSpots.map((spot: any) => {
      return { ...spot, show: false }
    });
    this.allSpots[index].show = true;
    this.spot = this.allSpots[index];
    this.getAllActivities(this.allSpots[index]._id);
  }
  getTourDetails() {
    this.api.getSingleTourDetails(this.tourId).subscribe((res: any) => {
      console.log("tour details", res)
      this.tourDetails = res;

    })
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
    this.router.navigate(['/tours/tour-details', id]);
  }
  getCurrentTourId(): number {
    console.log(this.currentTourIndex);
    return this.allToursDetails[this.currentTourIndex]._id;
  }
}
