<template>
  <div class="book-review-post-cards">
    <div v-for="bookReview in bookReviewsSorted"
         :key="bookReview.id">
      <div class="book-card">
        <div class="image-container contain">
          <img :src="bookReview.cover.url"
                :alt="bookReview.title"
                class="image"
                v-if="bookReview.cover" />
        </div>
        <div class="text-block">
          <nuxt-link :to="{ name: 'books-slug', params: {slug: bookReview.slug} }"
                        class="story-title">{{ bookReview.title }}</nuxt-link>
          <div class="date-count-block">
            <div class="date"
                  v-if="bookReview.manually_published_at">Reviewed {{ publishedAtFormatted(bookReview.manually_published_at) }}</div>
          </div>
          <div class="sub-block-horizontal"
                v-if="bookReview.authors && bookReview.authors.filter(a => a.public).length">
            Author(s):
            <nuxt-link v-for="person in bookReview.authors.filter(a => a.public)"
                       :key="person.id"
                       :to="{ name: 'person-slug', params: {slug: person.slug} }">{{person.first_name}} {{person.last_name}}</nuxt-link>
          </div>
          <div class="sub-block-horizontal"
                v-if="bookReview.topics">
            Topics:
            <div v-for="topic in bookReview.topics.split(',')"
                 class="chip"
                 :key="topic">{{topic}}</div>
            <Rating :rating="bookReview.rating" />
          </div>
          <div class="description"
                v-if="bookReview.description">
            {{ bookReview.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import Rating from '~/components/Rating';
  import './BookReviewPostCards.scss';

  export default {
    methods: {
      publishedAtFormatted(published_at) {
        return !published_at ? '' : moment(published_at).format('MMMM Do YYYY');
      }
    },
    components: {
      Rating
    },
    computed: {
      bookReviewsSorted() {
        return this.bookReviews.sort((a, b) => {
          if (a.manually_published_at && b.manually_published_at) {
            if (a.manually_published_at === b.manually_published_at) {
              return a.title < b.title ? 1 : -1;
            }

            return new Date(a.manually_published_at).getTime() > new Date(b.manually_published_at).getTime() ? -1 : 1;
          } else if (a.manually_published_at) {
            return 1;
          }
          return -1;
        });
      }
    },
    props: {
      bookReviews: Array,
    }
  };
</script>
