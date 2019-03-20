import React, { Component } from 'react'
import hp from '../images/cv.png'



class ProjectCard extends Component {

    render() {
        //const { image, projecName } = this.props

        return(
            <div className='card'>
                <div className='image'>
                    <img src={hp}/>
                </div>
                <div className='content'>
                    <div className='header'>
                        Udit Samani
                    </div>
                    <div className='meta'>
                        <a>Udit Samani</a>
                    </div>
                    <div className='description'>
                        Udit Samani is designer living in Urbana.
                    </div>
                </div>
                <div className='extra content'>
                    <span className='right floated'>
                        Joined in 2013
                    </span>
                </div>
            </div>
        )
    }

}



export default ProjectCard
