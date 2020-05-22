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
import udit from '../images/udit.jpg'




class Index extends React.Component {

    render(){
        const latestPostEdges = this.props.data.latest.edges

        return(
            <Layout>
                <Helmet title={`${config.siteTitle} - Software Engineer`}/>
                <div className='container'>
                    <div className='lead'>
                      <div className='elevator'>
                        <h1>{`Hey, I'm Udit`}</h1>
                        <p>
                          {`I'm a Software engineer `}
                          <Link to="/blog">writing </Link> about modern software technologies and how
                          to be efficient with them.
                        </p>
                      </div>
                      <div className="newsletter-section">
                        <img src={udit} className="newsletter-avatar" alt="Tania" />
                        <div>
                          <h3>Email Newsletter</h3>
                          <p>
                            I write tutorials. Get an update when something new comes out by signing up below!
                          </p>
                          <a className="button" >
                            Subscribe
                          </a>
                        </div>
                      </div>
                    </div>
                </div>
                <div className='container front-page'>
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
