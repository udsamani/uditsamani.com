import React, { Component } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import config from '../../data/SiteConfig'
import hp from '../images/hp.png'
import Helmet from 'react-helmet'
import '../styles/main.scss'
import ThemeContext from '../context/ThemeContext'
import 'semantic-ui-css/semantic.min.css';


//TO DO : Theme Context , Helmet BodyAttributes
class BasicLayout extends Component {
    static contextType = ThemeContext

    render(){
        const { dark, notFound, setFound } = this.context
        const { children } = this.props;
        console.log(setFound)
        return(
            <>
                <Helmet
                    bodyAttributes={{
                        class: `theme ${dark && !notFound ? 'dark' : '' || notFound ? 'not-found' : ''}`,
                    }}
                >
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
