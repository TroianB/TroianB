import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { MessageService } from 'primeng/api';
import CountryList from 'country-list-with-dial-code-and-flag'

interface Gallery {
  _id: any;
  thumbnail: string;
  title: string;
  desc: string;
  images: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  hoveredIndex: number | null = null;

  onHover(index: number): void {
    this.hoveredIndex = index;
  }

  onLeave(): void {
    this.hoveredIndex = null;
  }

  countries = CountryList.getAll();
  selectedCountry: any = this.countries[28]
  responsiveOptions: any;
  allTours: any[] = []

  bannerImage: any[] = [
    { img: '../../../../assets/home/home_banner.jpg' },
    { img: '../../../../assets/home/home_banner.jpg' },
    { img: '../../../../assets/home/home_banner.jpg' },
    { img: '../../../../assets/home/home_banner.jpg' }
  ];
  bannerDetails: any[] = [];

  blogs: any[] = [];
  allActivities: any[] = [];

  contactForm!: FormGroup;
  galleryData: Gallery[] = []

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '2599px',
        numVisible: 5,
        numScroll: 1
      },
      {
        breakpoint: '1399px',
        numVisible: 4,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      }
      ,
      {
        breakpoint: '568px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.contactForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      country_code: [this.selectedCountry.countryCode, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11)]],
      message: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.getHomeBanner();
    this.getAllTours();
    this.getBlogs();
    this.getActivities();
    this.getGallery()
  }

  getHomeBanner() {
    this.api.getHomeBanners().subscribe({
      next: (res: any) => {
        this.bannerDetails = res;
        this.bannerDetails = this.bannerDetails.map((banner, index) => ({
          ...banner,     // Spread the existing properties
          index: index + 1 // Add the index (1-based)
        }));
        console.log(this.bannerDetails);
      }, error: (err: any) => {
        console.log(err);
      }
    })
  }

  getBlogs() {
    this.api.getBlogs().subscribe({
      next: (res: any) => {
        console.log(res);
        this.blogs = res.slice(0, 3);
      }, error: (err: any) => {
        console.log(err);
      }
    })
  }

  toursDetails(id: any) {
    this.router.navigate([`/tours/tour/${id}`]);
  }

  formatPhoneNumber() {
    // const phoneUtil = new AsYouType();
    const formattedNumber = (this.contactForm.get('country_code')?.value);
    this.contactForm.get('country_code')?.setValue(formattedNumber);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.api.createFeedback(this.contactForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Feedback sent successfully' });
          this.contactForm.reset();
        }, error: (err: any) => {
          console.log(err);
        }
      })
    }
    else {
      this.contactForm.markAllAsTouched();
    }
  }

  getAllTours() {
    this.api.getTours().subscribe((res: any) => {
      console.log("Tours", res)
      this.allTours = res.tours
    })
  }
  getActivities() {
    this.api.getAllActivities().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allActivities = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getGallery() {
    this.api.getGalleryData().subscribe({
      next: (res: any) => {
        console.log(res.gallery)
        this.galleryData = res.gallery
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  scrollToTours() {
    const element = document.getElementById('container-3');
    if (element) {
      console.log(element);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
