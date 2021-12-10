import { EmployeeDto } from './../models/employee-dto';
import { Injectable } from '@angular/core';
import { Storage, uploadBytesResumable, ref, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private dbPath = 'employees';
  private profilePath = 'profiles';

  // Firestore data converter
  private converter = {
    toFirestore: (item: EmployeeDto) => {
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
        idNumber: item.idNumber,
        idType: item.idType,
        downloadURL: item.downloadURL,
        profileImage: item.profileImage,
        role: item.role,
        salary: item.salary,
        status: item.status,
        username: item.username,
        password: item.password,
        loginProfile: item.loginProfile,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const item = snapshot.data(options);
        return new EmployeeDto(
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
          item.idNumber,
          item.idType,
          item.downloadURL,
          item.profileImage,
          item.role,
          item.salary,
          item.status,
          item.username,
          item.password,
          item.loginProfile,
        );
    }
  };

  constructor(private firestore: Firestore, private storage: Storage) { }

  get() {
    const data = collection(this.firestore, this.dbPath).withConverter(this.converter);
    return collectionData(data);
  }

  getByEmail(email: string) {
    const data = query(
      collection(this.firestore, this.dbPath),
      where('email', '==', email),
      limit(1))
      .withConverter(this.converter);

    return collectionData(data);
  }

  set(employeeDto: EmployeeDto) {
    const date = new Date();

    if (!employeeDto.id) {
      employeeDto.id = 'E100'
        + date.getFullYear().toString()
        + (date.getMonth() + 1).toString().padStart(2, '0')
        + date.getDate().toString().padStart(2, '0')
        + date.getHours().toString().padStart(2, '0')
        + date.getMinutes().toString().padStart(2, '0')
        + date.getSeconds().toString().padStart(2, '0')
    }

    if (!employeeDto.addDate) {
      employeeDto.addDate = date;
    }

    if (!employeeDto.status) {
      employeeDto.status = '9';
    }

    employeeDto.editDate = date;

    if (!employeeDto.loginProfile) {
      employeeDto.loginProfile = false
    }

    if (employeeDto.email) {
      employeeDto.email = employeeDto.email.toLowerCase()
    }

    setDoc(doc(this.firestore, this.dbPath, employeeDto.id), Object.assign({}, employeeDto));

  }

  uploadProfilePicture(employeeDto: EmployeeDto) {

    const storageRef = ref(this.storage, this.profilePath + '/' + employeeDto.id);

    const metadata = {
      contentType: 'image/jpeg'
    };

    const uploadTask = uploadBytesResumable(storageRef, employeeDto.profileImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        alert(error.message);
      }, () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          employeeDto.downloadURL = downloadURL;
          employeeDto.profileImage = `${this.profilePath}/${employeeDto.id}`;
          this.set(employeeDto);
        });
      }
    );
  }

  delete(employeeDto: EmployeeDto) {
    if (employeeDto.id) {
      deleteDoc(doc(this.firestore, this.dbPath, employeeDto.id));
      const desertRef = ref(this.storage, employeeDto.profileImage);
    }
  }

}
