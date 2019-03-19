import React, { Component } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import config from '../../data/SiteConfig'
import hp from '../images/hp.png'
import Helmet from 'react-helmet'
import '../styles/main.scss'

class BasicLayout extends Component {

    render(){
        const { children } = this.props;
        return(
            <>
                <Helmet>
                    <meta name='description' content={config.siteDescription}/>
                    <link rel='shortcut icon' type='image/png' href={hp}/>
                </Helmet>
                <Navigation menuLinks = {config.menuLinks}/>
                <main id='main-content'>{children}</main>
                <Footer/>
            </>

        );
    }
}

export default BasicLayout
