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
import * as moment from 'moment';

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
    const totalFine = CalculateFine(dueDate, this.finePerDay);

    this.translate.get(['borrow.confirmation', 'borrow.returnContent'], { value: totalFine.toFixed(2) }).subscribe((message: any) => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        data: {
          title: message['borrow.confirmation'],
          content: message['borrow.returnContent'],
          btnType: 'form',
          theme: 'dialog-red'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          borrowDto.fine = totalFine;
          borrowDto.returnedDate = new Date();
          borrowDto.status = '9';
          borrowDto.overdue = totalFine > 0
          const member = this.members.find((x: MemberDto) => x.id === borrowDto.memberId);
          const book = this.Allbooks.find(x => x.id === borrowDto.bookId);

          if (book && member) {
            this.borrowService.returnBook(borrowDto, book, member);
          }
        }
      });
    })
  }

  onBorrow() {
    if (!this.memberCtrl.value || !this.bookCtrl.value) {
      return;
    }

    this.codeService.getByCode('member', 'privileges').subscribe((item: CodeDto[]) => {
      const member = this.members.find((x: MemberDto) => x.id === this.memberCtrl.value);
      const privilege = item.find(x => x.value1 === member?.privilege);
      const maxCanBorrowed = parseInt(privilege?.value2 || '0');
      const daysCanBorrowed = parseInt(privilege?.value3 || '0');
      const totalBorrowed = member?.borrowed + this.bookCtrl.value.length;
      const dueDate = moment().add(daysCanBorrowed, 'days').toDate();

      if (totalBorrowed > maxCanBorrowed) {
        this.translate.get(['borrow.confirmation', 'borrow.reach_max_borrow'], { value: maxCanBorrowed }).subscribe((message: any) => {
          this.dialog.open(DialogComponent, {
            width: '350px',
            panelClass: 'confirm-dialog-container',
            data: {
              title: message['borrow.confirmation'],
              content: message['borrow.reach_max_borrow'],
              theme: 'dialog-red'
            }
          });
        })
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
        }
      });

      this.bookCtrl.reset();
      this.memberCtrl.reset();
    });
  }

  onDelete(id: string) {
    this.translate.get(['borrow.confirmation', 'borrow.delete_message']).subscribe((message: any) => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        data: {
          title: message['borrow.confirmation'],
          content: message['borrow.delete_message'],
          btnType: 'form',
          theme: 'dialog-red'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.borrowService.delete(id);
        }
      });
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

function CalculateFine(dueDate: Date, finePerDay: number) {
  const due_Date = moment(dueDate);
  const date = moment();

  const days = date.diff(due_Date, 'days');

  return (days >= 0 ? days : 0) * finePerDay;
}
