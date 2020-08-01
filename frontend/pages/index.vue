<template>
  <div>
    <div class="hero-image">
      <ImageSingle target="hero_image" />
    </div>
    <div class="content">
      <div class="content-section">
        <BlogSeriessCards :blogSeriess="blogSeries" />
        <BlogPostsCards v-if="blogPosts" :blogPosts="blogPosts.filter(bp => !bp.show_in_series_only)" />
      </div>
    </div>
  </div>
</template>

<script>
import Footer from "~/layouts/Footer";
import blogPostsQuery from '~/apollo/queries/blogPost/blogPosts'
import blogSeriessQuery from '~/apollo/queries/blogSeries/blogSeriess'
import BlogPostsCards from '~/components/BlogPostsCards'
import BlogSeriessCards from '~/components/BlogSeriessCards'
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
    ImageSingle
  },
  apollo: {
    blogPosts: {
      prefetch: true,
      query: blogPostsQuery
    },
    blogSeries: {
      prefetch: true,
      query: blogSeriessQuery
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
