import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../layouts'
import PortfolioListing from '../components/PortfolioListing'
import config from '../../data/SiteConfig'
import kebabCase from 'lodash.kebabcase'
import _ from 'lodash'

class PortfolioPage extends Component {
    state = {
        posts: this.props.data.posts.edges
    }

    render() {
        const { posts } = this.state
        const categories = this.props.data.categories.group.filter(
            category => category.fieldValue !== 'Popular'
        )

        return (
            <Layout>
                <Helmet title = {`Portfolio - ${config.siteTitle}`}/>
                <div className='container'>
                    <h1>Portfolio</h1>
                    <PortfolioListing excerpt postEdges={posts}/>
                </div>
            </Layout>
        )
    }
}

export default PortfolioPage

export const pageQuery = graphql `
    query PortfolioQuery {

        posts: allMarkdownRemark(limit:2000, sort:{fields:frontmatter___date, order:DESC}){
           edges{
             node{
                 fields {
                     slug
                     date
                 }
               frontmatter {
                 title
                 tags
                 thumbnail {
                   childImageSharp {
                     fixed(width:150, height:150) {
                       ...GatsbyImageSharpFixed
                     }
                   }
                 }
                 date
                 template
               }
               excerpt(pruneLength:180)
             }
           }
       }

        categories: allMarkdownRemark(limit:2000) {
            group(field:frontmatter___categories) {
                fieldValue
                totalCount
            }
        }


    }
`
