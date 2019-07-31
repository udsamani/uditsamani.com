const config = {
  siteTitle: "Udit Samani",
  siteTitelShort: "Udit Samani",
  siteTitleAlt: "Udit Samani",
  siteLogo: "/src/images/hp.svg",
  siteUrl: "https://www.uditsamani.com",
  repo: "https://github.com/udsamani/uditsamani.com",
  pathPrefix: "",
  dateFromFormat: "YYYY-MM-DD",
  dateFormat: "MMMM Do, YYYY",
  siteDescription: "",
  postDefaultCategoryID: "Machine Learning",
  userLocation: "Urbana, IL",
  menuLinks: [
    {
      name: "Me",
      link: "/me/",
    },
    {
      name: "Articles",
      link: "/blog/",
    },
    {
      name: "Portfolio",
      link: "/portfolio/",
    },
  ],
  themeColor: "#3F80FF",
  backgroundColor: "#ffffff",
}

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === "/") {
  config.pathPrefix = ""
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, "")}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === "/")
  config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== "/")
  config.siteRss = `/${config.siteRss}`

module.exports = config
