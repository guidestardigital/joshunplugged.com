module.exports = ({ env }) => {
  console.log('Initializing custom.js...')

  return {
    masterEmail: env('MASTER_EMAIL'),
    noReplyEmail: env('NO_REPLY_EMAIL')
  };
};
