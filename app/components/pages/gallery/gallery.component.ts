import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GalleryComponent implements OnInit {
  galleryId: string | undefined; // Proper typing for ID
  data: { images: string[] } | undefined; // Assuming the API returns an object with `images` array

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.galleryId = params.id;
      console.log('Gallery ID:', this.galleryId);
      this.getGalleryData();
    });
  }

  getGalleryData(): void {
    if (!this.galleryId) return;

    this.api.getSingleGalleryData(this.galleryId).subscribe({
      next: (res: any) => {
        this.data = res.gallery; // Ensure `gallery` contains an `images` array
        console.log('Gallery Data:', this.data);
      },
      error: (err: any) => {
        console.error('Error fetching gallery data:', err);
      }
    });
  }
}
