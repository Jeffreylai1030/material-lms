export class MemberDto {
  id: string;
  addDate: any;
  addWho: string;
  editDate: any;
  editWho: string;
  address: string;
  contactNo: string;
  email: string;
  fullName: string;
  gender: string;
  borrowed: number;
  totalBorrowed: number;
  status: string;
  effDate: any;
  expDate: any;
  privilege: string;
  idNumber: string;
  idType: string;
  issueCountry: string;

  constructor (
    id: string = '',
    addDate: any = null,
    addWho: string = '',
    editDate: any = null,
    editWho: string = '',
    address: string = '',
    contactNo: string = '',
    email: string = '',
    fullName: string = '',
    gender: string = '',
    borrowed: number = 0,
    totalBorrowed: number = 0,
    status: string = 'Activate',
    effDate: any = null,
    expDate: any = null,
    privilege: string = '',
    idNumber: string = '',
    idType: string = '',
    issueCountry: string = '',
    ) {
    this.id = id;
    this.addDate = addDate;
    this.addWho = addWho || 'Test User';
    this.editDate = editDate;
    this.editWho = editWho || 'Test User';
    this.address = address;
    this.contactNo = contactNo;
    this.email = email;
    this.fullName = fullName;
    this.gender = gender;
    this.borrowed = borrowed;
    this.totalBorrowed = totalBorrowed;
    this.status = status;
    this.effDate = effDate;
    this.expDate = expDate;
    this.privilege = privilege;
    this.idNumber = idNumber;
    this.idType = idType;
    this.issueCountry = issueCountry;
  }
}
