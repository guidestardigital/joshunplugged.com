<template>
  <div class="page home">
    <featured-blog-series v-if="featuredBlogSeries"
                          :blog-series="featuredBlogSeries" />
    <div class="contents shadow">
      <div class="content-section">
        <div class="section-title">Timelines</div>
        <TimelineCards :timelines="timelines" />
      </div>
      <div class="content-section">
        <div class="section-title">Blog Series</div>
        <BlogSeriessCards :blogSeriess="blogSeries" />
      </div>
      <div class="content-section">
        <div class="section-title">Latest Posts</div>
        <BlogPostsCards v-if="blogPosts"
                        :blogPosts="blogPosts.filter(bp => !bp.show_in_series_only)" />
      </div>
      <div class="content-section">
        <div class="section-title">Book Reviews</div>
        <BookReviewPostCards v-if="bookReviews"
                             :bookReviews="bookReviews" />
      </div>
    </div>
  </div>
</template>

<script>
import blogPostsQuery from '~/apollo/queries/blogPost/blogPosts'
import timelinesQuery from '~/apollo/queries/timeline/timelines.gql'
import blogSeriessQuery from '~/apollo/queries/blogSeries/blogSeriess'
import bookReviewsQuery from '~/apollo/queries/bookReview/bookReviews'
import homePageSettings from '~/apollo/queries/homePageSettings.gql';
import BlogPostsCards from '~/components/BlogPostsCards'
import BlogSeriessCards from '~/components/BlogSeriessCards'
import BookReviewPostCards from '~/components/BookReviewPostCards'
import ImageByTarget from '~/components/images/ImageByTarget';

import './index.scss';
import FeaturedBlogSeries from '~/components/blogSeries/FeaturedBlogSeries';
import TimelineCards from '~/components/cards/TimelineCards';

export default {
  data () {
    return {
      blogPosts: [],
      blogSeries: [],
      timelines: []
    }
  },
  components: {
    TimelineCards,
    FeaturedBlogSeries,
    BlogPostsCards,
    BlogSeriessCards,
    BookReviewPostCards,
    ImageByTarget
  },
  computed: {
    featuredBlogSeries() {
      return this.homePageSetting ? this.homePageSetting.featured_blog_series : undefined;
    }
  },
  apollo: {
    homePageSetting: {
      prefetch: true,
      query: homePageSettings
    },
    blogPosts: {
      prefetch: true,
      query: blogPostsQuery
    },
    blogSeries: {
      prefetch: true,
      query: blogSeriessQuery
    },
    bookReviews: {
      prefetch: true,
      query: bookReviewsQuery
    },
    timelines: {
      prefetch: true,
      query: timelinesQuery
    }
  },
  head () {
    return {
      title:'Josh Unplugged',
      meta: [
        { hid: 'description', name: 'description', content: 'Life, Paranormal, UFOs, UAPs, Religion, and Theology. All in one place.' }
      ]
    }
  }
}
</script>
