<template>
  <div class="blog-post">
    <div v-if="blogPost.image_header || blogPost.background_color"
         class="hero blog-post-hero"
         :style="blogPostBackgroundHeader" />

    <div class="content blog-body">
      <div class="content-header">
        <div class="blog-series-information"
            v-if="!!thisBlogSeries">
          <div class="series-intro">Part {{ blogPost.blog_series_order }} of Series</div> 
          <div class="blog-series-title">
            <router-link class="uk-link" :to="{ name: 'blogSeries-id', params: {id: thisBlogSeries.id} }">
              {{ thisBlogSeries.title }}
            </router-link>
          </div>
          <div class="blog-series-navigation"
               v-if="!!thisBlogSeries">
            <div v-for="bp in thisBlogSeriesBlogPosts"
                 :key="bp.id">
              <router-link :class="{ 'uk-link': true, 'selected': bp.id == blogPost.id}" 
                           :to="{ name: 'blogPosts-id', params: {id: bp.id} }">
                {{ bp.title }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="content-title-block">
          <div class="content-title">{{ blogPost.title }}</div>
          <div class="content-date" v-if="publishedAtFormatted">{{ publishedAtFormatted }}</div>
          <div class="content-description"
              v-if="!!blogPost.description"
              v-html="$md.render(blogPost.description)"/>
        </div>
      </div>

      <div class="content-section">
        <div v-if="blogPost.content" 
              class="blog-markdown-content"
              v-html="$md.render(blogPost.content)"></div>
      </div>

      <div class="content-section">
        <div class="blog-post-series-next-prev"
             v-if="!!thisBlogSeries">
          <div class="vertical-description-link" v-if="prevPostInSeries">
            <div class="description">Previous</div>
            <router-link class="uk-link"
                        :to="{ name: 'blogPosts-id', params: {id: prevPostInSeries.id} }">
              {{ prevPostInSeries.title }}
            </router-link>
          </div>
          <div class="vertical-description-link" v-if="nextPostInSeries">
            <div class="description">Next</div>
            <router-link class="uk-link"
                          :to="{ name: 'blogPosts-id', params: {id: nextPostInSeries.id} }">
              {{ nextPostInSeries.title }}
            </router-link>
          </div>
        </div>
        <div class="uk-container uk-container-medium blog-post-footer" v-if="blogPost.links && blogPost.links.length">
          <h3>My Recommended Links</h3>
          <div class="related-links">
            <Link :id="link.id" v-for="link in blogPost.links" :key="link.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import blogPostQuery from "~/apollo/queries/blogPost/blogPost";
  import Link from "~/components/Link";
  import blogSeriessQuery from '~/apollo/queries/blogSeries/blogSeriess'
  import Prism from 'prismjs';

  var moment = require("moment");

  export default {
    data() {
      return {
        blogPost: {},
        blogSeries: [],
        moment: moment,
        imageBaseUri: process.env.IMAGE_BASE_URI || ''
      };
    },
    components: {
      Link
    },
    updated: function() {
      Prism.highlightAll();
    },
    computed: {
      blogPostBackgroundHeader() {
        if (this.blogPost.image_header) {
          return {
            'background-image': `url(${this.imageBaseUri + this.blogPost.image_header.url})`
          };
        }

        return {
          'background-color': blogPost.background_color || '#ccc'
        };
      },
      blogPostId() {
        return parseInt(this.$route.params.id);
      },
      thisBlogSeriesBlogPosts() {
        if (this.cachedSortedBlogPosts) return this.cachedSortedBlogPosts;
        if (!this.thisBlogSeries) return [];

        const sortFunction = (a, b) => a.blog_series_order > b.blog_series_order ? 1 : -1;

        return this.cachedSortedBlogPosts = this.thisBlogSeries.blog_posts.sort(sortFunction);
      },
      thisBlogSeries() {
        return this.blogSeries.find(blogSery => blogSery.blog_posts.find(blogPost => blogPost.id == this.blogPostId ));
      },
      thisBlogSeriesPostIndex() {
        return this.thisBlogSeriesBlogPosts.findIndex(blogPost => blogPost.id == this.blogPostId);
      },
      nextPostInSeries() {
        if (this.thisBlogSeriesPostIndex === this.thisBlogSeriesBlogPosts.length - 1) return undefined;
        return this.thisBlogSeriesBlogPosts[this.thisBlogSeriesPostIndex + 1];
      },
      prevPostInSeries() {
        if (this.thisBlogSeriesPostIndex === 0) return undefined;
        return this.thisBlogSeriesBlogPosts[this.thisBlogSeriesPostIndex - 1];
      },
      publishedAtFormatted() {
        if (!this.blogPost.published_at) {
          return '';
        }

        return moment(this.blogPost.published_at).format('MMMM Do YYYY');
      }
    },
    apollo: {
      blogPost: {
        prefetch: true,
        query: blogPostQuery,
        variables() {
          return { id: parseInt(this.$route.params.id) };
        }
      },
      blogSeries: {
        prefetch: true,
        query: blogSeriessQuery
      }
    },
    head () {
      const title = this.blogPost.title ? this.blogPost.title + ' / My Personal Blog' : 'My Personal Blog';

      return {
        title: title,
        meta: [
          { hid: 'description', name: 'description', content: this.blogPost.description },
          { hid: 'og:title', name: 'og:title', content: title },
          { hid: 'og:image', name: 'og:image', content: this.blogPost.image_header ? this.imageBaseUri + this.blogPost.image_header.url : '' },
          { hid: 'og:description', name: 'og:description', content: this.blogPost.description },
          { hid: 'og:url', name: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
        ]
      }
    }
  };
</script>