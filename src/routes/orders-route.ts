import {Router} from "express"
import { OrdersController } from "@/controllers/orders-controllers"

const orderRoutes = Router()
const ordersController = new OrdersController()
//@ts-ignore
orderRoutes.post("/",ordersController.create)
//@ts-ignore
orderRoutes.get("/session-table/:table_session_id",ordersController.index)
//@ts-ignore
orderRoutes.get("/table-session/:table_session_id/total",ordersController.show)


export {orderRoutes}
