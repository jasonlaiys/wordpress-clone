export class Post {
  postid: number = 0;
  created: number = 0;
  modified: number = 0;
  title: string = "";
  body: string = "";

  constructor(
    postid: number = 0,
    created: number = new Date().getTime(),
    modified: number = new Date().getTime(),
    title: string = '',
    body: string = ''
  ) {
    this.postid = postid;
    this.created = created;
    this.modified = modified;
    this.title = title;
    this.body = body;
  }
};
