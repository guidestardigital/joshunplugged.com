'use strict';
const emailUtil = require('../../../util/email');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const createOrUpdateHook = async function(type, commentThread, data) {
  console.log(`Comment thread created or updated: ${type}`, commentThread);

  const sortedComments = commentThread.comments.slice().sort((a, b) => {
    return a.created_at.getTime() < b.created_at.getTime() ? -1 : 1;
  });

  const mostRecentComment = sortedComments.pop();
  console.log(mostRecentComment);

  const mostRecentCommenter = await strapi.query('user', 'users-permissions').findOne({ id: mostRecentComment.user });
  console.log(mostRecentCommenter);

  // Send master email to myself, saying a comment thread was updated
  let url_postfix, title;

  if (commentThread.blog_post) {
    url_postfix = `/blogPost/${commentThread.blog_post.slug}`;
    title = commentThread.blog_post.title;
  } else if (commentThread.book_review) {
    url_postfix = `/bookReviews/${commentThread.book_review.slug}`;
    title = commentThread.book_review.title;
  }  else if (commentThread.person) {
    url_postfix = `/person/${commentThread.person.slug}`;
    title = commentThread.person.first_name + ' ' + commentThread.person.last_name;
  }

  const emailResponse = await emailUtil.sendMasterEmail('new_comment_master', {
    blog_post_id: commentThread.blog_post ? commentThread.blog_post.id.toString() : '-1',
    blog_review_id: commentThread.book_review ? commentThread.book_review.id.toString() : '-1',
    person_id: commentThread.person ? commentThread.person.id.toString() : '-1',
    url_postfix,
    title,
    most_recent_comment_text: mostRecentComment.text,
    most_recent_comment_is_clean: mostRecentComment.text === mostRecentComment.text_uncleaned ? 'yes' : 'no',
    most_recent_comment_text_uncleaned: mostRecentComment.text_uncleaned,
    most_recent_comment_username: mostRecentCommenter.username
  });
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
