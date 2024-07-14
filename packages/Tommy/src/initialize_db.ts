import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { DB, PASSWORD, USERNAME, HOST, DB_PORT, PORT } from './config/index'

const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: DB_PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DB,
  // synchronize: true,
  logging: false,
  // entities: [...IntraEntities],
  migrations: [],
  subscribers: [],
})

AppDataSource.initialize()
