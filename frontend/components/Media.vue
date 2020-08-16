<template>
  <div class="media"
       v-if="media.type === 'YouTube'"
       v-html="media.embed" />
  <div class="media"
       v-else>
    Media type {{ media.type }} not supported yet.
  </div>
</template>

<script>
  export default {
    props: {
      media: undefined
    }
  };
</script>
