# Wizard Template

Welcome to the wizard template. Are you a Machine Learning enthusiast or a Data Science enthusiast and want to create your own portfolio website ? Then you are in the right repo. 

Wizard template is an **open source** static site generator template based on [Gatsby](https://www.gatsbyjs.org/). The core of the website is based on React JS. To use this template you don't need to have any knowledge of programming until and unless you wish to have your own design. The basic requirement for using this template is the knowledge of [markdown syntax](https://www.markdownguide.org/basic-syntax/), which is really easy to understand.

## Creating a Page

In order to understand this section to a full extent please make sure that you have some basic knowledge of markdown files. This section shows how to create a page for your website using this layout.

In order to create a page for your website, make sure you create a **md** file in **/content/pages** folder. All your pages, posts, etc go in the content folder. If you have no background of coding **content** folder is what you have to look for. The most important thing is to make sure that you enter correct front matter. Suppose you want to create a page named "About me":

```aboutme.md
---
title: About me
template: page
---
```

Everything between --- is front matter. The most important key here is template. Based on on what value you give to template the page renders to that particular format. See I told you it is this easy to create a page. You are done here! Following the front matter write your content like you were writing in some word document. For example this is my [About me](https://www.uditsamani.com/me/) page. 

## Creating a Post page



