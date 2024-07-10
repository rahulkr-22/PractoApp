import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs'
import pool from './db.js'
import dotenv from 'dotenv'
import Stripe from 'stripe';


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resolvers={

    Query:{
        hello: ()=>"hello world",
        user: async(_,{id})=>{
            const [rows]=await pool.query('SELECT * FROM patient WHERE id = ?',[id]);
            return rows[0]
        },
        userByEmail: async(_,{email})=>{
            const [rows]=await pool.query('SELECT * FROM patient WHERE email = ?',[email]);
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
        clinic: async(_,{id})=>{
            const [rows]=await pool.query('SELECT * FROM clinic WHERE id= ?',[id])
            return rows[0]
        },
        appointments: async(_,args)=>{
            const [rows]=await pool.query('SELECT * FROM appointment');
            return rows;
        },
        DoctorFromSpeciality: async(_,{name,limit,offset})=>{
            const [rows]=await pool.query('SELECT DISTINCT d.* FROM doctor d JOIN doctor_specialisation ds ON d.id = ds.d_id JOIN specialisation s ON ds.s_id=s.id where s.name LIKE ? LIMIT ? OFFSET ?', [`%${name}%`, limit, offset]);
            return rows;
        },
        specialities: async(_,{name})=>{
            const [rows]=await pool.query('SELECT * FROM specialisation WHERE name LIKE ?', [`%${name}%`]);
            return rows;
        },
        doctorByName: async(_,{name})=>{
            const [rows]=await pool.query('SELECT * FROM doctor WHERE name LIKE ?', [`%${name}%`]);
            return rows;
        },
        bookedSlots: async(_,{d_id})=>{
          const [rows]=await pool.query('SELECT slot FROM appointment WHERE d_id=? AND success=true',[d_id])

          return rows;

        },
        doctorSpeciality: async(_,{d_id})=>{
          const [rows]=await pool.query('SELECT DISTINCT s.name FROM doctor d JOIN doctor_specialisation ds ON ds.d_id=? JOIN specialisation s ON ds.s_id=s.id',[d_id]);
          return rows;
        },
        doctorClinic: async(_,{d_id})=>{
          const [rows]=await pool.query('SELECT DISTINCT c.id,c.name,c.address,c.city FROM doctor d JOIN doctor_clinic dc ON dc.d_id=? JOIN clinic c ON dc.c_id=c.id',[d_id]);
          return rows;
        },
        doctorReview: async(_,{d_id,speciality})=>{
          const [rows]=await pool.query('SELECT p_id,rating,patientName, visitReason, content FROM review WHERE review.d_id=? AND review.speciality=?',[d_id,speciality]);
          return rows;
        },
        appointmentByPatient: async(_,{p_id})=>{
          const [rows]=await pool.query(
            'SELECT MIN(id) as id, d_id, p_id, c_id, slot, success FROM appointment WHERE p_id = ? GROUP BY d_id, p_id, c_id, slot',[p_id])
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
          registerUser: async (_,{ name, email,contact, password}) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if(name.length<3){
                throw new Error("Name should have atleast 3 characters")
            }
            if (!email.match(regex)) {
              throw new Error("Email is not valid.");
            } 
            if(contact.length!=10){
                throw new Error("Mobile Number is not valid.")
            }
      
            const [user] = await pool.query(`SELECT p.email FROM patient p WHERE p.email=?`,[email]);
            if (user.length > 0) {
              throw new Error("User already exists");
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
      
            const [newUser] = await pool.query(
              `INSERT INTO patient (name,email,contact,password) VALUES (?, ?, ?,?);`,
              [name, email, contact, hashedPassword]
            );

            const payload = {
              id: newUser.insertId,
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });

            return {
              id: newUser.insertId,
              name, email, contact,token
            };
          },
          loginUser: async (_, { email, password}) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!email.match(regex)) {
              throw new Error("Email is not valid.");
            } 
            const [user] = await pool.query(`SELECT * FROM patient p WHERE p.email=?`,[email]);

            if (user.length == 0) {
              throw new Error("Email or Password is not correct.");
            }

            const isPasswordMatched = await bcryptjs.compare(
              password,
              user[0].password
            );
      
            if (!isPasswordMatched) {
              throw new Error("Email or Password is not correct.");
            }

            const payload = {
              id: user[0].id,
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "24h",
            });
      
            return {
                id:user[0].id, name:user[0].name, email, contact:user[0].contact,token
            };
          },
          addAppointment: async(_,{d_id,p_id,c_id,slot,success})=>{
            const [rows]=await pool.query('INSERT INTO appointment (d_id,p_id,c_id,slot,success) VALUES (?,?,?,?,?)',[d_id,p_id,c_id,slot,success])
            return{
              id:rows.insertId,
              d_id,p_id,c_id,slot,success
            }
        },
        cancelAppointment: async(_,{id})=>{
          const [rows]=await pool.query('UPDATE appointment SET success=false WHERE id=?',[id]);
          return {
            id
          }
        },
        addReview: async(_,{d_id,p_id,patientName,speciality,rating,visitReason,content})=>{
          const [rows]=await pool.query('INSERT INTO review (d_id,p_id,patientName,speciality,rating,visitReason,content) VALUES (?,?,?,?,?, ?,?)',[d_id,p_id,patientName,speciality,rating,visitReason,content])
          return{
            id:rows.insertId,
            d_id,p_id,patientName,speciality,
            rating,visitReason,content
          }         
        },
        addDoctor:async(_,{name,fee,experience,image_url})=>{
          const [rows]=await pool.query('INSERT INTO doctor (name,fee,experience,image_url) VALUES (?,?,?,?)',[name,fee,experience,image_url]);
          return {
            id:rows.insertId,
            name,fee,experience,image_url      
          }
        },
        addClinic:async(_,{name,address,city})=>{
          const [rows]=await pool.query('INSERT INTO clinic (name,address,city) VALUES (?,?,?)',[name,address,city]);
          return {
            id:rows.insertId,
            name,address,city

          }
        },
        addDoctorClinic:async(_,{d_id,c_id})=>{
          const [rows]=await pool.query('INSERT INTO doctor_clinic (d_id,c_id) VALUES (?,?)',[d_id,c_id]);
          return {
            dc_id:rows.insertId,
            d_id,c_id
          }
        },
        addDoctorSpecialisation:async(_,{d_id,s_id})=>{
          const [rows]=await pool.query('INSERT INTO doctor_specialisation (d_id,s_id) VALUES (?,?)',[d_id,s_id]);
          return {
            ds_id:rows.insertId,
            d_id,s_id
          }
        },
        addSpeciality:async(_,{name})=>{
          const [rows]=await pool.query('INSERT INTO specialisation (name) VALUES (?)',[name]);
          return {
            id:rows.insertId,
            name
          }
        }


    }
}

export default resolvers;
