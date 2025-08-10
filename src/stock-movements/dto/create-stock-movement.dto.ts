import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export class CreateStockMovementDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}
