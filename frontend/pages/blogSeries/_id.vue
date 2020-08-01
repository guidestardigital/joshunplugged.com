<template>
  <Loader :loading="loading || !blogSery">
    <div class="blog-series" v-if="!!blogSery">
      <div v-if="blogSery.image_header || blogSery.background_color"
          class="hero blog-series-hero"
          :style="{ 'background-color': blogSery.background_color }"
          :data-src="blogSery.image_header ? imageBaseUri + blogSery.image_header.url : undefined"
          uk-img>
      </div>
      <div class="content">
        <div class="content-header">
          <div class="content-title-block">
            <div class="content-title">{{ blogSery.title }}</div>
            <div class="content-date">{{ publishedAtFormatted }}</div>
            <div class="content-description"
                v-if="!!blogSery.description"
                v-html="$md.render(blogSery.description)"/>
          </div>
        </div>
        <div class="content-section">
          <BlogPostsCards :blogPosts="blogPosts"
                          sortKey="blog_series_order"
                          :showSeriesLink="false"
                          v-if="blogSery.blog_posts && blogSery.blog_posts.length" />
          <div v-else>
            <h2>No public posts in this series yet.</h2>
          </div>
        </div>
      </div>
    </div>
  </Loader>
</template>

<script>
  import blogSeriesQuery from "~/apollo/queries/blogSeries/blogSeries.gql";
  import BlogPostsCards from "~/components/BlogPostsCards";
  import moment from 'moment';
  import Loader from "~/components/Loader";
  export default {
    data() {
      return {
        blogSery: undefined,
        imageBaseUri: process.env.IMAGE_BASE_URI || '',
        loading: 0
      };
    },
    components: {
      BlogPostsCards,
      Loader
    },
    computed: {
      blogPosts() {
        if (!this.blogSery) return undefined;
        if (!this.blogSery.blog_posts) return [];

        return this.blogSery.blog_posts;
      },
      publishedAtFormatted() {
        if (!this.blogSery.published_at) {
          return '';
        }

        return moment(this.blogSery.published_at).format('MMMM Do YYYY');
      }
    },
    apollo: {
      blogSery: {
        prefetch: false,
        loadingKey: "loading",
        query: blogSeriesQuery,
        variables() {
          return { id: parseInt(this.$route.params.id) };
        }
      }
    }
  };
</script>