import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("products").del();

    // Inserts seed entries
    await knex("products").insert([
    { "name":"batata frita",price:25.25 },    
    { "name": "batata frita", "price": 25.25 },
    { "name": "hambúrguer", "price": 35.50 },
    { "name": "pizza margherita", "price": 40.00 },
    { "name": "salada caesar", "price": 20.00 },
    { "name": "frango à parmegiana", "price": 45.00 },
    { "name": "lasanha bolonhesa", "price": 30.00 },
    { "name": "sopa de legumes", "price": 15.00},
    { "name": "sanduíche de peru", "price": 18.00 },
    { "name": "espetinho de carne", "price": 22.50 },
    { "name": "suco de laranja", "price": 10.00}
    ]);
};
