import { MemberDto } from './../models/member-dto';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private dbPath = 'members';

  // Firestore data converter
  private converter = {
    toFirestore: (item: MemberDto) => {
      return {
        id: item.id,
        addDate: item.addDate,
        addWho: item.addWho,
        editDate: item.editDate,
        editWho: item.editWho,
        address: item.address,
        contactNo: item.contactNo,
        email: item.email,
        fullName: item.fullName,
        gender: item.gender,
        borrowed: item.borrowed,
        totalBorrowed: item .totalBorrowed,
        status: item.status,
        effDate: item.effDate,
        expDate: item.expDate,
        privilege: item.privilege,
        idNumber: item.idNumber,
        idType: item.idType,
        issueCountry: item.issueCountry,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const item = snapshot.data(options);
        return new MemberDto(
          item.id,
          item.addDate,
          item.addWho,
          item.editDate,
          item.editWho,
          item.address,
          item.contactNo,
          item.email,
          item.fullName,
          item.gender,
          item.borrowed,
          item.totalBorrowed,
          item.status,
          item.effDate,
          item.expDate,
          item.privilege,
          item.idNumber,
          item.idType,
          item.issueCountry,
        );
    }
  };

  constructor(private firestore: Firestore) { }

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(this.converter);
    return collectionData(data);
  }

  getByStatus(status: string) {
    const myQuery = query(collection(this.firestore, this.dbPath), where('status', '==', status));
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  set(memberDto: MemberDto) {
    const date = new Date();

    if (!memberDto.id) {
      memberDto.id = 'M200'
        + date.getFullYear().toString()
        + (date.getMonth() + 1).toString().padStart(2, '0')
        + date.getDate().toString().padStart(2, '0')
        + date.getHours().toString().padStart(2, '0')
        + date.getMinutes().toString().padStart(2, '0')
        + date.getSeconds().toString().padStart(2, '0')
        + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    }

    if (!memberDto.addDate) {
      memberDto.addDate = date;
    }

    memberDto.editDate = date;

    return setDoc(doc(this.firestore, this.dbPath, memberDto.id), Object.assign({}, memberDto));
  }

  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.dbPath, id));
  }

  insertSampleMembers() {
    const effDate = new Date('2021-10-21');
    const expDate = new Date('2022-10-20');

    for (let i = 0; i < 20; i++) {
      let gender = i % 2 === 0 ? 'Female' : 'Male';
      this.set(new MemberDto('M20020211021180000' + i.toString().padStart(3, '0'), effDate, 'Administrator', effDate, 'Administrator', 'No ' + (i + 1).toString() + ', Jalan ABC, 25100, Kuantan, Pahang', '012-34567' + i.toString().padStart(2, '0'), 'test.email.' + i + '@hotmail.com', 'Test User ' + i, gender, 0, 0, '9', effDate, expDate, 'Undergraduate Student', '951010-10-100' + i, 'IdCard', 'Malaysia'));
    }
  }

}
