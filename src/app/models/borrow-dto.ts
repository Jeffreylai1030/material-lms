export class BorrowDto {
  id: string;
  addDate: any;
  addWho: string;
  editDate: any;
  editWho: string;
  borrowedDate: any;
  dueDate: any;
  returnedDate: any;
  fine: number;
  status: string; // 0: not return; 9: retured
  memberId: string;
  memberFullName: string;
  bookId: string;
  bookTitle1: string;

  constructor (
    id: string = '',
    addDate: any = null,
    addWho: string = '',
    editDate: any = null,
    editWho: string = '',
    borrowedDate: any,
    dueDate: any,
    returnedDate: any,
    fine: number = 0,
    status: string = '0',
    memberId: string = '',
    memberFullName: string = '',
    bookId: string = '',
    bookTitle1: string = '',
    ) {
    this.id = id;
    this.addDate = addDate;
    this.addWho = addWho;
    this.editDate = editDate;
    this.editWho = editWho;
    this.borrowedDate = borrowedDate;
    this.dueDate = dueDate;
    this.returnedDate = returnedDate;
    this.fine = fine;
    this.status = status;
    this.memberId = memberId;
    this.memberFullName = memberFullName;
    this.bookId = bookId;
    this.bookTitle1 = bookTitle1;
  }
}
