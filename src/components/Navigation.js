import React from 'react'
import { Link } from 'gatsby'
import ThemeContext from '../context/ThemeContext'
import hp from '../images/hp.svg'
import cv from '../images/cv.svg'
import sun from '../images/sun.svg'
import moon from '../images/moon.svg'


class Navigation extends React.Component {

    static contextType = ThemeContext
    //Set up the state of Navigation Component
    state = {
        scrolled: false
    }

    /*Function to change the className for navigation
      bar in CSS file. If the page is scrolled, the
      navigation bar sticks to the top of page.*/
      navigationOnScroll = () => {
          if(window.scrollY > 10) {
              this.setState({scrolled: true})
          } else {
              this.setState({ scrolled: false})
          }
      }

      //Component life cycle function to add scroll event listener
      componentDidMount() {
          window.addEventListener('scroll', this.navigationOnScroll)
      }

      //Component life cycle function to remove scroll even listener
      /*
      componentWillUmount() {
          window.removeEventListener('scroll', this.navOnScroll)
      }
      */

      //Rendering JSX
      render() {
          const { scrolled } = this.state
          const { menuLinks } = this.props
          const { dark, toggleDark, setFound} = this.context

          return(
              <ThemeContext.Consumer>
                {value => (
                      <nav className = {scrolled ? 'nav scroll' : 'nav'}>
                        <div className = 'nav-container'>
                            <div className = 'brand'>
                                <Link to='/'>
                                    <img src={hp} className='favicon'/>{' '}
                                    <span className='text'>Udit Samani</span>
                                </Link>
                            </div>
                            <div className='links'>
                                {menuLinks.map(link => (
                                    <Link key={link.name} to={link.link}>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <div className='cta'>
                                <button className='dark-switcher' onClick={value.toggleDark}>
                                    {value.dark ? (
                                        <span>
                                            <img src={sun} className='theme-icon'/>
                                        </span>
                                    ) : (
                                        <span>
                                            <img src={moon} className='theme-icon'/>
                                        </span>
                                    )}
                                </button>
                                <a className='donate-button' href='https://drive.google.com/file/d/1z-DkD1F3REVLqpj-mvWY13mp6EwYlBr1/view?usp=sharing' target ='_blank'>
                                    <img src={cv} className='coffee-icon'/>
                                </a>
                            </div>
                        </div>
                      </nav>
                )}
            </ThemeContext.Consumer>
          )
      }
}

export default Navigation
