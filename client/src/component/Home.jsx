import React from 'react'
import Header from './Header'
import Search from './Search.jsx'

const Home = () => {
  return (
    <div>
        <Header/>
        <Search/>
        <img className="w-full h-auto object-cover" src="https://blog.practo.com/wp-content/uploads/2017/04/Blog-Hero-Visual-1170x460.png" alt="practo-banner" />
    </div>
  )
}

export default Home