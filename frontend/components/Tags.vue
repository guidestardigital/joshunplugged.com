<template>
  <div class="tags">
    <div class="tag" v-for="tag in tags" :key="tag.id" :style="tagStyle(tag)">
      <i v-if="tag.icon_class" :class="tag.icon_class" />
      {{tag.title}}
    </div>
  </div>
</template>
<script>
  import './Tags.scss';

  export default {
    props: {
      tags: {
        type: Array,
        default: []
      }
    },
    methods: {
      tagStyle(tag) {
        return {
          backgroundColor: tag.color
        }
      }
    }
  };
</script>
