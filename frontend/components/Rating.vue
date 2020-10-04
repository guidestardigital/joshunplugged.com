<template>
  <div class="rating">
    <img v-if="rating >= 1" :src="filledStarSrc" width=15 height=15 />
    <img v-else :src="unfilledStarSrc" width=16 height=16 />
    <img v-if="rating >= 2" :src="filledStarSrc" width=15 height=15 />
    <img v-else :src="unfilledStarSrc" width=16 height=16 />
    <img v-if="rating >= 3" :src="filledStarSrc" width=15 height=15 />
    <img v-else :src="unfilledStarSrc" width=16 height=16 />
    <img v-if="rating >= 4" :src="filledStarSrc" width=15 height=15 />
    <img v-else :src="unfilledStarSrc" width=16 height=16 />
    <img v-if="rating >= 5" :src="filledStarSrc" width=15 height=15 />
    <img v-else :src="unfilledStarSrc" width=16 height=16 />
  </div>
</template>

<script>
  import linkQuery from "~/apollo/queries/link/link.gql";

  export default {
    props: {
      rating: Number
    },
    computed: {
      filledStarSrc() {
        return 'https://joshoncode.s3.us-east-2.amazonaws.com/star_filled_d0352af702.svg?74247.57000000682';
      },
      unfilledStarSrc() {
        return 'https://joshoncode.s3.us-east-2.amazonaws.com/star_empty_5cd53f542f.svg?122675.07499997737';
      }
    }
  };
</script>
