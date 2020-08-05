<template>
  <div v-html="text" 
       :class="classPass" />
</template>

<script>
  import textQuery from "~/apollo/queries/text/text.gql";

  export default {
    data() {
      return {
        text: ''
      }
    },
    props: {
      tag: String,
      classPass: {
        type: String,
        default: ''
      }
    },
    apollo: {
      text: {
        prefetch: true,
        query: textQuery,
        manual: true,
        variables() {
          return { tag: this.tag };
        },
        result(apolloQueryResult, data) {
          if (apolloQueryResult.data && apolloQueryResult.data.texts && apolloQueryResult.data.texts.length) {
            this.text = apolloQueryResult.data.texts[0].text;
          } else {
            this.text = `Error loading Text with tag ${this.tag}`;
          }
        }
      }
    }
  };
</script>
