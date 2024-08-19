const { DataSource } = require('typeorm');

const dataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity{.js,.ts}'],
  migrations: ['migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => console.log('DataSource has been initialized'))
  .catch((err) => console.error('Error during DataSource initilization', err));

module.exports = {
  dataSource,
  dataSourceOptions,
};
