const { FALSE } = require('node-sass');

var envPath = require('find-config')('.env', { module: true });

require('dotenv').config({ path: envPath });

console.log('-----------------------------------------------------------------');
console.log(`Loading from ${envPath}:`)
console.log(` API_DOMAIN: ${process.env.API_DOMAIN}`)
console.log(` API_DOMAIN_NUXT_OVERRIDE: ${process.env.API_DOMAIN_NUXT_OVERRIDE}`)
console.log(` BUILD_VERSION: ${process.env.BUILD_VERSION}`)
console.log('-----------------------------------------------------------------');

module.exports = {
  telemetry: false,
  server: {
    host: "0.0.0.0"
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Josh Unplugged',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:title', name: 'og:title', content: 'Josh Unplugged'},
      { hid: 'og:image', name: 'og:image', content: 'https://cdn.britannica.com/84/73184-004-E5A450B5/Sunflower-field-Fargo-North-Dakota.jpg' },
      { hid: 'og:image', name: 'og:description', content: 'Christianity, Paranormal, and Theology.' },
      { hid: 'og:image', name: 'og:url', content: 'https://www.joshunplugged.com' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat&family=Newsreader:wght@200;300;400;500&display=swap' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'}
    ]
  },
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
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/markdownit',
    '@nuxtjs/auth-next'
  ],
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/local',
            method: 'post'
          },
          user: {
            url: '/users/me',
            method: 'get',
          }
        },
        user: {
          property: false,
          autoFetch: true
        },
        token: {
          required: true,
          name: 'Authorization',
          type: 'Bearer',
          property: 'jwt'
        }
      }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    //credentials: true
  },
  apollo: {
    clientConfigs: {
      default: '~/nuxt.config.apollo.js'
    },
    errorHandler: '~/nuxt.config.apollo.errors.js'
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
  publicRuntimeConfig: {
    apiDomain: process.env.API_DOMAIN,
    buildVersion: process.env.BUILD_VERSION || 'development',
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
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
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID
  }
}
