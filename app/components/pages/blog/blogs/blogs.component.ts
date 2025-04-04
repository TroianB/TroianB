import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  blogs: any[] = [];
  itemsPerpage: number = 6;
  currentPage: number = 1;
  totalItems: number = 0;
  constructor(private api: ApiService) {

  }
  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs() {
    this.api.getBlogs().subscribe({
      next: (res: any) => {
        console.log(res);
        this.blogs = [...res];
        this.totalItems = this.blogs.length;
      }, error: (err: any) => {
        console.log(err);
      }
    })
  }

  pageChanged(data: number) {
    console.log(data);
    this.currentPage = data;
  }


  shareLink(id: any) {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this link!',
        text: 'Here is something interesting for you.',
        url: `https://bibaaisa.com/blogs/blog/${id}` // Replace with the actual link you want to share
      }).then(() => {
        console.log('Link shared successfully.');
      }).catch((error) => {
        console.error('Error sharing the link: ', error);
      });
    } else {
      // Fallback: Copy link to clipboard or use mailto for sharing via email
      this.copyToClipboard(`https://bibaaisa.com/blogs/blog/${id}`);
      alert('Sharing not supported on this browser. Link copied to clipboard.');
    }
  }
  copyToClipboard(link: string) {
    const input = document.createElement('textarea');
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
