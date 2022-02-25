import { MemberService } from 'src/app/services/member.service';
import { CodeDto } from 'src/app/models/code-dto';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent implements OnInit {
  displayedColumns = [
    'bookId',
    'bookTitle1',
    'memberId',
    'borrowedDate',
    'dueDate',
    'overdue',
    'action'
  ];
  dataSource!: MatTableDataSource<BorrowDto>;
  today = new Date();
  selectedTab = 'borrowed'
  filterMembersCtrl = new FormControl();
  filterBooksCtrl = new FormControl();
  memberCtrl = new FormControl();
  bookCtrl = new FormControl();
  finePerDay: number = 0;
  books: BookDto[] = [];
  Allbooks: BookDto[] = [];
  filteredBooks: BookDto[] = [];
  members: MemberDto[] = []
  filteredMembers: MemberDto[] = []
  borrows: BorrowDto[] = []
  borrowsHistory: BorrowDto[] = [];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private borrowService: BorrowService,
    public bookService: BookService,
    public memberService: MemberService,
    public codeService: CodeService,
    public dialog: MatDialog,
    public translate: TranslateService,
    ) {}

  ngOnInit() {
    this.borrowService.getByStatus('0').subscribe((item: BorrowDto[]) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.borrows = item;
    });

    this.borrowService.getByStatus('9').subscribe((item: BorrowDto[]) => {
      this.borrowsHistory = item;
    });

    // Get available books
    this.bookService.get().subscribe((item: BookDto[]) => {
      this.books = item.filter(x => x.status === '0');
      this.Allbooks = item;
      this.filteredBooks = this.books;
    });

    // Get active members
    this.memberService.getByStatus('9').subscribe((item: MemberDto[]) => {
      this.members = item;
      this.filteredMembers = item;
    });

    this.codeService.getByCode('book', 'fine').subscribe((item: CodeDto[]) => {
      this.finePerDay = parseFloat(item[0]?.value1);
    });

    this.filterMembersCtrl.valueChanges.pipe().subscribe(() => {
      const search = this.filterMembersCtrl.value?.toLowerCase();
      this.filteredMembers = this.members.filter((item: MemberDto) => item.id.toLowerCase().indexOf(search) > -1 || item.fullName.toLowerCase().indexOf(search) > -1);
    });

    this.filterBooksCtrl.valueChanges.pipe().subscribe(() => {
      const search = this.filterBooksCtrl.value?.toLowerCase();
      this.filteredBooks = this.books.filter((item: BookDto) => item.id.toLowerCase().indexOf(search) > -1 || item.title.toLowerCase().indexOf(search) > -1);
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onShowBook(borrow: BorrowDto) {
    console.log(borrow);
  }

  onReturn(borrowDto: BorrowDto) {
    const dueDate = new Date(borrowDto.dueDate.toDate());
    const diffDay = DaysBetween(dueDate, new Date());
    const fine = this.finePerDay * diffDay;
    const content = diffDay < 0 ? `Return this book?` : `Return this book? The fine is RM ${fine.toFixed(2)}.`;

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
        borrowDto.fine = fine;
        borrowDto.returnedDate = new Date();
        borrowDto.status = '9';
        borrowDto.overdue = borrowDto.dueDate.toDate() <= this.today
        const member = this.members.find((x: MemberDto) => x.id === borrowDto.memberId);
        const book = this.Allbooks.find(x => x.id === borrowDto.bookId);

        if (book && member) {
          this.borrowService.returnBook(borrowDto, book, member);
        }
      }
    });
  }

  onBorrow() {
    if (!this.memberCtrl.value || !this.bookCtrl.value) {
      return;
    }

    this.codeService.getByCode('member', 'privileges').subscribe((item: CodeDto[]) => {
      const member = this.members.find((x: MemberDto) => x.id === this.memberCtrl.value);
      const memberPrivileges = item.find(x => x.value1 === member?.privilege);
      const totalBorrowed = member?.borrowed + this.bookCtrl.value.length;
      const dueDate = new Date(Date.now() + parseInt(memberPrivileges?.value3 ?? '0') * 86400000);

      if (totalBorrowed > parseInt(memberPrivileges?.value2 ?? '0')) {
        this.dialog.open(DialogComponent, {
          width: '350px',
          panelClass: 'confirm-dialog-container',
          data: {
            title: 'Notices',
            content: `Reach the ${memberPrivileges?.value2} limit number of borrowed`,
            theme: 'dialog-red'
          }
        });
        return;
      }

      this.bookCtrl.value.forEach((bookId: string) => {
        const book = this.books.find(x => x.id === bookId);
        const borrowDto = new BorrowDto(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          new Date(),
          dueDate,
          null,
          0,
          '0',
          false,
          member?.id,
          member?.fullName,
          book?.id,
          book?.title);

        if (book && member) {
          this.borrowService.borrowBook(borrowDto, book, member);
          this.bookCtrl.reset();
          this.memberCtrl.reset();
        }

      });
    });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to delete this borrow instead of return?',
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

  onTabChange(value: string) {
    if (value === 'history') {
      this.dataSource = new MatTableDataSource(this.borrowsHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource(this.borrows);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}

function DaysBetween(StartDate: Date, EndDate: Date) {
  const oneDay = 1000 * 60 * 60 * 24;

  const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
  const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

  return (start - end) / oneDay;
}
