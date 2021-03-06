import React, { Component } from "react"
import Helmet from "react-helmet"
import { graphql } from "gatsby"
import Layout from "../layouts"
import PostTags from "../components/PostTags"
import config from "../../data/SiteConfig"
import Img from "gatsby-image"
import { formatDate, editOnGithub } from "../utils/global"
import "katex/dist/katex.min.css"

class PortfolioTemplate extends Component {
  render() {
    const { slug } = this.props.pageContext
    const postNode = this.props.data.markdownRemark
    const post = postNode.frontmatter
    let thumbnail

    if (!post.id) {
      post.id = slug
    }

    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID
    }

    if (post.thumbnail) {
      thumbnail = post.thumbnail.childImageSharp.fixed
    }

    const date = formatDate(post.date)
    const githubLink = editOnGithub(post)
    console.log(githubLink)

    return (
      <Layout>
        <Helmet>
          <title>{`${post.title} – ${config.siteTitle}`}</title>
        </Helmet>
        <article className="single container">
          <header className="single-header">
            {thumbnail ? (
              <Img fixed={post.thumbnail.childImageSharp.fixed} />
            ) : (
              <div />
            )}
            <div className="flex">
              <h1>{post.title}</h1>
              <div className="post-meta">
                <time className="date">{date}</time>
              </div>
            </div>
          </header>
          <div
            className="post"
            dangerouslySetInnerHTML={{ __html: postNode.html }}
          />
        </article>
      </Layout>
    )
  }
}

export default PortfolioTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query PortfolioPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        thumbnail {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        slug
        date
        categories
        tags
        template
      }
      fields {
        slug
        date
      }
    }
  }
`
