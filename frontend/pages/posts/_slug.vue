<template>
  <div class="page blog-post" v-if="blogPost">
    <div v-if="blogPost.image_header || blogPost.background_color"
        class="hero blog-post-hero"
        :style="blogPostBackgroundHeader" />

    <div class="contents blog-body" id="top">
      <div class="header">
        <div class="blog-series-information"
            v-if="!!thisBlogSeries">
          <div class="series-intro">Part {{ blogPost.blog_series_order }} of Series</div>
          <div class="blog-series-title">
            <nuxt-link :to="{ name: 'series-slug', params: {slug: thisBlogSeries.slug} }">
              {{ thisBlogSeries.title }}
            </nuxt-link>
          </div>
          <div class="blog-series-navigation"
              v-if="!!thisBlogSeries">
            <div v-for="bp in thisBlogSeriesBlogPosts"
                :key="bp.id">
              <nuxt-link :class="{ 'selected': bp.id === blogPost.id}"
                          :to="{ name: 'posts-slug', params: {slug: bp.slug}, hash: '#top' }">
                {{ bp.title }}
              </nuxt-link>
            </div>
          </div>
        </div>
        <div class="content-title-block">
          <div class="content-title">{{ blogPost.title }}</div>
          <div class="content-date" v-if="publishedAtFormatted">{{ publishedAtFormatted }} by Joshua Jung</div>
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

      <div class="content-section" id="comments">
        <!-- Next and Previous -->
        <div class="blog-post-series-next-prev"
            v-if="!!thisBlogSeries">
          <div class="vertical-description-link" v-if="prevPostInSeries">
            <div class="description">Previous</div>
            <nuxt-link :to="{ name: 'posts-slug', params: {slug: prevPostInSeries.slug}, hash: '#top' }">
              {{ prevPostInSeries.title }}
            </nuxt-link>
          </div>
          <div class="vertical-description-link" v-if="nextPostInSeries">
            <div class="description">Next</div>
            <nuxt-link :to="{ name: 'posts-slug', params: {slug: nextPostInSeries.slug}, hash: '#top' }">
              {{ nextPostInSeries.title }}
            </nuxt-link>
          </div>
        </div>

        <!-- Comment Thread -->
        <CommentThread :threadId="blogPost.comment_thread ? blogPost.comment_thread.id : '-1'"
                      :key="commentThreadKey"
                      @replyCreated="commentThread_replyCreated" />

        <!-- Recommended Links -->
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
  import { createComment } from "~/util/comments";

  import Link from "~/components/Link";
  import blogSeriessQuery from '~/apollo/queries/blogSeries/blogSeriess'
  import CommentThread from '~/components/CommentThread';
  import './_slug.scss';

  const moment = require("moment");

  export default {
    data() {
      return {
        threadId: undefined,
        blogSeries: [],
        moment: moment,
        imageBaseUri: process.env.IMAGE_BASE_URI || '',
        commentThreadKey: 0,
        loading: 0
      };
    },
    components: {
      Link,
      CommentThread
    },
    computed: {
      threadId() {
        if (this.threadId) return this.threadId;

        return this.blogPost.comment_thread.id;
      }
    },
    methods: {
      commentThread_replyCreated(reply) {
        createComment(this.$apollo, {
          userId: this.$auth.user.id,
          commentText: reply.replyText,
          commentThread: reply.commentThread,
          linkToBlogPostId: this.blogPost.id
        }).then(commentThread => {
          this.blogPost.comment_thread = commentThread;
          this.commentThreadKey++;
        })
      }
    },
    computed: {
      blogPost() {
        return this.blogPosts ? this.blogPosts[0] : undefined;
      },
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
      blogPostSlug() {
        return this.$route.params.slug;
      },
      thisBlogSeriesBlogPosts() {
        if (this.cachedSortedBlogPosts) return this.cachedSortedBlogPosts;
        if (!this.thisBlogSeries) return [];

        const sortFunction = (a, b) => a.blog_series_order > b.blog_series_order ? 1 : -1;

        return this.cachedSortedBlogPosts = this.thisBlogSeries.blog_posts.sort(sortFunction);
      },
      thisBlogSeries() {
        return this.blogSeries.find(blogSery => blogSery.blog_posts.find(blogPost => blogPost.slug === this.blogPostSlug ));
      },
      thisBlogSeriesPostIndex() {
        return this.thisBlogSeriesBlogPosts.findIndex(blogPost => blogPost.slug === this.blogPostSlug);
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
        if (!this.blogPost.manually_published_at) {
          return '';
        }

        return moment(this.blogPost.manually_published_at).format('MMMM Do YYYY');
      }
    },
    apollo: {
      blogPosts: {
        prefetch: true,
        query: blogPostQuery,
        loadingKey: 'loading',
        variables() {
          return { slug: this.$route.params.slug };
        }
      },
      blogSeries: {
        prefetch: true,
        query: blogSeriessQuery
      }
    },
    head () {
      const title = this.blogPost ? (this.blogPost.title ? this.blogPost.title + ' / Josh Unplugged' : 'Josh Unplugged') : 'Title Error';
      const description = this.blogPost ? (this.blogPost.description ? this.blogPost.description : 'No description available') : 'Description Error';
      const imageHeader = this.blogPost ? (this.blogPost.image_header ? this.imageBaseUri + this.blogPost.image_header.url : '') : '';

      return {
        title: title,
        meta: [
          { hid: 'description', name: 'description', content: description },
          { hid: 'og:title', name: 'og:title', content: title },
          { hid: 'og:image', name: 'og:image', content: imageHeader },
          { hid: 'og:description', name: 'og:description', content: description },
          { hid: 'og:url', name: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
        ]
      }
    }
  };
</script>
