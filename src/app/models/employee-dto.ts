export class EmployeeDto {
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
  idNumber: string;
  idType: string;
  downloadURL: string;
  imageKitURL: string;
  profileImage: any;
  role: string;
  salary: number;
  status: string;
  username: string;
  password: string;
  loginProfile: boolean;

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
    idNumber: string = '',
    idType: string = '',
    downloadURL: string = '',
    imageKitURL: string = '',
    profileImage: any = null,
    role: string = '',
    salary: number = 0,
    status: string = '9',
    username: string = '',
    password: string = '',
    loginProfile: boolean = false,
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
    this.idNumber = idNumber;
    this.idType = idType;
    this.downloadURL = downloadURL;
    this.imageKitURL = imageKitURL;
    this.profileImage = profileImage;
    this.role = role;
    this.salary = salary;
    this.status = status;
    this.username = username;
    this.password = password;
    this.loginProfile = loginProfile;
  }
}
