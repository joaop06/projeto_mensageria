import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    port: 3310,
    type: 'mysql',
    host: 'localhost',
    synchronize: true,
    database: 'messageria',
    password: 'messageria',
    username: 'messageria',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
