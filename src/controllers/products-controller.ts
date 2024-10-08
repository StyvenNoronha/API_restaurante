import { NextFunction,Request,Response } from "express";
import { AppError } from "@/utils/AppError";
import {knex} from "@/database/knex"
import {z} from "zod"

class ProductsController{
    async index(request:Request,response:Response,next:NextFunction){
        try {
            const {name} = request.query
            const products = await knex<ProductsRepository>("products")
            .select()
            .whereLike("name",`%${name ?? ""}%`)
            .orderBy("name")
            return response.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    async create(request:Request,response:Response,next:NextFunction){
        try {
            const bodyschema = z.object({
                name:z.string({required_error:"precisa ter um nome"}).trim().min(3),
                price:z.number().gt(0,{message:"precisa ser maior que 0"})
            })
            const {name, price} = bodyschema.parse(request.body)

            await knex<ProductsRepository>("products").insert({name, price})


            return response.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async update(request:Request,response:Response,next:NextFunction){
        try {

            const id = z
            .string()
            .transform((value)=>Number(value))
            .refine((value)=>!isNaN(value),{message:"precisa ser um numero"})
            .parse(request.params.id)

            const bodyschema = z.object({
                name:z.string({required_error:"precisa ter um nome"}).trim().min(3),
                price:z.number().gt(0,{message:"precisa ser maior que 0"})
            })

            const {name, price} = bodyschema.parse(request.body)

            const products = await knex<ProductsRepository>("products").select().where({id}).first()

            if(!products){
                return response.status(400).json({message:"Produto não existe"})
            }

            await knex<ProductsRepository>("products").update({name,price, updated_at: knex.fn.now()}).where({id})

            return response.json({message:"atualizado com sucesso"})
        } catch (error) {
            next(error)
        }
    }

    async delete(request:Request,response:Response,next:NextFunction){
        try {
            const id = z
            .string()
            .transform((value)=>Number(value))
            .refine((value)=>!isNaN(value),{message:"precisa ser um numero"})
            .parse(request.params.id)

            const products = await knex<ProductsRepository>("products").select().where({id}).first()

            if(!products){
                return response.status(400).json({message:"Produto não existe"})
            }

            await knex<ProductsRepository>("products").delete().where({id})
            return response.json()
        } catch (error) {
            next(error)
        }
    }
}

export {ProductsController}