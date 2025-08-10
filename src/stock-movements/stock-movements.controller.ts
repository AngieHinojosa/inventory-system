import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovement } from './entities/stock-movement.entity';

@ApiTags('stock-movements')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly service: StockMovementsService) {}

  @Post()
  @ApiCreatedResponse({ type: StockMovement })
  create(@Body() dto: CreateStockMovementDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'productId', required: false })
  findAll(@Query('productId') productId?: string) {
    return this.service.findAll({ productId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
