import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return(
            <footer className='footer container'>
                <small>
                    Made by <strong>Udit Samani</strong>/{' '}
                    <a href='https://github.com/udsamani/uditsamani.com' target='_blank'>
                        View Source
                    </a>
                </small>
            </footer>
        )
    }
}

export default Footer
