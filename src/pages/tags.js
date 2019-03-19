import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../layouts'
import { Link, graphql } from 'gatsby'
import kebabCase from 'lodash.kebabcase'
import config from '../../data/SiteConfig'

class TagsPage extends Component {
  render() {
    const { group } = this.props.data.allMarkdownRemark

    return (
      <Layout>
        <Helmet title={`Tags – ${config.siteTitle}`} />
        <div className="container">
          <h1>Tags</h1>
          <div className="tag-container">
            {group.map(tag => (
              <Link to={`/tags/${kebabCase(tag.fieldValue)}`}>
                <span key={tag.fieldValue}>
                  {tag.fieldValue} <strong className="count">{tag.totalCount}</strong>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    )
  }
}

export default TagsPage

export const pageQuery = graphql`
  query TagsQuery {
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
