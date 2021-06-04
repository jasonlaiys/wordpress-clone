import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  @Input() posts: Post[];
  @Output() openPost = new EventEmitter<Post>();
  @Output() newPost = new EventEmitter<Post>();

  constructor() { }

  ngOnInit(): void {

  }

  convertDate(date: number): string {
    return new Date(date).toString();
  }

}
