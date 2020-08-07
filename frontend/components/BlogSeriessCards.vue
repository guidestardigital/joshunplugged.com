<template>
  <div class="story-cards-container">
    <div class="story-card"
                  v-for="blogSeries in blogSeriess"
                  :style="{'background-color': blogSeries.background_color}"
                  :key="blogSeries.id">
      <div class="image-container">
        <img class="image" 
             :src="imageBaseUri + blogSeries.image_header.url" 
             alt=""
             v-if="blogSeries.image_header">
      </div>
      <div class="text-block">
        <nuxt-link class="story-title" :to="{ name: 'blogSeries-id', params: {id: blogSeries.id} }">{{ blogSeries.title }}</nuxt-link>
        <div class="date-count-block">
          <div class="date" 
               v-if="blogSeries.published_at">{{ publishedAtFormatted(blogSeries.published_at) }}</div>
          <div class="count">{{blogSeries.blog_posts.length}} Part Series</div>
        </div>
        <div class="description" 
            v-if="blogSeries.description">
          {{ blogSeries.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    data() {
      return {
        imageBaseUri: process.env.IMAGE_BASE_URI || ''
      }
    },
    methods: {
      publishedAtFormatted(published_at) {
        if (!published_at) {
          return '';
        }

        return moment(published_at).format('MMMM Do YYYY');
      }
    },
    props: {
      blogSeriess: Array
    }
  };
</script>
