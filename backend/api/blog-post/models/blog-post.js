const emailUtil = require('../../../util/email');

const createOrUpdateHook = async function(type, blog_post, data) {
  /**
   * Verify the post is "complete" before sending out the notification.
   */
  if (blog_post.public && 
      !blog_post.notifications_sent && 
      blog_post.title && 
      blog_post.slug &&
      blog_post.tagline && 
      blog_post.description && 
      blog_post.content) {
    console.log(`Blog post created or updated: ${type}`, data);
    console.log('Sending update to users with notifications enabled...');

    const allUsers = await strapi.query('user', 'users-permissions').find({ _limit: 1000 });

    // Send email to all users who have it enabled.
    const allUsersFiltered = allUsers.filter(user => !user.settings || !user.settings.notifications || user.settings.notifications.newBlogPosts);

    const emailResponse = await emailUtil.sendEmail({ users: allUsersFiltered }, 'new_blog_post', {
      id: blog_post.id.toString(),
      slug: blog_post.slug,
      title: blog_post.title,
      description: blog_post.description,
      tagline: blog_post.tagline
    }, 'New Blog Post');

    console.log('Updating the blog post data to set notifications_sent to true...');

    await strapi.query('blog-post').update({ id: blog_post.id }, {
      notifications_sent: true
    });
  } else if (blog_post.public) {
    console.warn(`Not sending notifications for ${blog_post.title} due to title, tagline, description, or content not being populated or they have already been sent.`, {
      notifications_sent: blog_post.notifications_sent,
      title: blog_post.title,
      tagline: blog_post.tagline,
      description: blog_post.description,
      content: !!blog_post.content
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