<template>
  <div class="story-cards-container">
    <div v-for="blogPost in blogPostsSorted"
         :style="{'background-color': blogPost.background_color}"
         :key="blogPost.id">
      <div class="story-card">
          <div class="image-container">
            <img :src="imageBaseUri + images[0].image.url" 
                 alt="Default background" 
                 class="image"
                 v-if="!blogPost.image_header && blogPost.use_default_post_background && images.length">
            <img :src="imageBaseUri + blogPost.image_header.url" 
                 alt="" 
                 class="image"
                 v-if="blogPost.image_header">
          </div>
          <div class="text-block">
            <div v-if="blogPost.postCategory" class="uk-text-uppercase">{{ blogPost.postCategory.name }}</div>
            <nuxt-link :to="{ name: 'blogPosts-id', params: {id: blogPost.id} }"
                         class="story-title">{{ blogPost.title }}</nuxt-link>
            <div class="date-count-block">
              <div class="date"
                  v-if="blogPost.published_at">{{ publishedAtFormatted(blogPost.published_at) }}</div>
              <div class="count"
                   v-if="!!blogPost.blog_series">{{blogPost.blog_series_order}} of {{blogPost.blog_series.blog_posts.length}}
                <nuxt-link v-if="showSeriesLink"
                             :to="{ name: 'blogSeries-id', params: {id: blogPost.blog_series.id} }"
                             class="story-title">in {{blogPost.blog_series.title}}</nuxt-link>
              </div>
            </div>
            <div class="description" 
                 v-if="blogPost.show_description && blogPost.description" 
                 :style="{ 'color': blogPost.foreground_color }">
              {{ blogPost.description }}
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import imagesQuery from "~/apollo/queries/image/images.gql";

  export default {
    data: function() {
      return {
        images: [],
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
    computed: {
      blogPostsSorted() {
        if (this.sortKey === 'published_at') {
          return this.blogPosts.sort((a, b) => {
            if (a.published_at && b.published_at) {
              if (a.published_at === b.published_at) {
                return a.blog_series_order < b.blog_series_order ? 1 : -1;
              }

              return new Date(a.published_at).getTime() > new Date(b.published_at).getTime() ? -1 : 1;
            } else if (a.published_at) {
              return 1;
            }
            return -1;
          });
        } else if (this.sortKey === 'blog_series_order') {
          return this.blogPosts.sort((a, b) => a.blog_series_order > b.blog_series_order ? 1 : -1);
        }

        return this.blogPosts;
      }
    },
    props: {
      blogPosts: Array,
      sortKey: {
        default: 'published_at',
        type: String
      },
      showSeriesLink: {
        type: Boolean,
        default: true
      }
    },
    apollo: {
      images: {
        prefetch: true,
        query: imagesQuery,
        variables() {
          return { target: 'default_blog_post_background' };
        }
      }
    }
  };
</script>
