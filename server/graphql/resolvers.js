import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import pool from './db.js'

import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51NlOhRSEekknxcXvnjXa5pphT4YJy4iIjPRQaSJtBBEA6iKhQamtf08jVbLcU2MoJueS9R89mu6jXDC4MQPAf6dj000iOwnzTD');

const resolvers={

    Query:{
        hello: ()=>"hello world",
        user: async(_,{id})=>{
            const [rows]=await pool.query('SELECT * FROM patient WHERE id = ?',[id]);
            return rows[0]
        },
        doctors: async(_,args)=>{
            const [rows]=await pool.query('SELECT * FROM doctor');
            return rows;
        },
        doctor: async(_,{id})=>{
            const [rows]=await pool.query('SELECT * FROM doctor WHERE id= ?',[id])
            return rows[0]
        },
        appointments: async(_,args)=>{
            const [rows]=await pool.query('SELECT * FROM appointment');
            return rows;
        },
        // appointment: async(_,{})=>{
        //     // const [rows]=await pool.query('SELECT * FROM doctor WHERE id= ?',[id])
        //     // return rows[0]
        // },
        DoctorFromSpeciality: async(_,{name,limit,offset})=>{
            const [rows]=await pool.query('SELECT DISTINCT d.* FROM doctor d JOIN doctor_specialisation ds ON d.id = ds.d_id JOIN specialisation s ON ds.s_id=s.id where s.name LIKE ? LIMIT ? OFFSET ?', [`%${name}%`, limit, offset]);
            return rows;
        },
        specialities: async(_,{name})=>{
            const [rows]=await pool.query('SELECT * FROM specialisation WHERE name LIKE ?', [`%${name}%`]);
            return rows;
        }

    },

    Mutation:{
        createPaymentIntent: async (_, { amount }) => {
            try {
              const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'inr'
              });
             // console.log('Payment Intent created:', paymentIntent);
              return {
                clientSecret: paymentIntent.client_secret
              };
            } catch (error) {
              //console.error('Error creating payment intent:', error);
              throw new Error('Failed to create payment intent');
            }
          },
          
    }

}

export default resolvers;
