import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement, Product])],
    controllers: [StockMovementsController],
    providers: [StockMovementsService],
})
export class StockMovementsModule {}
