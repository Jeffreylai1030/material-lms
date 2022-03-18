import { Injectable } from '@angular/core';
import { Firestore, collection, where, setDoc, doc, deleteDoc, query, orderBy, collectionData } from '@angular/fire/firestore';
import { ReturnDto } from '../models/return-dto';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private dbPath = 'return';

  // Firestore data converter
  private converter = {
    toFirestore: (item: ReturnDto) => {
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
        return new ReturnDto(
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
    private firestore: Firestore
  ) { }

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

  set(ReturnDto: ReturnDto) {
    const ref = doc(this.firestore, this.dbPath, ReturnDto.id).withConverter(this.converter);
    setDoc(ref, ReturnDto);
  }

  delete(id: string) {
    if (id) {
      deleteDoc(doc(this.firestore, this.dbPath, id));
    }
  }
}
