<template>
  <div class="page person-page"
       v-if="person">
    <div class="contents" id="top">
      <div class="header">
        <div class="content-title-block">
          <div class="content-super-title"><nuxt-link :to="{ name: 'people'}">People</nuxt-link></div>
          <div class="content-title">{{ person.first_name }} {{person.last_name}}</div>
          <div class="content-description">{{ person.description }}</div>
          <div class="item"
              v-if="person.homepage">
            <a :href="person.homepage.url"
              target="_blank">{{ person.homepage.title }}</a>
          </div>
          <div class="content-title-image" v-if="person.avatar">
            <img :src="person.avatar.url" />
          </div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-title center">Biography</div>
        <div v-if="person.content"
              class="blog-markdown-content"
              v-html="$md.render(person.content)"></div>
      </div>

      <div class="content-section"
          v-if="person.quotes && person.quotes.length">
        <div class="section-title center">Quotes</div>
        <Quote :quote="quote"
          :key="quote.id"
          :showLocation="true"
          :showBookReview="true"
          v-for="quote in person.quotes" />
      </div>

      <div class="content-section"
          v-if="person.media && person.media.length">
        <div class="section-title center">Recommended Media</div>
        <div class="medias">
          <Media :media="media"
                :key="media.id"
                v-for="media in person.media" />
        </div>
      </div>

      <div class="content-section"
          v-if="person.book_reviews && person.book_reviews.length">
        <div class="section-title center">Reviews of Books by {{ person.first_name}} {{ person.last_name }}</div>
        <BookReviewPostCards :bookReviews="person.book_reviews" />
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
  import Media from "~/components/Media";
  import Quote from "~/components/Quote";
  import CommentThread from '~/components/CommentThread';
  import BookReviewPostCards from '~/components/BookReviewPostCards';

  import { pageHeadAndOG } from '~/util/seo';
  import { createComment } from '~/util/comments';

  const moment = require("moment");

  export default {
    data() {
      return {
        loading: 0,
        commentThreadKey: 0
      };
    },
    components: {
      Link,
      Quote,
      Media,
      CommentThread,
      BookReviewPostCards
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
        loadingKey: 'loading',
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
