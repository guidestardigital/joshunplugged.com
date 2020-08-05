<template>
  <div class="footer-backdrop">
    <Header />
    <div class="body" 
         :style="{ 'margin-top': bodyMarginTop + 'px' }">
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
  import blogPostCategoriesQuery from "~/apollo/queries/category/blogPostCategories";
  import Header from "~/layouts/Header";
  import Footer from "~/layouts/Footer";

  export default {
    data() {
      return {
        postCategories: [],
        bodyMarginTop: 1
      };
    },
    methods: {
      onResize(event) {
        this.$nextTick(() => {
          const header = document.getElementById('page-header');
          this.bodyMarginTop = header.offsetHeight;
          this.$forceUpdate();
        })
      }
    },
    mounted() {
      window.addEventListener('resize', this.onResize);
      this.onResize();

      // Setup Apollo Login JWT token, on startup
      if (this.$auth.getToken('local')) {
        this.$apolloHelpers.onLogin(this.$auth.getToken('local').replace('Bearer ', ''));
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
    },
    components: {
      Header,
      Footer
    },
    apollo: {
      blogPostCategories: {
        prefetch: true,
        query: blogPostCategoriesQuery
      }
    }
  };
</script>
