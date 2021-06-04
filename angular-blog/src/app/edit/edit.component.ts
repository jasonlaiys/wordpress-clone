import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {

  @Input() post: Post = new Post();
  @Output() savePost = new EventEmitter<Post>();
  @Output() deletePost = new EventEmitter<Post>();
  @Output() previewPost = new EventEmitter<Post>();

  constructor() { }

  ngOnInit(): void {

  }

  convertDate(date: number): string {
    return new Date(date).toString();
  }

}
