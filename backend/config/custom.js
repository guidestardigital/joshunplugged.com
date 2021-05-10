module.exports = ({ env }) => {
  console.log('Initializing custom.js...')

  return {
    masterEmail: env('MASTER_EMAIL') || 'joshua.p.jung@gmail.com',
    noReplyEmail: env('NO_REPLY_EMAIL') || 'no-reply@joshunplugged.com'
  };
};
