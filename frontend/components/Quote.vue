<template>
  <div class="quote" v-if="quote.public">
    <div class="content"
         v-html="$md.render(finalContent)" />
    <div class="source">
      <!-- From {{ quote.location }} -->
      <span class="location" v-if="quote.location && showLocation">From {{ quote.location }}</span>
      <!-- in -->
      <span v-if="quote.location && showLocation && quote.book_review && showBookReview"> in </span>
      <!-- {{ quote.book.title }} -->
      <span class="location" v-if="quote.book_review && showBookReview">
        <nuxt-link :to="{ name: 'books-slug', params: { slug: quote.book_review.slug } }">{{ quote.book_review.title }}</nuxt-link>
      </span>
    </div>
    <div class="details">
      <div class="person" v-if="showPerson">
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
      person: undefined,
      showPerson: true,
      showLocation: false,
      showBookReview: false
    },
    computed: {
      finalContent() {
        return `<strong>&ldquo;&nbsp;</strong>${this.quote.content}&nbsp;<strong>&rdquo;</strong>`;
      }
    }
  };
</script>
