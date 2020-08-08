import createCommentQuery from "~/apollo/queries/comments/createComment";
import createCommentThread from "~/apollo/queries/commentThreads/createCommentThread";
import updateCommentThread from "~/apollo/queries/commentThreads/updateCommentThread";

export const createComment = function($apollo, { 
    userId, 
    commentText, 
    commentThread = undefined, 
    linkToBlogPostId = undefined, 
    linkToBookReviewId = undefined,
    linkToPersonId = undefined 
  }) {
    return new Promise((resolve, reject) => {
      $apollo.mutate({
        mutation: createCommentQuery,
        variables: {
          commentInput: {
            user: userId,
            text: commentText
          }
        }
      }).then(response => {
        console.log('New Comment created', response.data)

        const newCommentId = response.data.createComment.comment.id;

        if (!commentThread) {
          // Create NEW Thread
          $apollo.mutate({
            mutation: createCommentThread,
            variables: {
              commentThreadInput: {
                blog_post: linkToBlogPostId,
                book_review: linkToBookReviewId,
                person: linkToPersonId,
                comments: [newCommentId]
              }
            }
          }).then(response => {
            // Return the entire new comment thread object.
            console.log('New Comment Thread created', response.data)
            resolve(response.data.createCommentThread.commentThread);
          });
        } else {
          // Update EXISTING Thread
          $apollo.mutate({
            mutation: updateCommentThread,
            variables: {
              threadId: commentThread.id,
              commentThreadInput: {
                comments: [
                  ...commentThread.comments.map(c => c.id),
                  response.data.createComment.comment.id
                ]
              }
            }
          }).then(response => {
            console.log('Comment Thread updated', response.data)
            resolve(response.data.updateCommentThread.commentThread);
          });
        }
      });
    });
  };