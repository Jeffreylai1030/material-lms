import { CodeDto } from './../../models/code-dto';
import { CodeService } from 'src/app/services/code.service';
import { BookFormComponent } from './book-form/book-form.component';
import { DialogComponent } from './../layout/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookDto } from 'src/app/models/book-dto';
import { BookService } from 'src/app/services/book.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  displayedColumns = [
    'title',
    'author',
    'isbn',
    'language',
    'pageCount',
    'publishedDate',
    'publisher',
    'status',
    'action'
  ];
  dataSource!: MatTableDataSource<BookDto>;
  numberLimit = 3;
  bookId = '';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  statusCode: CodeDto[] = [];
  searchText = '';

  constructor(
    private bookService: BookService,
    private codeService: CodeService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.bookService.get().subscribe((item) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.codeService.getByCode('book', 'status').subscribe((item) => {
      this.statusCode = item;
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(bookDto: BookDto = new BookDto()) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px',
      data: bookDto,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onShow(data: string[]) {
    const item = data.map(x => {
      return { data: x, icon: 'person_outline' };
    });

    this.dialog.open(DialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Authors', theme: 'dialog-blue', displayArray: item }
    });
  }

  onShowAllData(book: BookDto) {
    const addDate = new Date(book.addDate.seconds * 1000);
    const editDate = new Date(book.editDate.seconds * 1000);
    const publishedDate = new Date(book.publishedDate.seconds * 1000);

    const html = `<table style="width:100%">
                    <tr><td style="width: 6rem"><b>Title</b></td><td>${book.title}</td></tr>
                    <tr><td><b>Title 2</b></td><td>${book.title2 || '-'}</td></tr>
                    <tr><td><b>ISBN</b></td><td>${book.isbn}</td></tr>
                    <tr><td><b>Pub.Date</b></td><td>${this.datepipe.transform(publishedDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>AddDate</b></td><td>${this.datepipe.transform(addDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>AddWho</b></td><td>${book.addWho}</td></tr>
                    <tr><td><b>EditDate</b></td><td>${this.datepipe.transform(editDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>EditWho</b></td><td>${book.editWho}</td></tr>
                  </table>`;

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.dialog.open(DialogComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Details', html: safeHtml, theme: 'dialog-blue' }
    });
  }

  onSubmit(book: BookDto) {
    this.bookService.set(book).then(result =>
      this.translate.get(['snackbar.update_success', 'snackbar.close']).subscribe((message: any) => {
        this.snackBar.open(message['snackbar.update_success'], message['snackbar.close'], {
          duration: 1500
        })
      })
    );
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
        this.bookService.delete(id).then(result =>
          this.translate.get(['snackbar.delete_success', 'snackbar.close']).subscribe((message: any) => {
            this.snackBar.open(message['snackbar.delete_success'], message['snackbar.close'], {
              duration: 1500
            })
          })
        );
      }
    });
  }

  getStatusChipColor(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value3;
  }

  getStatusText(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value1;
  }

  insertSampleBooks() {
    this.bookService.insertSampleBooks();
  }
}
