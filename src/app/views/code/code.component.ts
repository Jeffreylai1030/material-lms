import { CodeFormComponent } from './code-form/code-form.component';
import { CodeDto } from './../../models/code-dto';
import { CodeService } from './../../services/code.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../layout/dialog/dialog.component';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  codeList: CodeDto[] = [];
  displayedColumns = ['dictCode', 'itemCode', 'value1', 'value2', 'value3', 'value4', 'seqNo', 'action'];
  dataSource!: MatTableDataSource<CodeDto>;
  title = '';

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private codeService: CodeService,
    private dialog: MatDialog,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.codeService.get().subscribe((item) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(codeDto: CodeDto = new CodeDto()) {
    const dialogRef = this.dialog.open(CodeFormComponent, {
      width: '450px',
      data: codeDto,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onShow(data: string[]) {
    const item = data.map(x => {
      return { data: x, icon: 'keyboard_arrow_right' };
    });

    this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Authors', theme: 'dialog-blue', displayArray: item }
    });
  }

  onShowAllData(code: CodeDto) {
    const addDate = new Date(code.addDate.seconds * 1000);
    const editDate = new Date(code.editDate.seconds * 1000);

    const html = `<table style="width:100%">
                  <tr><td style="width: 6rem"><b>ID</b></td><td>${code.id}</td></tr>
                  <tr><td><b>AddDate</b></td><td>${this.datepipe.transform(addDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                  <tr><td><b>AddWho</b></td><td>${code.addWho}</td></tr>
                  <tr><td><b>EditDate</b></td><td>${this.datepipe.transform(editDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                  <tr><td><b>EditWho</b></td><td>${code.editWho}</td></tr>
                  <tr><td><b>Description</b></td><td>${code.description}</td></tr>
                  </table>`;
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.dialog.open(DialogComponent, {
      width: '400px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Details', html: safeHtml, theme: 'dialog-blue' }
    });
  }

  onSubmit(codeDto: CodeDto) {
    this.codeService.set(codeDto).then(result =>
      this.snackBar.open('Update successful', 'Close')
    );
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to delete this employee?',
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.codeService.delete(id).then(result =>
          this.snackBar.open('Delete successful', 'Close')
        );
      }
    });
  }

  insertSampleCode() {
    this.codeService.insertSampleCode();
  }

}
