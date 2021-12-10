import { MemberService } from 'src/app/services/member.service';
import { CodeDto } from 'src/app/models/code-dto';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookDto } from 'src/app/models/book-dto';
import { BorrowDto } from 'src/app/models/borrow-dto';
import { BookService } from 'src/app/services/book.service';
import { BorrowService } from 'src/app/services/borrow.service';
import { CodeService } from 'src/app/services/code.service';
import { DialogComponent } from '../layout/dialog/dialog.component';
import { MemberDto } from 'src/app/models/member-dto';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent implements OnInit {
  displayedColumns = [
    'bookId',
    'bookName',
    'memberId',
    'borrowedDate',
    'dueDate',
    'overdue',
    'action'
  ];
  dataSource!: MatTableDataSource<BorrowDto>;
  pipe = new DatePipe('en-US');
  today = this.pipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  priceForWeeks = 0;
  priceForDays = 0;
  filterUsersCtrl = new FormControl();
  filterBooksCtrl = new FormControl();
  userCtrl = new FormControl();
  bookCtrl = new FormControl();
  finePerDay: number = 0;
  availableBooks: any;
  members: any;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private borrowService: BorrowService,
    public bookService: BookService,
    public memberService: MemberService,
    public codeService: CodeService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.borrowService.getByStatus('0').subscribe((item: BorrowDto[]) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.AllBorrow = item;
    });

    // Get available books
    this.bookService.getByStatus('0').subscribe((item: BookDto[]) => {
      this.availableBooks = item;
    });

    // Get active members
    this.memberService.getByStatus('9').subscribe((item: MemberDto[]) => {
      this.members = item;
    });

    this.codeService.getByCode('borrow', 'fine').subscribe((item: CodeDto[]) => {
      this.finePerDay = parseFloat(item[0]?.value1);
    });

    this.filterUsersCtrl.valueChanges.pipe().subscribe(() => {
      const search = this.filterUsersCtrl.value;

      if (search) {
        this.users = this.AllUsers.filter(item => item.id.includes(search.toLowerCase()));
      } else {
        this.users = this.AllUsers;
      }
    });

    this.filterBooksCtrl.valueChanges.pipe().subscribe(() => {
      const search = this.filterBooksCtrl.value;

      if (search) {
        this.books = this.AllBooks.filter(item => item.isbn.includes(search.toLowerCase()));
      } else {
        this.books = this.AllBooks;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onShowBook(borrow: Borrow) {
    console.log(borrow);
  }

  onReturn(borrow: Borrow) {
    const dueDate = new Date(borrow.dueDate);
    const diffDay = DaysBetween(dueDate, new Date());
    const fine = (Math.floor(diffDay / 7) * this.priceForWeeks + (diffDay % 7) * this.priceForDays);
    const content = diffDay < 0 ? `Return this book?` : `Return this book? The fine is RM ${fine.toFixed(2)}`;
    const curUser: any = JSON.parse(localStorage.getItem('lms_emp'));

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content,
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const today = Date.now();
        const user = this.AllUsers.find(x => x.id === borrow.user.id);
        const book = this.AllBooks.find(x => x.id === borrow.book.id);
        const id = 'lms_ret_' + this.pipe.transform(today, 'yyyyMMddHHmmss');

        if (diffDay > 0) {
          const ret: Return = {
            id: id + Math.floor(Math.random() * 1000),
            addDate: this.today,
            editDate: this.today,
            addWho: curUser.username,
            editWho: curUser.username,
            borrowId: borrow.id,
            returnDate: this.today,
            dueDate: borrow.dueDate,
            overdue: borrow.dueDate < this.today,
            fine
          };
          this.returnService.return(ret, user, borrow, book);
        } else {
          const ret: Return = {
            id: id + Math.floor(Math.random() * 1000),
            addDate: this.today,
            editDate: this.today,
            addWho: curUser.username,
            editWho: curUser.username,
            borrowId: borrow.id,
            returnDate: this.today,
            dueDate: borrow.dueDate,
            overdue: borrow.dueDate < this.today,
            fine: 0
          };
          this.returnService.return(ret, user, borrow, book);
        }
      }
    });
  }

  onSubmit() {
    if (!this.userCtrl.value || !this.bookCtrl.value) {
      return;
    }

    const dueDate = this.pipe.transform(Date.now() + 7 * 86400000, 'yyyy-MM-dd');
    const id = 'lms_bo_' + this.pipe.transform(Date.now(), 'yyyyMMddHHmmss');
    const user = this.AllUsers.find(x => x.id === this.userCtrl.value);
    const borrow: Borrow[] = [];
    const nBorrowed = user.borrowed + this.bookCtrl.value.length;
    const curUser: any = JSON.parse(localStorage.getItem('lms_emp'));

    if (nBorrowed > 5) {
      this.dialog.open(DialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        data: {
          title: 'Notices',
          content: 'Reach the (5) limit number of borrowed',
          theme: 'dialog-red'
        }
      });
      return;
    }

    this.bookCtrl.value.forEach((bookId: string) => {
      const book = this.AllBooks.find(x => x.id === bookId);
      borrow.push({
        id: id + Math.floor(Math.random() * 1000),
        addDate: this.today,
        editDate: this.today,
        borrowedDate: this.today.substring(0, 10),
        addWho: curUser.username,
        editWho: curUser.username,
        dueDate,
        book: { id: book.id, bookId: book.bookId, isbn: book.isbn, title: book.title },
        user: { id: user.id, memberId: user.memberId, fullName: user.fullName }
      });
    });

    this.borrowService.add(borrow, nBorrowed);
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to delete this book?',
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.borrowService.delete(id);
      }
    });
  }
}

function DaysBetween(StartDate: Date, EndDate: Date) {
  const oneDay = 1000 * 60 * 60 * 24;

  const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
  const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

  return (start - end) / oneDay;
}
