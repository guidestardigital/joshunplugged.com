<template>
  <div class="page-header"
       id="page-header">
    <div class="logo">
      <a href="/">Josh Unplugged</a>
    </div>
    <div class="controls">
      <div class="categories">
        <nuxt-link to="/" class="button"><i class="fas fa-home"/></nuxt-link>
        <nuxt-link :to="{ name: 'books' }" class="button"><i class="fas fa-book-open" />&nbsp;Book Reviews</nuxt-link>
        <nuxt-link :to="{ name: 'people' }" class="button"><i class="fas fa-user-friends"/>&nbsp;People</nuxt-link>
        <nuxt-link v-for="blogPostCategory in blogPostCategories"
                   class="button"
                   v-bind:key="blogPostCategory.id"
                   :to="{ name: 'categories-slug', params: { slug: blogPostCategory.slug }}">
          {{ blogPostCategory.name }}
        </nuxt-link>
        <a v-on:click="logout()"
           class="button"
           v-if="user">Logout</a>
        <a href="/login"
           class="button"
           v-else>Login</a>
      </div>
      <div class="auth">
        <div class="username" v-if="user">
          Welcome, {{user.username}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import blogPostCategoriesQuery from "~/apollo/queries/category/blogPostCategories";
  import Links from "~/components/Links";
  import './Header.scss';

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
        prefetch: false,
        query: blogPostCategoriesQuery
      }
    }
  };
</script>
