import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBarcodeToProduct1754696524527 implements MigrationInterface {
    name = 'AddBarcodeToProduct1754696524527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "barcode" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e" UNIQUE ("barcode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "barcode"`);
    }

}
