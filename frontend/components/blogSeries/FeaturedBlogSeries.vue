<template>
  <div class="featured-blog-series inverted">
    <div class="image-container">
      <image-sized :image="blogSeries.image_header" />
      <div class="svg" v-if="showStarSvg">
        <object type="image/svg+xml" data="/star-animated.svg"></object>
      </div>
    </div>
    <div class="title-container">
      <h1 class="title">
        <nuxt-link :to="`/series/${blogSeries.slug}`">{{blogSeries.title}}</nuxt-link>
      </h1>
      <div class="description" v-html="$md.render(blogSeries.description || '')" />
      <nuxt-link :to="`/series/${blogSeries.slug}`">Click to read</nuxt-link>
    </div>
  </div>
</template>
<script>
import './FeaturedBlogSeries.scss';
import ImageSized from '~/components/images/ImageSized';

export default {
  components: {ImageSized},
  props: {
    blogSeries: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    showStarSvg() {
      return this.blogSeries ? this.blogSeries.show_star_svg : false;
    }
  }
};
</script>
