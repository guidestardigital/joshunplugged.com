<template>
  <div class="content-loader">
    <div :class="{ 'content-loader-text': true, 'show': loading }"
         v-if="loading">Loading...</div>
    <div :class="{ 'loader-content': true, 'show': !loading }">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        default: 0
      }
    }
  };
</script>
