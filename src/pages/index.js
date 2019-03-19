import React from 'react'
import '../styles/main.scss'
import Layout from '../layouts'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import config from '../../data/SiteConfig'
import PostListing from '../components/PostListing'



class Index extends React.Component {

    render(){
        const latestPostEdges = this.props.data.latest.edges

        return(
            <Layout>
                <Helmet title={`${config.siteTitle} - Machine Learning, Data Science, writer`}/>
                <div className='container'>
                    <div className='lead'>
                        <h1>
                            Hi, I'm Udit.
                        </h1>
                        <p>
                            I'm  a <strong>student</strong> at  <strong>University of Illinois at Urbana Champaign</strong>.
                             I am pursuing my career in <strong>Computer Science</strong> with main focuses in <strong>Machine
                              Learning</strong>, <strong>Data Science</strong>, and <strong>Deep Learning</strong>.
                              I build open source projects and write articles related to Machine Learning.
                              I created this site to document everything I learn, and share a bit of
                              myself with the world. My site has no ads, affiliates, sponsored posts, or paywalls.
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
                        <p>
                            <small>
                                <em>April 1, 2019</em>
                            </small>
                            <br/>
                            After a long 97 hours, I've finally created my website using Gatsby. Gatsby is
                            a React/Node.js static site generator. I am in love with the idea of writing my
                            blog posts with markdown files. The already defined templates in JavaScript just
                            make it more interactive and good looking. I would personally like to thank <a href=''>Nikita
                            Nahata</a> for pushing me hard for making my website. This has been long overdue project.
                            Spring break spent well.
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
