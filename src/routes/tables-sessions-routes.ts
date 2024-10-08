import { Router} from "express";

import {TablesSessionsController} from '@/controllers/tables-sessions-controller'

const tablesSessionsRouter = Router()
const tablesSessionsController = new TablesSessionsController()



//@ts-ignore
tablesSessionsRouter.get("/", tablesSessionsController.index)

//@ts-ignore
tablesSessionsRouter.post("/", tablesSessionsController.create)

//@ts-ignore
tablesSessionsRouter.patch("/:id", tablesSessionsController.update)



export {tablesSessionsRouter}