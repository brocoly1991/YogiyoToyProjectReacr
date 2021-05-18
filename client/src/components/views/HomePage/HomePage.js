import React from 'react'
import  HomeContentPage from './HomeContentPage.js';
import  HomeNavBarPage from './HomeNavBarPage.js';
import './Sections/Navbar.css';

function HomePage(props) {

    return (
        <div>

            <div className="HomeNavBar" style={{ width: '100%', margin: '1.5rem auto' , fontSize: '23px' , borderBottom : '4px solid #84808082'}}>
                <HomeNavBarPage />
            </div>  
            
            <div style={{ width: '75%', margin: '3rem auto' }}>
                <HomeContentPage />
            </div>
            
        </div>
    )
}

export default HomePage
