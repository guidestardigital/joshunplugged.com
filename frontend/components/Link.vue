<template>
  <a class="uk-link" :href="link.url" :target="link.target">
    <img class="icon" :src="link.icon.url" v-if="!!link.icon" />
    <span>
      {{ link.title }}
    </span>
  </a>
</template>

<script>
  import linkQuery from "~/apollo/queries/link/link.gql";

  export default {
    data() {
      return {
        link: {}
      }
    },
    props: {
      id: String
    },
    apollo: {
      link: {
        prefetch: false,
        query: linkQuery,
        variables() {
          return { id: this.id };
        }
      }
    }
  };
</script>
