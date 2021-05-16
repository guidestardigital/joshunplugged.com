<template>
  <div class="page blog-series">
    <div v-if="hasHeader"
         class="hero"
         :style="blogSeriesStyle">
      <div class="svg" v-if="showStarSvg">
        <object type="image/svg+xml" data="/star-animated.svg"></object>
      </div>
    </div>
    <div class="contents">
      <div class="header">
        <div class="content-title-block">
          <div class="content-title">{{ title }}</div>
          <div class="content-date">{{ publishedAtFormatted }}</div>
          <div class="content-description"
               v-if="description"
               v-html="$md.render(description)"/>
        </div>
      </div>
      <div class="content-section">
        <BlogPostsCards :blogPosts="blogPosts"
                        sortKey="blog_series_order"
                        :showSeriesLink="false"
                        v-if="blogPosts.length"/>
        <div v-else>
          <h2>No public posts in this series yet.</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blogSeriesBySlugQuery from '~/apollo/queries/blogSeries/blogSeriesBySlug.gql';
import BlogPostsCards from '~/components/BlogPostsCards';
import moment from 'moment';
import Loader from '~/components/Loader';
import './_slug.scss';

export default {
  data() {
    return {
      blogSeries: [],
      imageBaseUri: process.env.IMAGE_BASE_URI || '',
      loading: 0
    };
  },
  components: {
    BlogPostsCards,
    Loader
  },
  computed: {
    showStarSvg() {
      return this.blogSery ? this.blogSery.show_star_svg : false;
    },
    description() {
      return this.blogSery ? this.blogSery.description : '';
    },
    blogSery() {
      return this.blogSeries ? this.blogSeries[0] : undefined;
    },
    title() {
      return this.blogSery ? this.blogSery.title : '';
    },
    hasHeader() {
      return this.blogSery ? (this.blogSery.image_header || this.blogSery.background_color) : false;
    },
    blogPosts() {
      if (!this.blogSery) return [];
      if (!this.blogSery.blog_posts) return [];

      return this.blogSery.blog_posts.filter(bp => bp.public);
    },
    publishedAtFormatted() {
      return (this.blogSery && this.blogSery.manually_published_at) ? moment(this.blogSery.manually_published_at).format('MMMM Do YYYY') : '';
    },
    blogSeriesStyle() {
      if (this.blogSery && this.blogSery.image_header) {
        return {
          'background-image': `url(${this.imageBaseUri + this.blogSery.image_header.url})`
        };
      }

      return {
        'background-color': blogSery.background_color || '#ccc'
      };
    },
  },
  apollo: {
    blogSeries: {
      prefetch: true,
      query: blogSeriesBySlugQuery,
      variables() {
        return {slug: this.$route.params.slug};
      }
    }
  }
};
</script>
