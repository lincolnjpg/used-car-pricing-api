import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOptions = {} as DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dataSourceOptions = {
      synchronize: false,
      migrations: ['migrations/*.js'],
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    };
    break;
  case 'test':
    dataSourceOptions = {
      synchronize: false,
      migrations: ['migrations/*.js'],
      migrationsRun: true,
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    };
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

export const dataSource = new DataSource(dataSourceOptions);

(async () => {
  await dataSource.initialize();
})();
