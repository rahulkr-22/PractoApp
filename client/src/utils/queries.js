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