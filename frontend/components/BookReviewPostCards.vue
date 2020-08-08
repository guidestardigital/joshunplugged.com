<template>
  <div class="story-cards-container">
    <div v-for="bookReview in bookReviewsSorted"
         :key="bookReview.id">
      <div class="story-card">
        <div class="image-container contain">
          <img :src="bookReview.cover.url" 
                :alt="bookReview.title" 
                class="image"
                v-if="bookReview.cover" />
        </div>
        <div class="text-block">
          <nuxt-link :to="{ name: 'bookReviews-slug', params: {slug: bookReview.slug} }"
                        class="story-title">{{ bookReview.title }}</nuxt-link>
          <div class="date-count-block">
            <div class="date"
                  v-if="bookReview.published_at">Reviewed {{ publishedAtFormatted(bookReview.published_at) }}</div>
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

  export default {
    methods: {
      publishedAtFormatted(published_at) {
        return !published_at ? '' : moment(published_at).format('MMMM Do YYYY');
      }
    },
    computed: {
      bookReviewsSorted() {
        return this.bookReviews.sort((a, b) => {
          if (a.published_at && b.published_at) {
            if (a.published_at === b.published_at) {
              return a.title < b.title ? 1 : -1;
            }

            return new Date(a.published_at).getTime() > new Date(b.published_at).getTime() ? -1 : 1;
          } else if (a.published_at) {
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
