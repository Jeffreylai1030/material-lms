import { CodeDto } from './../../models/code-dto';
import { CodeService } from './../../services/code.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicFormModel, DynamicInputModel } from '@ng-dynamic-forms/core';
import { DialogComponent } from '../layout/dialog/dialog.component';
import { FormComponent } from '../layout/form/form.component';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer) {}

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
    const formModel: DynamicFormModel = [
      new DynamicInputModel({
        id: 'id',
        label: 'id',
        value: codeDto.id,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addDate',
        label: 'addDate',
        value: codeDto.addDate,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'addWho',
        label: 'addWho',
        value: codeDto.addWho,
        hidden: true
      }),
      new DynamicInputModel({
        id: 'dictCode',
        label: 'Dict Code',
        value: codeDto.dictCode,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'itemCode',
        label: 'Item Code',
        value: codeDto.itemCode,
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'seqNo',
        label: 'Sequence No',
        value: codeDto.seqNo,
        inputType: 'number',
        validators: {
          required: null
        },
        errorMessages: {
          required: '{{ label }} is required'
        }
      }),
      new DynamicInputModel({
        id: 'description',
        placeholder: 'Description',
        value: codeDto.description
      }),
      new DynamicInputModel({
        id: 'value1',
        placeholder: 'Value 1',
        value: codeDto.value1
      }),
      new DynamicInputModel({
        id: 'value2',
        label: 'Value 2',
        value: codeDto.value2
      }),
      new DynamicInputModel({
        id: 'value3',
        label: 'Value 3',
        value: codeDto.value3
      }),
      new DynamicInputModel({
        id: 'value4',
        label: 'Value 4',
        value: codeDto.value4
      })
    ];

    this.title = codeDto.dictCode ? 'Update Code Information' : 'New Code Information';

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

  onSubmit(code: CodeDto) {
    // const curUser: any = JSON.parse(localStorage.getItem('lms_emp'));

    const codeDto = new CodeDto(code.id, code.addDate, '', code.editDate, '', code.itemCode, code.dictCode, code.seqNo, code.description, code.value1, code.value2, code.value3, code.value4);

    this.codeService.set(codeDto);
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
        this.codeService.delete(id);
      }
    });
  }

  insertSampleCode() {
    this.codeService.insertSampleCode();
  }

}
