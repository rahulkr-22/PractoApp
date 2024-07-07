import {gql} from '@apollo/client'

export const LOGIN_MUTATION = gql`
   mutation login($email: String!, $password: String!){
  loginUser(email: $email, password: $password) {
    id
    name
    contact
    token
  }
}
    `;

export const REGISTER_MUTATION = gql`
    mutation registerUser($name: String!, $email: String!, $contact: String!, $password: String!){
  registerUser(name: $name, email: $email, contact: $contact, password: $password) {
    id
    name
    email
    contact
    token
  }
}`;

export const SEARCH_SPECIALITY=gql`
query getSpecialities($name: String!){
  specialities(name: $name) {
    id
    name
  }
}
`
export const SEARCH_DOCTORS=gql`
query getDoctorBySpec($name: String!, $limit: Int!, $offset: Int!){
  DoctorFromSpeciality(name: $name, limit: $limit, offset: $offset) {
      id
      name
      fee 
      experience
      image_url
  }
}
`

export const GET_DOCTOR=gql`
  query DoctorById($id:ID!){
    doctor(id:$id){
      id
      name
      fee
      experience
      image_url
    }
  }
`

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($amount: Int!) {
    createPaymentIntent(amount: $amount) {
      clientSecret
    }
  }
`;

export const ADD_APPOINTMENT=gql`
mutation($d_id: ID!, $p_id: ID!, $slot: String!, $success: Boolean!){
    addAppointment(d_id: $d_id, p_id: $p_id, slot: $slot, success: $success) {
        id
        p_id
        d_id
        slot
        success
    }
}
`

export const CANCEL_APPOINTMENT=gql`
mutation($id: ID!){
  cancelAppointment(id: $id) {
    id
  }
}
`