<template>
  <div class="header" 
       id="page-header">
    <div class="logo">
      <a href="/">Josh Unplugged</a>
    </div>
    <div class="controls">
      <div class="categories">
        <router-link v-for="blogPostCategory in blogPostCategories" 
                    v-bind:key="blogPostCategory.id" 
                    :to="{ name: 'blogPostCategories-id', params: { id: blogPostCategory.id }}"
                    tag="a">{{ blogPostCategory.name }}</router-link>
      </div>
      <div class="auth">
        <div class="username" v-if="user">
          Welcome, {{user.username}}
        </div>
        <a v-on:click="logout()"
           v-if="user">Logout</a>
        <a href="/login"
           v-else>Login</a>
      </div>
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
    computed: {
      user() {
        return this.$auth.user;
      }
    },
    methods: {
      logout() {
        this.$auth.logout().then(response => {
          window.location.reload();
        });
      }
    },
    apollo: {
      blogPostCategories: {
        prefetch: true,
        query: blogPostCategoriesQuery
      }
    }
  };
</script>
