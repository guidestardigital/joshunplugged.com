<template>
  <div class="blog-series-cards">
    <div class="series-card"
                  v-for="blogSeries in blogSeriess"
                  :style="{'background-color': blogSeries.background_color}"
                  :key="blogSeries.id">
      <div class="image-container">
        <image-sized :image="blogSeries.image_header" :size="small" />
      </div>
      <div class="text-block">
        <nuxt-link class="story-title" :to="{ name: 'series-slug', params: {slug: blogSeries.slug} }">{{ blogSeries.title }}</nuxt-link>
        <div class="date-count-block">
          <div class="date"
               v-if="blogSeries.manually_published_at">{{ publishedAtFormatted(blogSeries.manually_published_at) }}</div>
          <div class="count">{{blogSeries.blog_posts.length}} Part Series</div>
        </div>
        <div class="description"
             v-html="$md.render(blogSeries.description)"
             v-if="blogSeries.description">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import './BlogSeriessCards.scss';
  import ImageSized from '~/components/images/ImageSized';

  export default {
    components: {ImageSized},
    methods: {
      publishedAtFormatted(published_at) {
        return published_at ? moment(published_at).format('MMMM Do YYYY') : '';
      }
    },
    props: {
      blogSeriess: Array
    }
  };
</script>
