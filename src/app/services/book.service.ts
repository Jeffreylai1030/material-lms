import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { BookDto } from '../models/book-dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private dbPath = 'books';

  // Firestore data converter
  private converter = {
    toFirestore: (item: BookDto) => {
      return {
        id: item.id,
        addDate: item.addDate,
        addWho: item.addWho,
        editDate: item.editDate,
        editWho: item.editWho,
        title: item.title,
        title2: item.title2,
        isbn: item.isbn,
        pageCount: item.pageCount,
        publishedDate: item.publishedDate,
        publisher: item.publisher,
        thumbnailUrl: item.thumbnailUrl,
        authors: item.authors,
        language: item.language,
        status: item.status,
        categories: item.categories,
        tags: item.tags,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const item = snapshot.data(options);
        return new BookDto(
          item.id,
          item.addDate,
          item.addWho,
          item.editDate,
          item.editWho,
          item.title,
          item.title2,
          item.isbn,
          item.pageCount,
          item.publishedDate,
          item.publisher,
          item.thumbnailUrl,
          item.authors,
          item.language,
          item.status,
          item.categories,
          item.tags,
        );
    }
  };

  constructor(
    private firestore: Firestore,
    private httpClient: HttpClient) { }

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(this.converter);
    return collectionData(data);
  }

  getById(id: string) {
    const myQuery = query(collection(this.firestore, this.dbPath), where('id', '==', id), limit(1));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  getByStatus(status: string) {
    const myQuery = query(collection(this.firestore, this.dbPath), where('status', '==', status));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  set(bookDto: BookDto) {
    const date = new Date();

    if (!bookDto.id) {
      bookDto.id = 'B100'
        + date.getFullYear().toString()
        + (date.getMonth() + 1).toString().padStart(2, '0')
        + date.getDate().toString().padStart(2, '0')
        + date.getHours().toString().padStart(2, '0')
        + date.getMinutes().toString().padStart(2, '0')
        + date.getSeconds().toString().padStart(2, '0')
        + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    if (!bookDto.addDate) {
      bookDto.addDate = date;
    }
    bookDto.editDate = date;

    setDoc(doc(this.firestore, this.dbPath, bookDto.id), Object.assign({}, bookDto));
  }

  delete(id: string) {
    if (id) {
      deleteDoc(doc(this.firestore, this.dbPath, id));
    }
  }

  insertSampleBooks() {
    this.httpClient.get('https://raw.githubusercontent.com/bvaughn/infinite-list-reflow-examples/master/books.json').subscribe((result: any) => {
      let count = 0;
      for (const data of result) {
        const date = new Date();
        const id = 'B10020211021180000' + count.toString().padStart(3, '0');

        let publishedDate = data?.publishedDate?.$date || '2021-10-21 18:00:00';

        this.set(new BookDto(id, new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', data.title, '', data.isbn, data.pageCount, new Date(publishedDate), '', data.thumbnailUrl, data.authors.filter((e: any) => e), 'English', '0', [], data.categories));

        count++;

        if (count > 20) break;
      }
    })
  }
}
