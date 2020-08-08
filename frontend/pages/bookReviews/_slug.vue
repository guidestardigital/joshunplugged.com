<template>
  <div class="book-review" v-if="!bookReview">
    Error: this book review had an error or it does not exist.
  </div>
  <div class="book-review" v-else>
    <div class="layout-content" id="top">
      <div class="content-header">
        <div class="content-title-block">
          <div class="content-super-title"><nuxt-link :to="{ name: 'bookReviews'}">Book Review</nuxt-link></div>
          <div class="content-title">{{ bookReview.title }}</div>
          <div class="content-sub-block-horizontal-wrapped">
            <div class="content-horizontal item" v-if="bookPublishedDateFormatted">Published {{ bookPublishedDateFormatted }}</div>
            <div class="content-horizontal item"
                  v-if="bookReview.authors && bookReview.authors.filter(a => a.public).length">
              Author(s):&nbsp;
              <nuxt-link v-for="person in bookReview.authors.filter(a => a.public)"
                        :key="person.id"
                        :to="{ name: 'person-slug', params: {slug: person.slug} }">{{person.first_name}} {{person.last_name}}</nuxt-link>
            </div>
            <div class="content-horizontal item"
                  v-if="bookReview.topics">
              Topics:
              <div class="chip" v-for="topic in  bookReview.topics.split(',')" :key="topic">{{ topic }}</div>
            </div>
          </div>
          <div class="content-date" v-if="publishedAtFormatted">Review written {{ publishedAtFormatted }}</div>
          <div class="content-title-image" v-if="bookReview.cover">
            <img :src="bookReview.cover.url" />
          </div>
        </div>
      </div>

      <div class="content-section"
           v-if="bookReview.content" >
        <div class="section-title center">Review</div>
        <div class="blog-markdown-content"
             v-html="$md.render(bookReview.content)"></div>
      </div>

      <div class="content-section"
           v-if="bookReview.opinion">
        <div class="section-title center">Opinion</div>
        <div class="blog-markdown-content"
             v-html="$md.render(bookReview.opinion)"></div>
      </div>

      <div class="content-section"
           v-if="bookReview.quotes && bookReview.quotes.length">
        <div class="section-title center">Book Quotes</div>
        <Quote :quote="quote"
               :key="quote.id"
               v-for="quote in bookReview.quotes" />
      </div>

      <div class="content-section" id="comments">
        <!-- Comment Thread -->
        <CommentThread :threadId="bookReview.comment_thread ? bookReview.comment_thread.id : '-1'"
                       :key="commentThreadKey"
                       @replyCreated="commentThread_replyCreated" />
      </div>
    </div>
  </div>
</template>

<script>
  import bookReviewQuery from "~/apollo/queries/bookReview/bookReview";
  
  import Quote from "~/components/Quote";
  import Link from "~/components/Link";
  import CommentThread from '~/components/CommentThread';
  import { pageHeadAndOG } from '~/util/seo';
  import { createComment } from '~/util/comments';
  import { publishedAt } from '~/util/dates';

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
          linkToBookReviewId: this.bookReview.id
        }).then(commentThread => {
          this.bookReview.comment_thread = commentThread;
          this.commentThreadKey++; // Force a refresh of the comment thread
        })
      }
    },
    computed: {
      bookPublishedDateFormatted() {
        return publishedAt(this.bookReview.book_published_date);
      },
      publishedAtFormatted() {
        return publishedAt(this.bookReview.published_at);
      },
      bookReview() {
        return this.bookReviews ? this.bookReviews[0] : undefined;
      }
    },
    apollo: {
      bookReviews: {
        prefetch: false,
        query: bookReviewQuery,
        variables() {
          return { slug: this.$route.params.slug };
        }
      }
    },
    head () {
      const title = this.bookReview ? (this.bookReview.title ? this.bookReview.title + ' / Book Review' : 'Book Review') : 'Title Error';
      const description = this.bookReview ? (this.bookReview.description ? this.bookReview.description : 'No description available') : 'Description Error';
      const imageHeader = this.bookReview ? (this.bookReview.cover ? this.bookReview.cover.url : '') : '';

      return pageHeadAndOG(title, description, imageHeader);
    }
  };
</script>