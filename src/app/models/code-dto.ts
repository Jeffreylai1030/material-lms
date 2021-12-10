export class CodeDto {
  id: string;
  addDate: any;
  addWho: string;
  editDate: any;
  editWho: string;
  itemCode: string;
  dictCode: string;
  seqNo: number;
  description?: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;

  constructor (
    id: string = '',
    addDate: any = null,
    addWho: string = 'Test User',
    editDate: any = null,
    editWho: string = 'Test User',
    itemCode: string = '',
    dictCode: string = '',
    seqNo: number = 0,
    description: string = '',
    value1: string = '',
    value2: string = '',
    value3: string = '',
    value4: string = '',
    ) {
    this.id = id;
    this.addDate = addDate;
    this.addWho = addWho || 'Test User';
    this.editDate = editDate;
    this.editWho = editWho || 'Test User';
    this.itemCode = itemCode;
    this.dictCode = dictCode;
    this.seqNo = seqNo;
    this.description = description;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

}
