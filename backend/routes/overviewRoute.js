import express from 'express'
import { getRevenue, getTotalUsers, getTotalOrders } from '../controllers/overviewController.js'

const overviewRoute = express.Router()

overviewRoute.get('/getrevenue', getRevenue);
overviewRoute.get('/getusers', getTotalUsers);
overviewRoute.get('/getorders', getTotalOrders);

export default overviewRoute;
