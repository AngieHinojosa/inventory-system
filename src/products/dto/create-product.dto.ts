import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SKU-00123' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  sku: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 120)
  name: string;

  @ApiProperty({ example: 'Ergonomic wireless mouse', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '19990', description: 'decimal as string' })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'cat-uuid-123', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @Length(6, 32) 
  barcode?: string;
}
