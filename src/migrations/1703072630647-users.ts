import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1703072630647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `CREATE TABLE "users" (
            "userId" SERIAL NOT NULL PRIMARY KEY,
            "username" character varying NOT NULL UNIQUE,
            "password" character varying NOT NULL,
            "email" character varying NOT NULL UNIQUE,
            "cellphone" character varying(10) DEFAULT NULL,
            "userType" character varying NOT NULL DEFAULT 'user')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE "users"`);
  }
}
