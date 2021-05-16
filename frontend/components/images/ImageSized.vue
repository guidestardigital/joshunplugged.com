<template>
  <img alt="" class="image" :src="imageUrl"  />
</template>

<script>
import {imageToSize} from '~/util/imageUtilFrontend';

export default {
  props: {
    image: {
      type: Object,
      default: undefined
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  computed: {
    imageUrl() {
      return this.image ? imageToSize(this.image, this.size) : '';
    }
  }
};
</script>
