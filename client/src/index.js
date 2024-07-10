import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import store from './redux/store';

const API_END_POINT="http://localhost:8000";

export const client=new ApolloClient({
  uri:`${API_END_POINT}/graphql`,
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <App/>
          <Toaster/>
        </ApolloProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);


