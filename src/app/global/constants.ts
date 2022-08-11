export class BookStatus {
  public static Available: number = 0;
  public static Borrowed: number = 9;
  public static Expired: number = 8;
  public static Broken: number = 5;
}

export class MemberStatus {
  public static Activate: number = 9;
  public static Deactivate: number = 0;
  public static Frozen: number = 1;
  public static Expired: number = 2;
}

export class EmployeeStatus {
  public static Activate: number = 9;
  public static Deactivate: number = 0;
}
