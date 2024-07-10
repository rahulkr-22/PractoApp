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
    c_id:ID!
    slot:String!
    success:Boolean!
  }

  type PaymentIntentResponse {
    clientSecret: String
  }

  type Review{
    id:ID!
    d_id:ID!
    p_id:ID!
    patientName:String!
    speciality:String!
    rating:Int!
    visitReason:String!
    content:String!
  }

  type DoctorClinic{
    dc_id:ID!
    d_id:ID!
    c_id:ID!
  }

  type DoctorSpecialisation{
    ds_id:ID!
    d_id:ID!
    s_id:ID!
  }


  type Query { 
    hello:String
    user(id:ID!):User
    userByEmail(email:String!):User
    doctors: [Doctor]
    doctor(id:ID!): Doctor
    clinic(id:ID!): Clinic
    appointments:[Appointment]
    appointmentByDoctorSlot(d_id:ID!):Appointment
    DoctorFromSpeciality(name:String!,limit:Int!, offset:Int!):[Doctor]
    specialities(name:String!):[Speciality]
    bookedSlots(d_id:ID!): [Appointment]
    doctorSpeciality(d_id:ID!):[Speciality!]!
    doctorClinic(d_id:ID!):[Clinic!]!
    doctorReview(d_id:ID!,speciality:String!):[Review]
    doctorByName(name:String!): [Doctor]
    appointmentByPatient(p_id:ID!):[Appointment]
  }

  type Mutation {
    createPaymentIntent(amount: Int!): PaymentIntentResponse
    registerUser(name:String!,email:String!,contact:String!,password:String!): User
    loginUser(email:String!,password:String!): User
    addAppointment(d_id:ID!,p_id:ID!,c_id:ID!,slot:String!,success:Boolean!):Appointment
    cancelAppointment(id:ID!): Appointment
    addReview(d_id:ID!,p_id:ID!,patientName:String!,speciality:String!,rating:Int!,visitReason:String!,content:String!):Review
    addDoctor(name:String!,fee:Int!,experience:Int!,image_url:String):Doctor
    addClinic(name:String!,address:String!,city:String!):Clinic
    addDoctorClinic(d_id:ID!,c_id:ID!):DoctorClinic
    addDoctorSpecialisation(d_id:ID!,s_id:ID!):DoctorSpecialisation
  }

`;

export default typeDefs;
