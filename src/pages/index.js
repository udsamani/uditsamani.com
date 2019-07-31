import React from 'react'
import '../styles/main.scss'
import Layout from '../layouts'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import config from '../../data/SiteConfig'
import PostListing from '../components/PostListing'
import hu from '../images/handsup.svg'
import ss from '../images/swiftsolution.svg'
import lu from '../images/loosenup.svg'
import gh from '../images/gethigh.svg'
import time from '../images/time.svg'
import cl from '../images/checklist.svg'




class Index extends React.Component {

    render(){
        const latestPostEdges = this.props.data.latest.edges

        return(
            <Layout>
                <Helmet title={`${config.siteTitle} - Computer Science Engineer & Traveler`}/>
                <div className='container'>
                    <div className='lead'>
                        <h1>
                            Hi, I'm Udit.
                        </h1>
                        <p>
                            I'm  a <strong>student</strong> at  <strong>University of Illinois at Urbana Champaign</strong>.
                             I am pursuing my career in <strong>Computer Science</strong> with main focuses in <strong>Machine
                              Learning</strong>, <strong>Data Science</strong>, and <strong>Deep Learning</strong>.
                              I build open source projects and write articles related to Computer Science.

                        </p>
                        <Link className='button' to='/me' target='_blank'>
                            About Me
                        </Link>
                        <a className='button' href='https://github.com/udsamani' target='_blank'>
                            GitHub
                        </a>
                        <a className='button' href='' target='_blank'>
                            LinkedIn
                        </a>
                    </div>
                </div>
                <section className='note'>
                    <div className='container note-container'>
                        <h3> Updates</h3>
                        <img src = {hu}/>
                        <img src = {ss}/>
                        <img src = {gh}/>
                        <img src = {cl}/>

                        <p>
                            <small>
                                <em>July 30, 2019</em>
                            </small>
                            <br/>
                            Since I was a kid, I always wanted to design a caricature that speaks to me. Finally
                            after many hours of thinking and desigining I came up with this caricature. I will be using
                            this in my articles. It is my belief that if you have a picture of professor in mind then things
                            are easy to remember or recall. Hope this makes you enjoy reading articles here.
                        </p>
                    </div>
                </section>


                <div className='container'>
                    <section className='section'>
                        <h2>Latest Articles</h2>
                        <PostListing simple postEdges={latestPostEdges} />
                    </section>
                </div>
            </Layout>
        );
    }
};

export default Index

export const pageQuery = graphql`
    query IndexQuery {
      latest: allMarkdownRemark(
        limit:6
      	sort:{fields:frontmatter___date, order: DESC}
      	) {
        edges {
          node {
              fields{
                  slug
                  date
              }
            frontmatter{
              title
              tags
              template
              thumbnail {
                childImageSharp {
                  fixed(width:150, height:150) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
              date
            }
            timeToRead
            excerpt
          }
      	}
        }
    }
`
