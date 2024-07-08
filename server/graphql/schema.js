import { gql } from 'apollo-server-express';

const typeDefs = gql`

  type Doctor{
    id: ID!
    name: String!
    fee:Int!
    experience:Int!
    image_url:String!
  }
  type User{
    id:ID!
    name:String!
    email:String!
    contact:String!
    password:String!
    token:String!
  }
  type Speciality{
    id: ID!
    name: String!
    
  }
  type Clinic{
    id: ID!
    name:String!
    address:String!
    city:String!

  }
  type Order {
    id: String
    currency: String
    amount: Int
    receipt: String
    status: String
    success:Boolean
  }
  type Appointment{
    id:ID!
    d_id:ID!
    p_id:ID!
    slot:String!
    success:Boolean!
  }

  type PaymentIntentResponse {
    clientSecret: String
  }


  type Query { 
    hello:String
    user(id:ID!):User
    doctors: [Doctor]
    doctor(id:ID!): Doctor
    appointments:[Appointment]
    appointmentByDoctorSlot(d_id:ID!,):Appointment
    DoctorFromSpeciality(name:String!,limit:Int!, offset:Int!):[Doctor]
    specialities(name:String!):[Speciality]
    bookedSlots(d_id:ID!): [Appointment]
  }

  type Mutation {
    createPaymentIntent(amount: Int!): PaymentIntentResponse
    registerUser(name:String!,email:String!,contact:String!,password:String!): User
    loginUser(email:String!,password:String!): User
    addAppointment(d_id:ID!,p_id:ID!,slot:String!,success:Boolean!):Appointment
    cancelAppointment(id:ID!): Appointment
  }

`;

export default typeDefs;
