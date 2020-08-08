<template>
  <Loader :loading="loading || !blogPostCategory">
    <div class="layout-content" v-if="blogPostCategory">
      <div class="content-header">
        <div class="content-title-block">
          <div class="content-title">{{ blogPostCategory.name }}</div>
          <div class="content-description" 
              v-if="!!blogPostCategory.description">{{ blogPostCategory.description }}</div>
        </div>
      </div>
      <div class="content-section">
        <BlogPostsCards :blogPosts="blogPostCategory.blog_posts || []"
                        v-if="blogPostCategory.blog_posts && blogPostCategory.blog_posts.length" />
        <div v-else>
          <h2>No posts in this category.</h2>
        </div>
      </div>
    </div>
  </Loader>
</template>

<script>
  import blogPostQuery from "~/apollo/queries/blogPost/blogPosts-blogPostCategories.gql";
  import BlogPostsCards from "~/components/BlogPostsCards";
  import Loader from "~/components/Loader";

  export default {
    data() {
      return {
        blogPostCategory: undefined,
        loading: 0
      };
    },
    components: {
      BlogPostsCards,
      Loader
    },
    apollo: {
      blogPostCategory: {
        prefetch: false,
        loadingKey: 'loading',
        query: blogPostQuery,
        variables() {
          return { 
            id: parseInt(this.$route.params.id) 
          };
        }
      }
    }
  };
</script>