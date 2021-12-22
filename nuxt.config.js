export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Desa Digital - Content Management System',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
      { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }
    ],
    script: [
      {
        src: '/newrelic.js'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/global.postcss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/jds-design-system.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    'nuxt-windicss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/svg'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL_STAGING + '/' + process.env.API_VERSION
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'data.access_token'
        },
        user: {
          property: 'data'
        },
        refreshToken: {
          property: 'data.refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 10 * 1
        },
        endpoints: {
          login: { url: '/auth/users/sign-in', method: 'post' },
          refresh: { url: '/auth/users/refresh-token', method: 'post' },
          logout: { url: '/auth/users/sign-out', method: 'post' },
          user: { url: '/auth/users/me', method: 'post' }
        }
      }
    }
  },

  googleFonts: {
    families: {
      Lato: {
        wght: [100, 300, 400, 700, 900],
        ital: [100, 300, 400, 700, 900]
      },
      Roboto: {
        wght: [100, 300, 400, 500, 700, 900],
        ital: [100, 300, 400, 500, 700, 900]
      },
      Lora: {
        wght: [400, 500, 600, 700],
        ital: [400, 500, 600, 700]
      }
    },
    display: 'swap'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      '@jabardigitalservice/jds-design-system'
    ],
    postcss: {
      plugins: {
        'postcss-import': true
      }
    }
  }
}
