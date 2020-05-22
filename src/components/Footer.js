import React, { Component } from 'react'
import { Link } from 'gatsby'
import netlify from '../../content/thumbnails/netlify.png'
import gatsby from '../../content/thumbnails/gatsby.png'
import github from '../../content/thumbnails/github.png'

class Footer extends Component {
    render() {
        return(
            <footer className='footer container'>
              <div>
                <a href="https://twitter.com/uditpsamani" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://www.instagram.com/dory.lover" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <Link to="/contact/">Contact</Link>
              </div>
              <div>
                <a href="https://github.com/taniarascia" title="Open-source on GitHub" target="_blank" rel="noopener noreferrer">
                  <img
                    src={github}
                    className="footer-img"
                    alt="GitHub"
                  />
                </a>
                <a href="https://www.netlify.com/" title="Hosted by Netlify" target="_blank" rel="noopener noreferrer">
                  <img
                    src={netlify}
                    className="footer-img"
                    alt="Netlify"
                  />
                </a>
                <a href="https://www.gatsbyjs.org/" title="Built with Gatsby" target="_blank" rel="noopener noreferrer" style={{marginRight: 0}}>
                  <img
                    src={gatsby}
                    className="footer-img"
                    alt="Gatsby"
                  />
                </a>
            </div>
            </footer>
        )
    }
}

export default Footer
