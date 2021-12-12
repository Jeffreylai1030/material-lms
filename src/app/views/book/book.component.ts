import { DialogComponent } from './../layout/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  DynamicDatePickerModel,
  DynamicFormModel,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import { CodeService } from 'src/app/services/code.service';
import { FormComponent } from '../layout/form/form.component';
import { BookDto } from 'src/app/models/book-dto';
import { BookService } from 'src/app/services/book.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

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
  title = '';
  languageOption: any;
  categoriesOption: any;
  tagsOption: any;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private bookService: BookService,
    private codeService: CodeService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
  ) {}

  ngOnInit() {
    this.bookService.get().subscribe((item) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(item);
    });

    this.codeService.getByCode('book', 'language').subscribe((item) => {
      this.languageOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
    this.codeService.getByCode('book', 'category').subscribe((item) => {
      this.categoriesOption = item.map(x => ({ label: x.value1, value: x.value1 }));
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(bookDto: BookDto = new BookDto()) {
    const formModel: DynamicFormModel = [
      new DynamicInputModel({
        id: 'id',
        label: 'id',
        value: bookDto.id,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addDate',
        label: 'addDate',
        value: bookDto.addDate,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addWho',
        label: 'addWho',
        value: bookDto.addWho,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'title',
        label: 'Title',
        value: bookDto.title,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'title2',
        label: 'Title 2',
        value: bookDto.title2,
      }),
      new DynamicInputModel({
        id: 'isbn',
        label: 'ISBN',
        value: bookDto.isbn,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'pageCount',
        label: 'Page Count',
        inputType: 'number',
        value: bookDto.pageCount,
      }),
      new DynamicDatePickerModel({
        id: 'publishedDate',
        label: 'Publication Date',
        inline: false,
        value: bookDto.publishedDate?.toDate(),
        placeholder: 'Date of Published',
        // min: '1900-01-01',
        max: new Date()
      }),
      new DynamicInputModel({
        id: 'publisher',
        label: 'Publisher',
        value: bookDto.publisher,
      }),
      new DynamicInputModel({
        id: 'thumbnailUrl',
        label: 'Thumbnail Url',
        value: bookDto.thumbnailUrl,
      }),
      new DynamicInputModel({
        id: 'authors',
        placeholder: 'Authors',
        multiple: true,
        value: bookDto.authors,
      }),
      new DynamicSelectModel({
        id: 'language',
        label: 'Language',
        value: bookDto.language,
        options: this.languageOption,
      }),
      new DynamicRadioGroupModel<string>({
        id: 'status',
        legend: "Status",
        value: bookDto.status,
        options: [
          {
            label: 'Available',
            value: '0'
          },
          {
            label: 'Borrowed',
            value: '9'
          },
          {
            label: 'Broken',
            value: '5'
          }
        ]
      }),
      new DynamicSelectModel({
        id: 'categories',
        label: 'Categories',
        value: bookDto.categories,
        options: this.categoriesOption,
      }),
      new DynamicInputModel({
        id: 'tags',
        label: 'tags',
        placeholder: 'Tags',
        value: bookDto.tags,
        multiple: true,
      }),
    ];

    this.title = bookDto.title ? 'Update Book Information' : 'New Book Information';

    const dialogRef = this.dialog.open(FormComponent, {
      width: '450px',
      panelClass: 'confirm-dialog-container',
      data: { title: this.title, formModel }
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
    this.bookService.set(book);
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
        this.bookService.delete(id);
      }
    });
  }

  insertSampleBooks() {
    this.bookService.insertSampleBooks();
  }
}
