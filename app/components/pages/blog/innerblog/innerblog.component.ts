import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-innerblog',
  templateUrl: './innerblog.component.html',
  styleUrls: ['./innerblog.component.scss']
})
export class InnerblogComponent implements OnInit {

  innerBlogData: any;
  blogId: any;
  blog: any;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      // console.log(res)
      this.blogId = res.id;
      this.getBlog();
    });
  }
  getBlog() {
    this.api.getBlogById(this.blogId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.blog = res;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
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
