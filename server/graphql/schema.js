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
    clinic_id:ID!
    slot:Int!
    success:Boolean
  }

  type PaymentIntentResponse {
    clientSecret: String
  }

  input RegisterInput{
    name:String!,
    email:String!,
    contact:String!,
    password:String!,
  }

  input LoginInput{
    email:String!,
    password:String!
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
  }

  type Mutation {
    createPaymentIntent(amount: Int!): PaymentIntentResponse
    registerUser(input: RegisterInput): User
    loginUser(input:LoginInput): User
    addAppointment(d_id:Int!,p_id:Int!,slot:Int!,status:String!):Appointment
  }

`;

export default typeDefs;
