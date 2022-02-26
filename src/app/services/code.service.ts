import { CodeDto } from './../models/code-dto';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  private dbPath = 'code';

  // Firestore data converter
  private converter = {
    toFirestore: (item: CodeDto) => {
      return {
        id: item.id,
        addDate: item.addDate,
        addWho: item.addWho,
        editDate: item.editDate,
        editWho: item.editWho,
        itemCode: item.itemCode,
        dictCode: item.dictCode,
        seqNo: item.seqNo,
        description:  item.description,
        value1: item.value1,
        value2: item.value2,
        value3: item.value3,
        value4: item.value4,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const item = snapshot.data(options);
        return new CodeDto(
          item.id,
          item.addDate,
          item.addWho,
          item.editDate,
          item.editWho,
          item.itemCode,
          item.dictCode,
          item.seqNo,
          item.description,
          item.value1,
          item.value2,
          item.value3,
          item.value4,
        );
    }
  };

  constructor(
    private firestore: Firestore,
    private commonService: CommonService,
    private httpClient: HttpClient
  ) { }

  get() {
    const myQuery = query(collection(this.firestore, this.dbPath), orderBy('dictCode'), orderBy('itemCode'), orderBy('seqNo'));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  getByCode(dictCode: string, itemCode: string) {
    const myQuery = query(collection(this.firestore, this.dbPath), where('dictCode', '==', dictCode), where('itemCode', '==', itemCode), orderBy('seqNo'));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  set(codeDto: CodeDto) {
    const date = moment();

    if (!codeDto.id) {
      codeDto.id = 'C900'
        + date.format('YYYYMMDDhhmmss')
        + codeDto.seqNo.toString().padStart(3, '0')
    }

    codeDto.addDate = codeDto.addDate || date.toDate();
    codeDto.addWho = codeDto.addWho || this.commonService.getCurrentUserName();
    codeDto.editDate = date.toDate();
    codeDto.editWho = this.commonService.getCurrentUserName();

    return setDoc(doc(this.firestore, this.dbPath, codeDto.id), Object.assign({}, codeDto));
  }

  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.dbPath, id));
  }

  getCountries() {
    return this.httpClient.get('https://restcountries.com/v3.1/all');
  }

  insertSampleCode() {
    this.set(new CodeDto('C90020211021180000000', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'fine', 'book', 1, 'Fine amount', '1.00', '', '', ''));
    this.set(new CodeDto('C90020211021180000001', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 2, 'Position level', 'Junior Executive', '', '', ''));
    this.set(new CodeDto('C90020211021180000002', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 3, 'Position level', 'Senior Executive', '', '', ''));
    this.set(new CodeDto('C90020211021180000003', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 1, 'Position level', 'Non Executive', '', '', ''));
    this.set(new CodeDto('C90020211021180000004', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 4, 'Position level', 'Manager', '', '', ''));
    this.set(new CodeDto('C90020211021180000005', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 5, 'Position level', 'Senior Manager', '', '', ''));
    this.set(new CodeDto('C90020211021180000006', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'level', 'staff_role', 6, 'Position level', 'Entry Level', '', '', ''));
    this.set(new CodeDto('C90020211021180000007', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'role', 'staff_role', 1, 'Position name', 'Librarian','', '', ''));
    this.set(new CodeDto('C90020211021180000008', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'role', 'staff_role', 2, 'Position name', 'Senior_Librarian', '', '', ''));
    this.set(new CodeDto('C90020211021180000009', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'role', 'staff_role', 3, 'Position name', 'Librarian_Assistant', '', '', ''));
    this.set(new CodeDto('C90020211021180000010', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'role', 'staff_role', 4, 'Position name', 'Administrator', '', '', ''));
    this.set(new CodeDto('C90020211021180000011', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'role', 'staff_role', 5, 'Position name', 'Senior_Administrator', '', '', ''));
    this.set(new CodeDto('C90020211021180000012', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'idType', 'staff_role', 1, 'Staff id type', 'IdCard', '', '', ''));
    this.set(new CodeDto('C90020211021180000013', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'idType', 'staff_role', 2, 'Staff id type', 'Passport', '', '', ''));
    this.set(new CodeDto('C90020211021180000014', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'staff_role', 1, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Activate', '9', 'primary', ''));
    this.set(new CodeDto('C90020211021180000015', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'staff_role', 2, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Deactivate', '0', 'warn', ''));

    this.set(new CodeDto('C90020211021180000016', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'language', 'book', 1, 'Book language', 'English', '', '', ''));
    this.set(new CodeDto('C90020211021180000017', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'language', 'book', 2, 'Book language', 'Simplified_Chinese', '', '', ''));
    this.set(new CodeDto('C90020211021180000018', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'language', 'book', 3, 'Book language', 'Traditional_Chinese', '', '', ''));
    this.set(new CodeDto('C90020211021180000019', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'language', 'book', 4, 'Book language', 'Malay', '', '', ''));
    this.set(new CodeDto('C90020211021180000020', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'language', 'book', 5, 'Book language', 'Other', '', '', ''));

    this.set(new CodeDto('C90020211021180000021', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 1, 'Book category', 'Action and Adventure', '', '', ''));
    this.set(new CodeDto('C90020211021180000022', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 2, 'Book category', 'Classics', '', '', ''));
    this.set(new CodeDto('C90020211021180000023', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 3, 'Book category', 'Comic Book', '', '', ''));
    this.set(new CodeDto('C90020211021180000024', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 4, 'Book category', 'Detective and Mystery', '', '', ''));
    this.set(new CodeDto('C90020211021180000025', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 5, 'Book category', 'Fantasy', '', '', ''));
    this.set(new CodeDto('C90020211021180000026', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 6, 'Book category', 'Historical Fiction', '', '', ''));
    this.set(new CodeDto('C90020211021180000027', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 7, 'Book category', 'Horror', '', '', ''));
    this.set(new CodeDto('C90020211021180000028', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 8, 'Book category', 'Literary Fiction', '', '', ''));
    this.set(new CodeDto('C90020211021180000029', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 9, 'Book category', 'Romance', '', '', ''));
    this.set(new CodeDto('C90020211021180000030', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 10, 'Book category', 'Science Fiction (Sci-Fi)', '', '', ''));
    this.set(new CodeDto('C90020211021180000031', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 11, 'Book category', 'Short Stories', '', '', ''));
    this.set(new CodeDto('C90020211021180000032', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 12, 'Book category', 'Suspense and Thrillers', '', '', ''));
    this.set(new CodeDto('C90020211021180000033', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 13, 'Book category', 'Women Fiction', '', '', ''));
    this.set(new CodeDto('C90020211021180000034', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 14, 'Book category', 'Biographies and Autobiographies', '', '', ''));
    this.set(new CodeDto('C90020211021180000035', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 15, 'Book category', 'Cookbooks', '', '', ''));
    this.set(new CodeDto('C90020211021180000036', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 16, 'Book category', 'Essays', '', '', ''));
    this.set(new CodeDto('C90020211021180000037', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 17, 'Book category', 'History', '', '', ''));
    this.set(new CodeDto('C90020211021180000038', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 18, 'Book category', 'Memoir', '', '', ''));
    this.set(new CodeDto('C90020211021180000039', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 19, 'Book category', 'Poetry', '', '', ''));
    this.set(new CodeDto('C90020211021180000040', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 20, 'Book category', 'Self-Help', '', '', ''));
    this.set(new CodeDto('C90020211021180000041', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 21, 'Book category', 'Poetry', '', '', ''));
    this.set(new CodeDto('C90020211021180000041', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 22, 'Book category', 'True Crime', '', '', ''));
    this.set(new CodeDto('C90020211021180000043', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'category', 'book', 23, 'Book category', 'Technology', '', '', ''));

    this.set(new CodeDto('C90020211021180000044', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'book', 24, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Available', '0', 'primary', ''));
    this.set(new CodeDto('C90020211021180000045', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'book', 25, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Borrowed', '9', 'warn', ''));
    this.set(new CodeDto('C90020211021180000046', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'book', 26, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Broken', '5', 'accent', ''));

    this.set(new CodeDto('C90020211021180000047', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'privileges', 'member', 1, 'Value1: Level, Value2: Max number items to borrowed, Value3: Loan period (days)', 'Undergraduate_Student', '15', '14', ''));
    this.set(new CodeDto('C90020211021180000048', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'privileges', 'member', 2, 'Value1: Level, Value2: Max number items to borrowed, Value3: Loan period (days)', 'Graduate_Student', '30', '30', ''));
    this.set(new CodeDto('C90020211021180000049', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'privileges', 'member', 3, 'Value1: Level, Value2: Max number items to borrowed, Value3: Loan period (days)', 'Staff_Member', '30', '30', ''));
    this.set(new CodeDto('C90020211021180000050', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'privileges', 'member', 4, 'Value1: Level, Value2: Max number items to borrowed, Value3: Loan period (days)', 'Alumni_Member', '5', '14', ''));

    this.set(new CodeDto('C90020211021180000051', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'member', 1, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Activate', '9', 'primary', ''));
    this.set(new CodeDto('C90020211021180000052', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'member', 2, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Deactivate', '0', 'warn', ''));
    this.set(new CodeDto('C90020211021180000053', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'member', 3, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Frozen', '1', 'accent', ''));
    this.set(new CodeDto('C90020211021180000054', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'status', 'member', 4, 'Value1: Status Text, Value2: Status Code, Value3: Chip Color', 'Expired', '2', 'accent', ''));
    this.set(new CodeDto('C90020211021180000055', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'idType', 'member', 1, 'Member id type', 'IdCard', '', '', ''));
    this.set(new CodeDto('C90020211021180000056', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'idType', 'member', 2, 'Member id type', 'Passport', '', '', ''));

    this.set(new CodeDto('C90020211021180000057', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'gender', 'general', 1, 'Value1: Gender, Value2: Gender Code', 'Male', '1', '', ''));
    this.set(new CodeDto('C90020211021180000058', new Date('2021-10-21 18:00:00'), 'Administrator', new Date('2021-10-21 18:00:00'), 'Administrator', 'gender', 'general', 2, 'Value1: Gender, Value2: Gender Code', 'Female', '0', '', ''));
  }
}
