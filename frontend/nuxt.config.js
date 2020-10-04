var envPath = require('find-config')('.env', { module: true });

require('dotenv').config({ path: envPath });

console.log('-----------------------------------------------------------------');
console.log(`Loading from ${envPath}:`)
console.log(` IMAGE_BASE_URI: ${process.env.IMAGE_BASE_URI}`)
console.log(` BLOG_API_BASE: ${process.env.BLOG_API_BASE}`)
console.log('-----------------------------------------------------------------');

module.exports = {
  mode: 'universal',
  env: {
    IMAGE_BASE_URI: process.env.IMAGE_BASE_URI || '',
    BLOG_API_BASE: process.env.BLOG_API_BASE || 'BLOG_API_BASE',
    BLOG_TITLE: process.env.BLOG_TITLE || 'BLOG_TITLE'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.BLOG_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:title', name: 'og:title', content: process.env.BLOG_TITLE },
      { hid: 'og:image', name: 'og:image', content: 'https://cdn.britannica.com/84/73184-004-E5A450B5/Sunflower-field-Fargo-North-Dakota.jpg' },
      { hid: 'og:image', name: 'og:description', content: process.env.BLOG_DESCRIPTION },
      { hid: 'og:image', name: 'og:url', content: 'https://www.' + process.env.BLOG_DOMAIN },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/prism.min.js'},
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/prism-css.min.js'},
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/prism-javascript.min.js'},
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/prism-c.min.js'},
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/prism-markup.min.js'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism.min.css'}
    ]
  },
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Staatliches' }
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@assets/css/main.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/bulma',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/markdownit',
    '@nuxtjs/auth',
    '@nuxtjs/proxy'
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/local',
            method: 'post',
            propertyName: 'jwt'
          },
          user: {
            url: '/users/me', 
            method: 'get', 
            propertyName: false
          }
        },
        tokenName: 'Authorization',
        tokenType: 'Bearer'
      }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BLOG_API_BASE,
    credentials: true
  },
  apollo: {  
    clientConfigs: {
      default: {
        httpEndpoint: process.env.BLOG_API_BASE ? process.env.BLOG_API_BASE + '/graphql' : "http://localhost:1337/graphql"
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config) {
      config.devtool = '#source-map'
    }
  },
  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    injected: true,
    html:         true,        // Enable HTML tags in source
    xhtmlOut:     true,        // Use '/' to close single tags (<br />).
                                // This is only for full CommonMark compatibility.
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    linkify:      false,        // Autoconvert URL-like text to links
  
    // Enable some language-neutral replacement + quotes beautification
    typographer:  false,
  
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',
  },
  router: {
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        setTimeout(() => {
          window.scrollTo({ 
            top: document.querySelector(to.hash).offsetTop, 
            behavior: 'smooth'
          });
        },100);
      }

      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
