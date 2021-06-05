<template>
  <div class="timeline-cards">
    <div v-for="timeline in timelines"
         class="timeline-card"
         :key="timeline.id">
      <nuxt-link :to="{ name: 'timeline-slug', params: { slug: timeline.slug } }"
                 class="title">{{ timeline.title }}</nuxt-link>
      <div class="description"
           v-if="timeline.description">{{timeline.description}}</div>
    </div>
  </div>
</template>

<script>
import './TimelineCards.scss';

export default {
  props: {
    timelines: Array
  }
};
</script>
