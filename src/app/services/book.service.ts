import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { BookDto } from '../models/book-dto';
import * as moment from 'moment';

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
    private httpClient: HttpClient,
    private commonService: CommonService
  ) { }

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
    const date = moment();

    if (!bookDto.id) {
      bookDto.id = 'B100'
        + date.format('YYYYMMDDhhmmss')
        + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    bookDto.addDate = bookDto.addDate || date.toDate();
    bookDto.addWho = bookDto.addWho || this.commonService.getCurrentUserName();
    bookDto.editDate = date.toDate();
    bookDto.editWho = this.commonService.getCurrentUserName();

    const ref = doc(this.firestore, this.dbPath, bookDto.id).withConverter(this.converter);
    return setDoc(ref, bookDto);
  }

  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.dbPath, id));
  }

  insertSampleBooks(number = 20) {
    this.httpClient.get('https://raw.githubusercontent.com/bvaughn/infinite-list-reflow-examples/master/books.json').subscribe((result: any) => {

      for (let i = 0; i < number; i++) {
        const data = result[i];
        const id = 'B10020211021180000' + number.toString().padStart(3, '0');
        const publishedDate = new Date(data?.publishedDate?.$date || '2021-10-21 18:00:00');
        const date = new Date('2021-10-21 18:00:00');
        const username = 'Administrator';

        const book = new BookDto(
          id,
          date,
          username,
          date,
          username,
          data.title,
          '',
          data.isbn,
          data.pageCount,
          publishedDate,
          '',
          data.thumbnailUrl,
          data.authors.filter((e: any) => e),
          'English', // Language
          '0', // Status
          [], // Categories
          data.categories // Tags
        )

        this.set(book);
      }
    })
  }
}
