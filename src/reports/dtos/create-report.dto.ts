import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDTO {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2100)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(300000)
  mileage: number;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;
}
