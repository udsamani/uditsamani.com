const config = require('./data/SiteConfig')


module.exports = {
    siteMetadata:{
        title: "Udit Samani",
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
    ]
}
