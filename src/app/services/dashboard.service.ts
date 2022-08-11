import { Injectable } from '@angular/core';
import { Firestore, collection, where, setDoc, doc, deleteDoc, query, orderBy, collectionData, limit } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { BorrowDto } from '../models/borrow-dto';
import { BookService } from './book.service';
import { BorrowService } from './borrow.service';
import { CommonService } from './common.service';
import { MemberService } from './member.service';
import { ReturnService } from './return.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dbPathBrows = 'borrows';
  private dbPathReturns = 'returns';

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

  constructor(
    private firestore: Firestore,
    private commonService: CommonService,
    private memberService: MemberService,
    private returnService: ReturnService,
    private borrowService: BorrowService,
    private bookService: BookService
  ) { }

  getTodayBorrowsNumber() {
    var todayBorrowNumber = new Subject<number>();
    var date = new Date();
    var fromDate = new Date(date.setDate(date.getDate() - 1));

    this.borrowService.getByBorrowedDateRange(fromDate, new Date).subscribe(async item => {
      this.returnService.getByBorrowedDateRange(fromDate, new Date).subscribe(async item2 => {
        todayBorrowNumber.next(item.length + item2.length);
      })
    })

    return todayBorrowNumber.asObservable();
  }

  getWeekBorrowsNumber() {
    var weekBorrowNumber = new Subject<number>();
    var date = new Date();
    var fromDate = new Date(date.setDate(date.getDate() - 6));

    this.borrowService.getByBorrowedDateRange(fromDate, new Date).subscribe(async item => {
      this.returnService.getByBorrowedDateRange(fromDate, new Date).subscribe(async item2 => {
        weekBorrowNumber.next(item.length + item2.length);
      })
    })

    return weekBorrowNumber.asObservable();
  }
}
