const emailUtil = require('../../../util/email');

const createOrUpdateHook = async function(type, book_review, data) {
  /**
   * Verify the post is "complete" before sending out the notification.
   */
  if (book_review.public && 
      !book_review.notifications_sent && 
      book_review.title && 
      book_review.slug &&
      book_review.description && 
      book_review.content) {
    console.log(`Book review created or updated: ${type}`, data);
    console.log('Sending update to users with notifications enabled...');

    const allUsers = await strapi.query('user', 'users-permissions').find({ _limit: 1000 });

    // Send email to all users who have it enabled.
    const allUsersFiltered = allUsers.filter(user => !user.settings || !user.settings.notifications || user.settings.notifications.newBlogPosts);

    const emailResponse = await emailUtil.sendEmail({ users: allUsersFiltered }, 'new_book_review', {
      id: book_review.id.toString(),
      slug: book_review.slug,
      title: book_review.title,
      description: book_review.description,
      tagline: book_review.tagline
    }, 'New Book Review');

    console.log('Updating the book review data to set notifications_sent to true...');

    await strapi.query('book-review').update({ id: book_review.id }, {
      notifications_sent: true
    });
  } else if (book_review.public) {
    console.warn(`Not sending notifications for ${book_review.title} due to title, description, or content not being populated or they have already been sent.`, {
      notifications_sent: book_review.notifications_sent,
      title: book_review.title,
      description: book_review.description,
      content: !!book_review.content
    });
  }
 };

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      await createOrUpdateHook('afterCreate', result, data);
    },
    async afterUpdate(result, data) {
      await createOrUpdateHook('afterUpdate', result, data);
    }
  }
};