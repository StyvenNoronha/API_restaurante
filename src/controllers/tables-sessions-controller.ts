import { Request, Response, NextFunction } from "express";
import {z} from "zod";
import {knex} from "@/database/knex"

class TablesSessionsController {
async create(request: Request, response: Response, next: NextFunction){
    try {
        
        const createSchema = z.object({
            table_id: z.number(),
        })

        const {table_id} = createSchema.parse(request.body)
        const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({table_id})
        .orderBy("opened_at", "desc")
        .first()
        if(session && !session.closed_at){
            return response.status(400).json({
                message: "Já existe uma sessão ativa para esta mesa"
            })
        }
        await knex<TablesSessionsRepository>("tables_sessions").insert({
            table_id,
            opened_at: knex.fn.now(),
        })
        
        return response.status(201).json({message:"deu certo"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}




async index(request: Request, response: Response, next: NextFunction){
try {
    const sessions = await knex<TablesSessionsRepository>("tables_sessions")
    .select()
    .orderBy("closed_at")
    console.log(sessions)
    return response.json(sessions)
} catch (error) {
    next(error)
}
}

async update(request: Request, response: Response, next: NextFunction){
try {
    const id = z
    .string()
    .transform((value)=>Number(value))
    .refine((value)=>
        !isNaN(value)
    , {message:"Id inválido"})
    .parse(request.params.id)
//@ts-ignore
    const session = await knex<TablesSessionsRepository>("tables_sessions").where({id}).first()
    if(!session){
        return response.status(404).json({message:"Sessão não encontrada"})
    }
    if(session.closed_at){
        return response.status(400).json({message:"Sessão já foi encerrada"})
    }
//@ts-ignore
    await knex<TablesSessionsRepository>("tables_sessions").where({id}).update({
        closed_at: knex.fn.now(),
    })

    return response.json()
    
} catch (error) {
    next(error)
    
}
}
}

export {TablesSessionsController}