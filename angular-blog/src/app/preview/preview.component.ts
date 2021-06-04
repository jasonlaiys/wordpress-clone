import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})

export class PreviewComponent implements OnInit {

  @Input() post: Post;
  @Output() editPost = new EventEmitter<Post>();
  parser: Parser = new Parser();
  renderer: HtmlRenderer = new HtmlRenderer();
  renderedTitle: string;
  renderedBody: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.renderedTitle = this.renderer.render(this.parser.parse(this.post.title));
    this.renderedBody = this.renderer.render(this.parser.parse(this.post.body));
  }

}
