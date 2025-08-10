import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Post()
    @ApiCreatedResponse({ type: Product })
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiQuery({ name: 'q', required: false, description: 'Search term for name or sku' })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'offset', required: false, example: 0 })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category id (UUID)' })
    @ApiResponse({ status: 200, description: 'Paginated list of products' })
    findAll(
        @Query('q') q?: string,
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
        @Query('categoryId') categoryId?: string, 
    ) {
        return this.service.findAll({
        q,
        limit: Number(limit),
        offset: Number(offset),
        categoryId,
        });
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: Product })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, type: Product })
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiResponse({ status: 204, description: 'Product deleted' })
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
        return { statusCode: 204, message: 'Deleted' };
    }

} 