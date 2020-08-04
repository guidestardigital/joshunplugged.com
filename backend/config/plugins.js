module.exports = ({ env }) => ({
  email: {
    provider: 'mailgun',
    providerOptions: {
      host: 'api.eu.mailgun.net',
      apiKey: env('MAILGUN_API_KEY'),
      domain: env('MAILGUN_DOMAIN'), //Required if you have an account with multiple domains
    },
    settings: {
      defaultFrom: 'josh@joshunplugged.com',
      defaultReplyTo: 'joshua.p.jung@protonmail.com',
    },
  },
});