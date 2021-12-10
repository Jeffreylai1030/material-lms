import { CodeService } from 'src/app/services/code.service';
import { CommonService } from './common.service';
import { MemberDto } from './../models/member-dto';
import { BookDto } from 'src/app/models/book-dto';
import { Injectable } from '@angular/core';
import { Firestore, collection, where, setDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { BorrowDto } from '../models/borrow-dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  private dbPath = 'borrows';

  // Firestore data converter
  private converter = {
    toFirestore: (item: BorrowDto) => {
      return {
        id: item.id,
        addDate: item.addDate,
        addWho: item.addWho,
        editDate: item.editDate,
        editWho: item.editWho,
        borrowedDate: item.borrowedDate,
        dueDate: item.dueDate,
        status: item.status,
        member: item.member,
        book: item.book,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const item = snapshot.data(options);
        return new BorrowDto(
          item.id,
          item.addDate,
          item.addWho,
          item.editDate,
          item.editWho,
          item.borrowedDate,
          item.dueDate,
          item.status,
          item.member,
          item.book,
        );
    }
  };

  constructor(private firestore: Firestore,
    private commonService: CommonService,
    private codeService: CodeService) { }

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(this.converter);
    return collectionData(data);
  }

  getByStatus(status: string = '0') {
    const myQuery = query(collection(this.firestore, this.dbPath), where('status', '==', status), orderBy('dueDate'));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  async borrow(books: BookDto[], memberDto: MemberDto) {
    const date = new Date();
    const username = this.commonService.getCurrentUserName;
    const expiredDay = await this.codeService.getByCode('member', 'expired');

    console.log(expiredDay);

    // for (const book of books) {
    //   let dueDate = 0;

    //   let id = 'B900'
    //     + date.getFullYear().toString()
    //     + (date.getMonth() + 1).toString().padStart(2, '0')
    //     + date.getDate().toString().padStart(2, '0')
    //     + date.getHours().toString().padStart(2, '0')
    //     + date.getMinutes().toString().padStart(2, '0')
    //     + date.getSeconds().toString().padStart(2, '0')
    //     + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    //   const borrowDto = new BorrowDto(id,
    //     date,
    //     username,
    //     date,
    //     username,
    //     date, dueDate, '9', );

    // }

    // setDoc(doc(this.firestore, this.dbPath, borrowDto.id), Object.assign({}, borrowDto));
  }

  delete(id: string) {
    if (id) {
      deleteDoc(doc(this.firestore, this.dbPath, id));
    }
  }

  insertSampleBorrows() {

  }


}
