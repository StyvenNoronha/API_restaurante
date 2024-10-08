import { Request, Response,NextFunction } from "express";
import {knex} from "@/database/knex";
import {z} from "zod";

class OrdersController{
async create(request:Request,response:Response,next:NextFunction){
        try {
            const bodySchema = z.object({
                table_session_id:z.number(),
                product_id:z.number(),
                quantity:z.number(),

            })
            const {product_id,quantity,table_session_id} = bodySchema.parse(request.body)
            //@ts-ignore
            const session = await knex<TablesSessionsRepository>("tables_sessions").where({id:table_session_id}).first()
            if(!session){
                return response.status(404).json({message:"não existe uma sessão com esse id"})
            }
            if(session.closed_at){
                return response.status(400).json({message:"sessão já foi fechada"})
            }
            const product = await knex<ProductsRepository>("products").where({id:product_id}).first()
            if(!product){
                return response.status(404).json({message:"não existe um produto com esse id"})
            }
            await knex<orderRepository>("orders").insert({
                table_session_id,
                product_id,
                quantity,
                price:product.price})

            return response.json({message:"pedido criado com sucesso"})
        } catch (error) {
            next(error)
        }
    }

async index(request:Request,response:Response,next:NextFunction){
    try {
        const {table_session_id} = request.params
        const order = await knex("orders")
        .select("orders.id",
            "orders.table_session_id",
            "orders.product_id",
            "products.name",
            "products.price",
            "orders.quantity",
            knex.raw(`orders.quantity * products.price as total`,),
            "orders.created_at",
            "orders.updated_at"  
        )
        .join("products","products.id","orders.product_id")
        .where({table_session_id})
        .orderBy("orders.created_at","desc") 

        

        return response.json(order)
    } catch (error) {
        next(error)
    }
   } 

async show(request:Request,response:Response,next:NextFunction){
    try {
        const {table_session_id} = request.params
        const order = await knex("orders")
        .select(
            knex.raw("COALESCE(SUM(orders.price * orders.quantity ), 0)as total"),
            knex.raw("COALESCE(SUM(orders.quantity ), 0)as quantidade")
        )
            
        .where({table_session_id})
        .first()
        return response.json(order)
    } catch (error) {
        next(error)
    }
}   
}
export {OrdersController}