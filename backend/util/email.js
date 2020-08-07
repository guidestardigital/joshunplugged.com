const replace = require('prop-replace').replace;

module.exports = {
  async sendMasterEmail(emailTemplateTag, variables) {
    console.log(strapi.config);

    this.sendEmail({ 
      toEmails: [strapi.config.custom.masterEmail]
    }, emailTemplateTag, variables);
  },
  async sendEmail({ toUserIds = undefined, toEmails = undefined, users = undefined }, emailTemplateTag, variables) {
    const emailTemplate = await strapi.query('email-template').findOne({ tag: emailTemplateTag });

    variables = {
      url: strapi.config.server.url,
      ...variables,
    }

    if (!emailTemplate || !emailTemplate.enabled) {
      console.error(`Did NOT send email to '${toEmails ? toEmails.join('') : ''}' and '${toUserIds ? toUserIds.join(',') : ''}' and '${users ? users.map(u => u.email).join(',') : ''}'. emailTemplate ${emailTemplateTag} could not be found or was disabled.`);

      return Promise.resolve(undefined);
    }

    if (!emailTemplate.body || !emailTemplate.subject) {
      console.error(`Did NOT send email to '${toEmails ? toEmails.join('') : ''}' and '${toUserIds ? toUserIds.join(',') : ''}' and '${users ? users.map(u => u.email).join(',') : ''}'. emailTemplate was not properly populated.`);

      return 
    }

    let finalToEmails = [];

    if (toUserIds) {
      users = await strapi.query('user').find({ id_in: toUserIds.map(id => parseInt(id)) });

      finalToEmails = users.map(u => u.email);
    }

    const emailToUserMap = {};

    if (users) {
      users.forEach(u => emailToUserMap[u.email] = u);

      finalToEmails = [...finalToEmails, ...users.map(u => u.email)];
    }

    if (toEmails) {
      finalToEmails = [...finalToEmails, ...toEmails];
    }

    if (!finalToEmails.length) {
      console.error('No email addresses or valid toUserIds specified!');

      return Promise.resolve(undefined);
    }

    const fromEmail = emailTemplate.custom_from_email || strapi.config.custom.noReplyEmail;

    const finalResults = Promise.all(finalToEmails.map(toEmail => {
      const user = emailToUserMap[toEmail];

      const finalVariables = {
        ...variables,
        user_username: user && user.username,
        user_first_name: user && user.first_name,
        user_last_name: user && user.last_name,
        user_email: user && user.email
      };

      const subject = replace(emailTemplate.subject, finalVariables);
      const body = replace(emailTemplate.body, finalVariables);
      
      console.log(`Sending email to ${toEmail} about ${subject}`, finalVariables);

      return strapi.plugins['email'].services.email.send({
        to: toEmail,
        from: fromEmail,
        subject,
        text: body
      });
    }));

    return finalResults;
  }
};
