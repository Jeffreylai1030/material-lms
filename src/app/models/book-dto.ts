export class BookDto {
  id: string;
  addDate: any;
  addWho: string;
  editDate: any;
  editWho: string;
  title: string;
  title2: string;
  isbn: string;
  pageCount: number;
  publishedDate: any;
  publisher: string;
  thumbnailUrl: string;
  authors: string[];
  language: string;
  status: string;
  categories: string[];
  tags: string[];

  constructor (
    id: string = '',
    addDate: any = null,
    addWho: string = '',
    editDate: any = null,
    editWho: string = '',
    title: string = '',
    title2: string = '',
    isbn: string = '',
    pageCount: number = 0,
    publishedDate: any = null,
    publisher: string = '',
    thumbnailUrl: string = '',
    authors: string[] = [],
    language: string = '',
    status: string = '0',
    categories: string[] = [],
    tags: string[] = [],
    ) {
    this.id = id;
    this.addDate = addDate;
    this.addWho = addWho;
    this.editDate = editDate;
    this.editWho = editWho;
    this.title = title;
    this.title2 = title2;
    this.isbn = isbn;
    this.pageCount = pageCount;
    this.publishedDate = publishedDate;
    this.publisher = publisher;
    this.thumbnailUrl = thumbnailUrl;
    this.authors = authors;
    this.language = language;
    this.status = status;
    this.categories = categories;
    this.tags = tags;
  }
}
