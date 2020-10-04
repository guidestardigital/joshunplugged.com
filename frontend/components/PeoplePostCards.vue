<template>
  <div class="story-cards-container">
    <div v-for="person in peopleSorted"
         :key="person.id">
      <div class="story-card">
        <div class="image-container contain">
          <img :src="person.avatar.url" 
                :alt="person.title" 
                class="image"
                v-if="person.avatar" />
        </div>
        <div class="text-block">
          <nuxt-link :to="{ name: 'person-slug', params: {slug: person.slug} }"
                        class="story-title">{{ person.first_name }} {{ person.last_name }}</nuxt-link>
          <div class="description"
                v-if="person.description">
            {{ person.description }}
          </div>
          <div class="item"
               v-if="person.homepage">
            <a :href="person.homepage.url" 
               target="_blank">{{ person.homepage.url }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    computed: {
      peopleSorted() {
        return this.people.sort((a, b) => {
          return a.last_name > b.last_name ? 1 : -1;
        });
      }
    },
    props: {
      people: Array,
    }
  };
</script>
