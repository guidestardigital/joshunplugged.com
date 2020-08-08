<template>
  <div class="quote">
    <div class="content" 
         v-html="$md.render(finalContent)" />
    <div class="details">
      <div class="person" v-if="show-person">
        <nuxt-link :to="{ name: 'person-slug', params: {slug: person.slug} }">
          {{person.first_name}} {{person.last_name}}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import Link from "~/components/Link";

  export default {
    props: {
      quote: undefined,
      showPerson: true
    },
    computed: {
      finalContent() {
        console.log(this);
        return `&ldquo;${this.quote.content}&rdquo;`;
      }
    }
  };
</script>
