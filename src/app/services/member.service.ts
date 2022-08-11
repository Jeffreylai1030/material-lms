import { MemberDto } from './../models/member-dto';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { CommonService } from './common.service';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
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
        totalBorrowed: item.totalBorrowed,
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
        item.issueCountry
      );
    },
  };

  constructor(
    private firestore: Firestore,
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(
      this.converter
    );
    return collectionData(data);
  }

  getByStatus(status: number) {
    const myQuery = query(
      collection(this.firestore, this.dbPath),
      where('status', '==', status.toString())
    );
    const data = myQuery.withConverter(this.converter);
    return collectionData(data);
  }

  set(memberDto: MemberDto) {
    const date = dayjs();

    if (!memberDto.id) {
      memberDto.id =
        'M200' +
        date.format('YYYYMMDDHHmmss') +
        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }

    memberDto.email = memberDto?.email?.toLowerCase();
    memberDto.addDate = memberDto.addDate || date.toDate();
    memberDto.addWho = memberDto.addWho || this.commonService.getCurrentUserName();
    memberDto.editDate = date.toDate();
    memberDto.editWho = this.commonService.getCurrentUserName();

    return setDoc(doc(this.firestore, this.dbPath, memberDto.id), Object.assign({}, memberDto));
  }

  delete(id: string) {
    return deleteDoc(doc(this.firestore, this.dbPath, id));
  }

  insertSampleMembers(number = 20) {
    this.httpClient.get(`https://randomuser.me/api?results=${number}`).subscribe((result: any) => {
      const results = result.results;
      let count = 0;

      for (const data of results) {
        const id = 'M20020211021180000' + count.toString().padStart(3, '0');
        const effDate = new Date('2021-10-21');
        const expDate = new Date('2022-10-20');
        const username = 'Administrator';
        const ic = `${dayjs(data.dob.date).format('YYMMDD')}-01-${count.toString().padStart(4, '0')}`;
        const address = `${data.location.street.number}, ${data.location.street.name}, ${data.location.street.name}, ${data.location.postcode}, ${data.location.city}, ${data.location.state}`
        const addDate = dayjs(data.registered.date).toDate();
        const fullName = `${data.name.first} ${data.name.last}`;
        const privileges = 'Undergraduate_Student';
        const gender = data.gender[0].toUpperCase() + data.gender.slice(1);

        const memberDto = new MemberDto(
          id,
          addDate,
          username,
          addDate,
          username,
          address,
          data.phone,
          data.email,
          fullName,
          gender,
          0,
          0,
          '9',
          effDate,
          expDate,
          privileges,
          ic,
          'IdCard',
          data.location.country
        );

        this.set(memberDto);
        count++;
      }

    })
  }
}
