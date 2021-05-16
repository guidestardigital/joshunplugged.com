<template>
  <div class="page">
    <div class="contents"
         v-if="blogPostCategory">
      <div class="header">
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
  </div>
</template>

<script>
  import blogPostQuery from "~/apollo/queries/blogPost/blogPosts-blogPostCategories.gql";
  import BlogPostsCards from "~/components/BlogPostsCards";

  export default {
    data() {
      return {
        blogPostCategories: undefined,
        loading: 0
      };
    },
    components: {
      BlogPostsCards
    },
    computed: {
      blogPostCategory() {
        return this.blogPostCategories ? this.blogPostCategories[0] : undefined;
      }
    },
    apollo: {
      blogPostCategories: {
        prefetch: true,
        query: blogPostQuery,
        variables() {
          return {
            slug: this.$route.params.slug
          };
        }
      }
    }
  };
</script>
