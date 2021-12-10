export class BorrowDto {
  id: string;
  addDate: any;
  addWho: string;
  editDate: any;
  editWho: string;
  borrowedDate: any;
  dueDate: any;
  status: string;
  member: memberInterface;
  book: BookInterface;

  constructor (
    id: string = '',
    addDate: any = null,
    addWho: string = 'Test User',
    editDate: any = null,
    editWho: string = 'Test User',
    borrowedDate: any,
    dueDate: any,
    status: string,
    member: memberInterface,
    book: BookInterface,
    ) {
    this.id = id;
    this.addDate = addDate;
    this.addWho = addWho;
    this.editDate = editDate;
    this.editWho = editWho;
    this.borrowedDate = borrowedDate;
    this.dueDate = dueDate;
    this.status = status;
    this.member = member;
    this.book = book;
  }
}

interface BookInterface {
  id: string;
  title: string;
}

interface memberInterface {
  id: string;
  fullName: string;
}


