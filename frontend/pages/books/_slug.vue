<template>
  <div class="page book-review" v-if="bookReview">
    <div class="contents" id="top">
      <div class="header">
        <div class="content-title-block">
          <div class="content-title">{{ bookReview.title }}</div>
          <div class="content-sub-block-horizontal-wrapped">
            <div class="content-horizontal item">
              <Rating :rating="bookReview.rating" />
            </div>
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
          v-if="bookReviewQuotesSorted">
        <div class="section-title center">Book Quotes</div>
        <Quote :quote="quote"
              :key="quote.id"
              :showLocation="true"
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
  import Rating from "~/components/Rating";
  import CommentThread from '~/components/CommentThread';
  import { pageHeadAndOG } from '~/util/seo';
  import { createComment } from '~/util/comments';
  import { publishedAt } from '~/util/dates';

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
      Rating,
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
      },
      bookReviewQuotesSorted() {
        if (this.bookReview.quotes && this.bookReview.quotes.length) {
          return this.bookReview.quotes.sort((a, b) => {
            if (a.book_order && b.book_order) {
              return a.book_order > b.book_order ? 1 : -1;
            }

            return a.book_order ? 1 : -1;
          })
        }
      }
    },
    apollo: {
      bookReviews: {
        prefetch: true,
        query: bookReviewQuery,
        loadingKey: 'loading',
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
