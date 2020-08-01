<template>
  <div class="header">
    <div class="logo">
      <a href="/">Josh Unplugged</a>
    </div>
    <div class="categories">
      <router-link v-for="blogPostCategory in blogPostCategories" 
                   v-bind:key="blogPostCategory.id" 
                   :to="{ name: 'blogPostCategories-id', params: { id: blogPostCategory.id }}"
                   tag="a">{{ blogPostCategory.name }}</router-link>
    </div>
  </div>
</template>

<script>
  import blogPostCategoriesQuery from "~/apollo/queries/category/blogPostCategories";
  import Links from "~/components/Links";

  export default {
    components: {
      Links
    },
    apollo: {
      blogPostCategories: {
        prefetch: true,
        query: blogPostCategoriesQuery
      }
    }
  };
</script>
