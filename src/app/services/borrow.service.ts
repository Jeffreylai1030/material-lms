import { MemberService } from 'src/app/services/member.service';
import { MemberDto } from 'src/app/models/member-dto';
import { BookDto } from './../models/book-dto';
import { BookService } from 'src/app/services/book.service';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Firestore, collection, where, setDoc, doc, deleteDoc, query, orderBy, collectionData, limit } from '@angular/fire/firestore';
import { BorrowDto } from '../models/borrow-dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  private username = this.commonService.getCurrentUserName;
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
        returnedDate: item.returnedDate,
        fine: item.fine,
        status: item.status,
        overdue: item.overdue,
        memberId: item.memberId,
        memberFullName: item.memberFullName,
        bookId: item.bookId,
        bookTitle1: item.bookTitle1,
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
          item.returnedDate,
          item.fine,
          item.status,
          item.overdue,
          item.memberId,
          item.memberFullName,
          item.bookId,
          item.bookTitle1,
        );
    }
  };

  constructor(private firestore: Firestore,
    private commonService: CommonService,
    private memberService: MemberService,
    private bookService: BookService) { }

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(this.converter);
    return collectionData(data);
  }

  getByBorrowedDateRange(startDate: Date, endDate: Date) {
    const myQuery = query(collection(this.firestore, this.dbPath), where('borrowedDate', '>=', startDate), where('borrowedDate', '<=', endDate));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  getByStatus(status: string = '0') {
    const myQuery = query(collection(this.firestore, this.dbPath), where('status', '==', status), orderBy('dueDate'));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  set(borrowDto: BorrowDto) {
    const date = new Date();

    if (!borrowDto.id) {
      borrowDto.id = 'B900'
        + date.getFullYear().toString()
        + (date.getMonth() + 1).toString().padStart(2, '0')
        + date.getDate().toString().padStart(2, '0')
        + date.getHours().toString().padStart(2, '0')
        + date.getMinutes().toString().padStart(2, '0')
        + date.getSeconds().toString().padStart(2, '0')
        + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    if (!borrowDto.addDate) {
      borrowDto.addDate = date;
    }
    borrowDto.editDate = date;

    if (!borrowDto.addWho) {
      borrowDto.addWho = this.commonService.getCurrentUserName();
    }
    borrowDto.editWho = this.commonService.getCurrentUserName();

    setDoc(doc(this.firestore, this.dbPath, borrowDto.id), Object.assign({}, borrowDto));
  }

  borrowBook(borrowDto: BorrowDto, bookDto: BookDto, memberDto: MemberDto) {
    this.set(borrowDto);

    bookDto.status = '9';
    this.bookService.set(bookDto);

    memberDto.borrowed += 1;
    memberDto.totalBorrowed += 1;
    this.memberService.set(memberDto);
  }

  returnBook(borrowDto: BorrowDto, bookDto: BookDto, memberDto: MemberDto) {
    this.set(borrowDto);

    bookDto.status = '0';
    this.bookService.set(bookDto);

    memberDto.borrowed = memberDto.borrowed >= 1 ? memberDto.borrowed - 1 : memberDto.borrowed;
    this.memberService.set(memberDto);
  }

  delete(id: string) {
    if (id) {
      deleteDoc(doc(this.firestore, this.dbPath, id));
    }
  }

  insertSampleBorrows() {

  }
}
