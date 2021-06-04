import { Component, HostListener } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import * as cookie from 'cookie';

enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  posts: Post[];
  currentPost: Post;
  appState: AppState;
  username: string = '';

  constructor(private blogService: BlogService) {
    this.username = this.parseJWT(cookie.parse(document.cookie).jwt)['usr'];
    this.blogService.fetchPosts(this.username)
      .then((res) => {
        this.posts = res;
        this.appState = AppState.List;
        this.onHashChange();
      });
  }

  ngOnInit(): void {

  }

  @HostListener('window:hashchange')
  onHashChange(): void {
    if (window.location.hash.includes('#/edit')) {
      const postid: number = parseInt(window.location.hash.substr('#/edit'.length + 1));
      if (postid === 0) {
        this.currentPost = new Post();
        this.appState = AppState.Edit;
      } else {
        const index: number = this.posts.findIndex((post) => post.postid === postid);
        if (index !== -1) {
          this.currentPost = this.posts[index];
          this.appState = AppState.Edit;
        } else {
          this.appState = AppState.List;
          window.location.hash = '#/';
        }
      }
    } else if (window.location.hash.includes('#/preview')) {
      const postid: number = parseInt(window.location.hash.substr('#/preview'.length + 1));
      if (postid !== 0) {
        const index: number = this.posts.findIndex((post) => post.postid === postid);
        if (index !== -1) {
          this.currentPost = this.posts[index];
          this.appState = AppState.Preview;
        } else {
          this.appState = AppState.List;
          window.location.hash = '#/';
        }
      }
    } else {
      this.appState = AppState.List;
      if (window.location.hash !== '#/') {
        window.location.hash = '#/';
      }
    }
  }

  parseJWT(token: any): any {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  openPost(post: Post): void {
    this.currentPost = post;
    this.appState = AppState.Edit;
    window.location.hash = `#/edit/${post.postid}`;
  }

  newPost(): void {
    this.currentPost = new Post();
    this.appState = AppState.Edit;
    window.location.hash = '#/edit/0';
  }

  savePost(post: Post): void {
    this.blogService.setPost(this.username, post)
      .then((saved) => {
        this.blogService.fetchPosts(this.username)
          .then((res) => {
            this.posts = res;
            this.appState = AppState.List;
            if (post.postid === 0) {
              window.location.hash = `#/edit/${saved.postid}`;
            }
          })
      });
  }

  deletePost(post: Post): void {
    this.blogService.deletePost(this.username, post.postid)
      .then(() => {
        this.posts.forEach((element, index) => {
          if (element.postid === post.postid) {
            this.posts.splice(index, 1);
          }
        });
        this.appState = AppState.List;
        window.location.hash = '#/';
      });
  }

  previewPost(post: Post): void {
    this.currentPost = post;
    this.appState = AppState.Preview;
    window.location.hash = `#/preview/${post.postid}`;
  }

  editPost(post: Post): void {
    this.currentPost = post;
    this.appState = AppState.Edit;
    window.location.hash = `#/edit/${post.postid}`;
  }

}
