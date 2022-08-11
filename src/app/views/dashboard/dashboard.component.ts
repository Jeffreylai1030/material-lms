import { ReturnDto } from './../../models/return-dto';
import { ReturnService } from './../../services/return.service';
import { TranslateService } from '@ngx-translate/core';
import { BorrowDto } from 'src/app/models/borrow-dto';
import { BorrowService } from 'src/app/services/borrow.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private borrowService: BorrowService,
    private returnService: ReturnService,
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;

  today = new Date();
  chartTitle = '7';
  thisWeekBorrowNumber = 0;
  totalNotReturnNumber = 0;
  totalTodayBorrowsNumber = 0;
  totalBorrowsExpiredNumber = 0;
  borrows: BorrowDto[] = [];
  returnBooks: ReturnDto[] = [];
  chartOption: EChartsOption = {};
  displayedColumns = ['date', 'number'];
  selectedTab = 'lastWeek';
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  ngOnInit() {
    // Add extend function for dayjs
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);
    this.thisWeekBorrowNumber = 0;

    this.borrowService.get().subscribe(borrowDto => {
      this.borrows = borrowDto;
      this.totalNotReturnNumber = borrowDto.length;
      this.totalBorrowsExpiredNumber = borrowDto.filter(x => dayjs().isAfter(dayjs(x.dueDate.toDate()))).length;
      this.onTabChange('lastWeek');
    })

    this.dashboardService.getTodayBorrowsNumber().subscribe(item => {
      this.totalTodayBorrowsNumber = item;
    })

    this.dashboardService.getWeekBorrowsNumber().subscribe(item => {
      this.thisWeekBorrowNumber = item;
    })

    this.returnService.getByBorrowedDateRange(dayjs().subtract(6, 'days').toDate(), new Date()).subscribe(returnDto => {
      this.returnBooks = returnDto;
      this.onTabChange('lastWeek');
    })
  }

  getByBorrowedDateRange(startDate: Date, endDate: Date) {
    this.borrowService.getByBorrowedDateRange(startDate, endDate).subscribe(item => {
      this.borrows = item;
      this.generateLineChart(startDate, endDate);
    })
  }

  // Trigger when change the tab for date range reports
  onTabChange(value: string) {
    const endDate = new Date();

    if (value === 'lastWeek') {
      this.chartTitle = '7';
      const startDate = dayjs().subtract(6, 'days').toDate();
      this.generateLineChart(startDate, endDate);
    } else if (value === 'lastMonth') {
      this.chartTitle = '30';
      const startDate = dayjs().subtract(29, 'days').toDate();
      this.generateLineChart(startDate, endDate);
    }
  }

  onChartChange() {
    const startDate = this.dateRange.value.start;
    const endDate = this.dateRange.value.end;
    this.selectedTab = '';
    this.chartTitle = `${dayjs(startDate).format('MMM DD, YYYY')} ~ ${dayjs(endDate).format('MMM DD, YYYY')}`;
    this.getByBorrowedDateRange(startDate, endDate);
  }

  generateLineChart(startDate: Date, endDate: Date) {
    let data: any = [];
    let xAxis: string[] = [];
    let yAxis: number[] = [];
    let count = 0;

    while (startDate <= endDate) {
      const pastDate = dayjs(startDate).format('YYYY-MM-DD');
      let pastData = this.borrows.filter(x => dayjs(x.borrowedDate.toDate()).format('YYYY-MM-DD') === pastDate).length;
      pastData += this.returnBooks.filter(x => dayjs(x.borrowedDate.toDate()).format('YYYY-MM-DD') === pastDate).length;

      xAxis.push(pastDate);
      yAxis.push(pastData);
      data.push({ date: pastDate, number: pastData });
      count++;
      startDate.setDate(startDate.getDate() + 1);
    }

    // Restore the original startDate, else it will change the date range
    startDate.setDate(startDate.getDate() - count);

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.translate.get('dashboard.book').subscribe(result => {
      this.chartOption = {
        legend: {
          data: [result]
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: xAxis, // Past 7 days Date
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: result,
            data: yAxis, // Number of books
            type: 'line',
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' },
                ]),
              }
            },
          },
        ],
      };
    })
  }
}
