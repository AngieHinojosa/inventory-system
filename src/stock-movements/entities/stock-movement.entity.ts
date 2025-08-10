import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
}

@Entity({ name: 'stock_movements' })
export class StockMovement {
    @ApiProperty({ example: 'uuid', description: 'Unique ID of the movement' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ enum: MovementType, description: 'Type of movement: IN or OUT' })
    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @ApiProperty({ example: 10, description: 'Quantity moved' })
    @Column({ type: 'int' })
    quantity: number;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ApiProperty({ example: '2025-08-06T20:12:00Z', description: 'Date of creation' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
