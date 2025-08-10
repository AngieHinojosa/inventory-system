import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { envValidationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`, 
        '.env',                                          
      ],
      validationSchema: envValidationSchema,
    }),

    // Database config using environment variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const db = cfg.get('db');
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.pass,
          database: db.name,
          autoLoadEntities: true,
          synchronize: db.synchronize, 
          logging: db.logging,
        };
      },
    }),

    ProductsModule,
    CategoriesModule,
    StockMovementsModule,
    HealthModule,
  ],
})
export class AppModule {}
