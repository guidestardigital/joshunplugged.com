<template>
  <Loader :loading="loading"
          text="Loading Comments...">
    <div class="comment-thread">
      <div class="title">Comments</div>

      <!-- Comment Thread -->
      <div class="thread" 
          v-if="!!commentThread">
        <div class="comment"
            :key="comment.id"
            v-for="comment in sortedComments">
          <div class="comment-header">
            <div class="username">{{ commentUsername(comment) }}</div>
            <div class="created-at">{{ commentCreatedAt(comment) }}</div>
          </div>
          <div class="text"
               v-if="!comment.hidden">{{ comment.text }}</div>
          <div class="hidden-reason"
               v-else>
            Comment Hidden: {{ comment.hidden_reason }}
          </div>
          
        </div>
      </div>
      <!-- No Comments Yet  -->
      <div class="no-comments" v-else>
        No comments yet. Be the first to comment!
      </div>

      <!-- Reply Input -->
      <div class="reply" 
          v-if="userLoggedIn">
        <textarea class="reply-input"
                  v-model="reply" />
        <div class="controls">
          <button class="reply-button"
                  v-on:click="replyButton_clickHandler">Submit</button>
        </div>
        <TextByTag classPass="comment-notice"
              tag="comment_notice" />
      </div>
      <TextByTag classPass="not-logged-in"
            tag="comment_not_logged_in"
            v-else />
    </div>
  </Loader>
</template>

<script>
  import commentThread from "~/apollo/queries/commentThreads/commentThread.gql";
  import TextByTag from "~/components/TextByTag";
  import moment from 'moment';
  import Loader from "~/components/Loader";

  export default {
    data() {
      return {
        reply: undefined,
        loading: 0
      }
    },
    components: {
      TextByTag,
      Loader
    },
    computed: {
      userLoggedIn() {
        return this.$auth.loggedIn;
      },
      sortedComments() {
        return (this.commentThread.comments || []).sort((a, b) => {
          return moment(a.created_at).valueOf() < moment(b.created_at).valueOf() ? -1 : 1;
        });
      }
    },
    methods: {
      commentUsername(comment) {
        return comment.user ? comment.user.username : 'Anonymous';
      },
      commentCreatedAt(comment) {
        return moment(comment.created_at).format('MMMM Do YYYY HH:MM:ss')
      },
      replyButton_clickHandler() {
        if (this.reply && this.reply !== '' && this.reply.length < 1024) {
          this.$emit('replyCreated', {
            replyText: this.reply,
            commentThread: this.commentThread
          });
        }
      }
    },
    props: {
      threadId: {
        type: String,
        default: "-1"
      }
    },
    apollo: {
      commentThread: {
        prefetch: false,
        query: commentThread,
        loadingKey: 'loading',
        fetchPolicy: 'no-cache',
        variables() {
          return { id: parseInt(this.threadId) }
        },
        skipQuery() {
          return parseInt(this.threadId) === -1;
        }
      }
    }
  };
</script>
