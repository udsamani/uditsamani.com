import React from 'react'
import { Link } from 'gatsby'
import hp from '../images/hp.svg'
import cv from '../images/cv.svg'


class Navigation extends React.Component {

    //Set up the state of Navigation Component
    state = {
        scrolled: false
    }

    /*Function to change the className for navigation
      bar in CSS file. If the page is scrolled, the
      navigation bar sticks to the top of page.*/
      navigationOnScroll = () => {
          if(window.scrollY > 20) {
              this.setState({scrolled: true})
          } else {
              this.setState({ scrolled: false})
          }
      }

      //Component life cycle function to add scroll event listener
      componentDidMount() {
          window.addEventListener('scroll', this.navOnScroll)
      }

      //Component life cycle function to remove scroll even listener
      componentWillUmount() {
          window.removeEventListener('scroll', this.navOnScroll)
      }

      //Rendering JSX
      render() {
          const { scrolled } = this.state
          const { menuLinks } = this.props
          console.log(menuLinks)

          return(
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
                        <a className='donate-button' href='/' target ='_blank'>
                            <span className='text'>Resume</span>
                            <img src={cv} className='coffee-icon'/>
                        </a>
                    </div>
                </div>
              </nav>
          )
      }
}

export default Navigation
