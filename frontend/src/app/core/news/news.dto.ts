export interface NewsDto {
  id: number;
  title: string;
  short: string;
  text: string;
  admin: boolean;
  important: boolean;
  createdDate: Date;
}
