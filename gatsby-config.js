const config = require('./data/SiteConfig')
const urljoin = require('url-join')


module.exports = {
    pathPrefix: config.pathPrefix === '' ? '/' : config.pathPrefix,
    siteMetadata:{
        siteUrl: urljoin(config.siteUrl, config.pathPrefix),
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name:'assets',
                path: `${__dirname}/static/`
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}/content/`
            }
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 850,
                        }
                    },
                    'gatsby-remark-prismjs',
                    'gatsby-remark-copy-linked-files',
                    {
                        resolve: 'gatsby-remark-autolink-headers',
                        options: {
                            offsetY: `100`,
                            maintainCase: false,
                            removeAccents: true,
                        }
                    }
                ]
            }
        },
        {
            resolve: 'gatsby-plugin-nprogress',
            options: {
                color: config.themeColor,
            }
        },
        'gatsby-plugin-sharp',
        `gatsby-transformer-sharp`,
        'gatsby-plugin-catch-links',
        'gatsby-plugin-sitemap',
    {
        resolve: `gatsby-transformer-remark`,
        options: {
        plugins: [
        {
            resolve: `gatsby-remark-katex`,
            options: {
            strict: `ignore`
          }
        }
      ],
    },
   },
 ]
}
