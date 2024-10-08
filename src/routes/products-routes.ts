import { ProductsController } from "@/controllers/products-controller";
import { Router } from "express";

const productsRoutes = Router();
const productsController = new ProductsController()

//@ts-ignore
productsRoutes.get('/', productsController.index)
//@ts-ignore
productsRoutes.post('/', productsController.create)
//@ts-ignore
productsRoutes.put('/:id', productsController.update)
//@ts-ignore
productsRoutes.delete('/:id',productsController.delete)


export {productsRoutes};