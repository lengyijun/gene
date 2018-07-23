'use strict';

import { Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import configureExpress from './config/express';
import shopRouter, { wsConfig as shopWsConfig }
  from './routers/shop.router';
import policeRouter, { wsConfig as policeWsConfig }
  from './routers/police.router';
import repairShopRouter, { wsConfig as repairShopWsConfig }
  from './routers/repair-shop.router';
import insuranceRouter, { wsConfig as insuranceWsConfig }
  from './routers/insurance.router';
import blockinfoRouter, { wsConfig as blockWsConfig }
  from './routers/blockinfo.router'
import calculationRouter , {wsconfig as calculationConfig}
  from './routers/calculation-center.router'

const INSURANCE_ROOT_URL = '/claim';
const POLICE_ROOT_URL = '/police';
const REPAIR_SHOP_ROOT_URL = '/medical-center';
const SHOP_ROOT_URL = '/shop';
const BLOCK_ROOT_URL='/block-info'
const CALCULATION_ROOT_URL = '/calculation-center'

const app = express();
const httpServer = new Server(app);

// Setup web sockets
const io = socketIo(httpServer);
shopWsConfig(io.of(SHOP_ROOT_URL));
policeWsConfig(io.of(POLICE_ROOT_URL));
repairShopWsConfig(io.of(REPAIR_SHOP_ROOT_URL));
insuranceWsConfig(io.of(INSURANCE_ROOT_URL));
blockWsConfig(io.of(BLOCK_ROOT_URL))

configureExpress(app);

app.get('/', (req, res) => {
  res.render('home', { homeActive: true });
});

// Setup routing
app.use(SHOP_ROOT_URL, shopRouter);
app.use(POLICE_ROOT_URL, policeRouter);
app.use(REPAIR_SHOP_ROOT_URL, repairShopRouter);
app.use(INSURANCE_ROOT_URL, insuranceRouter);
app.use(BLOCK_ROOT_URL,blockinfoRouter)
app.use(CALCULATION_ROOT_URL,calculationRouter)

export default httpServer;
