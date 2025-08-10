import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Periféricos' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  name: string;

  @ApiProperty({ example: 'Teclados, mouse, audífonos', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
