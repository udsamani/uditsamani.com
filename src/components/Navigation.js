import React from 'react'
import { Link } from 'gatsby'
import ThemeContext from '../context/ThemeContext'
import hp from '../images/hp.svg'
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
      componentWillUmount() {
          window.removeEventListener('scroll', this.navigationOnScroll)
      }

      //Rendering JSX
      render() {
          const { scrolled } = this.state
          const { menuLinks } = this.props
          const theme = this.context

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
                          <Link key={link.name} to={link.link} activeClassName="active">
                              {link.name}
                          </Link>
                      ))}
                  </div>
                  <div className='cta'>
                      <button 
                        className='dark-switcher' 
                        onClick={theme.toggleDark}
                        aria-label="Toggle Dark Mode."
                        title="Toggle Dark Mode"
                      >
                        {theme.dark ? (
                              <img src={sun} className='theme-icon'/>
                        ) : (
                              <img src={moon} className='theme-icon'/>
                        )}
                      </button>
                  </div>
              </div>
            </nav>
          )
      }
}

export default Navigation
