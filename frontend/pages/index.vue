<template>
  <div>
    <div class="hero-image">
      <ImageSingle target="hero_image" />
    </div>
    <div class="layout-content">
      <div class="content-section">
        <div class="section-title">Series</div>
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
import blogSeriessQuery from '~/apollo/queries/blogSeries/blogSeriess'
import bookReviewsQuery from '~/apollo/queries/bookReview/bookReviews'

import BlogPostsCards from '~/components/BlogPostsCards'
import BlogSeriessCards from '~/components/BlogSeriessCards'
import BookReviewPostCards from '~/components/BookReviewPostCards'
import ImageSingle from '~/components/ImageSingle'

export default {
  data () {
    return {
      blogPosts: [],
      blogSeries: []
    }
  },
  components: {
    BlogPostsCards,
    BlogSeriessCards,
    BookReviewPostCards,
    ImageSingle
  },
  apollo: {
    blogPosts: {
      prefetch: false,
      query: blogPostsQuery
    },
    blogSeries: {
      prefetch: false,
      query: blogSeriessQuery
    },
    bookReviews: {
      prefetch: false,
      query: bookReviewsQuery
    }
  },
  head () {
    return {
      title:'Josh Unplugged',
      meta: [
        { hid: 'description', name: 'description', content: 'Life, Paranormal, Politics, and Theology. All in one place.' }
      ]
    }
  }
}
</script>
