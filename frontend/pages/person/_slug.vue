<template>
  <div class="person" v-if="!person">
    Error: this person had an error or it does not exist.
  </div>
  <div class="person" v-else>
    <div class="layout-content" id="top">
      <div class="content-header">
        <div class="content-title-block">
          <div class="content-super-title"><nuxt-link :to="{ name: 'people'}">People</nuxt-link></div>
          <div class="content-title">{{ person.first_name }} {{person.last_name}}</div>
          <div class="content-description">{{ person.description }}</div>
          <div class="item"
               v-if="person.homepage">
            <a :href="person.homepage.url" 
               target="_blank">{{ person.homepage.url }}</a>
          </div>
          <div class="content-title-image" v-if="person.avatar">
            <img :src="person.avatar.url" />
          </div>
        </div>
      </div>

      <div class="content-section">
        <div v-if="person.content" 
              class="blog-markdown-content"
              v-html="$md.render(person.content)"></div>
      </div>

      <div class="content-section"
           v-if="person.quotes && person.quotes.length">
         <div class="section-title center">Quotes</div>
        <Quote :quote="quote"
           :key="quote.id"
           v-for="quote in person.quotes" />
      </div>

      <div class="content-section" id="comments">
        <!-- Comment Thread -->
        <CommentThread :threadId="person.comment_thread ? person.comment_thread.id : '-1'"
                       :key="commentThreadKey"
                       @replyCreated="commentThread_replyCreated" />
      </div>
    </div>
  </div>
</template>

<script>
  import personQuery from "~/apollo/queries/people/person";
  
  import Link from "~/components/Link";
  import Quote from "~/components/Quote";
  import CommentThread from '~/components/CommentThread';
  import { pageHeadAndOG } from '~/util/seo';
  import { createComment } from '~/util/comments';
  
  const moment = require("moment");

  export default {
    data() {
      return {
        commentThreadKey: 0
      };
    },
    components: {
      Link,
      Quote,
      CommentThread
    },
    methods: {
      commentThread_replyCreated(reply) {
        createComment(this.$apollo, {
          userId: this.$auth.user.id, 
          commentText: reply.replyText, 
          commentThread: reply.commentThread, 
          linkToPersonId: this.person.id
        }).then(commentThread => {
          this.person.comment_thread = commentThread;
          this.commentThreadKey++; // Force a refresh of the comment thread
        })
      }
    },
    computed: {
      person() {
        return this.people ? this.people[0] : undefined;
      }
    },
    apollo: {
      people: {
        prefetch: true,
        query: personQuery,
        variables() {
          return { slug: this.$route.params.slug };
        }
      }
    },
    head () {
      const title = this.person ? (this.person.first_name + ' ' + this.person.last_name + ' / Josh Unplugged') : 'Title Error';
      const description = this.person ? (this.person.description ? this.person.description : 'No description available') : 'Description Error';
      const imageHeader = this.avatar ? (this.person.avatar ? this.person.avatar.url : '') : '';

      return pageHeadAndOG(title, description, imageHeader);
    }
  };
</script>