import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRecordDto {
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsNotEmpty()
  amount: number;
}
