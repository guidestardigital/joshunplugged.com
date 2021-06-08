<template>
  <div class="page timeline">
    <div class="contents">
      <div class="content-section wide">
        <h1>{{timelineTitle}}</h1>
        <div class="description">{{timelineDescription}}</div>
        <div class="vertical-timeline">
          <div class="years">
            <div v-for="year in years" class="year">
              <div class="label">
                {{year.label}}
              </div>
              <div class="months">
                <div v-for="month in year.months" class="month">
                  <div class="label">{{month.label}}</div>
                  <div class="dates">
                    <div v-for="date in month.dates" class="date">
                      <div class="label">{{date.label}}</div>
                      <div class="entries">
                        <div class="entry" v-for="entry in date.entries">
                          <div class="header" @click="entryHeader_clickHandler(entry)">
                            <div class="contents">
                              <div class="title">{{entry.title}}</div>
                              <div class="estimated" v-if="entry.date_estimated">Date Estimated</div>
                              <div class="flex row flex-align-items-center">
                                <tags :tags="entry.tags" />
                              </div>
                            </div>
                            <i v-if="!entry.expanded" class="fas fa-chevron-right" />
                            <i v-if="entry.expanded" class="fas fa-chevron-down" />
                          </div>
                          <div :class="entryClass(entry)">
                            <div class="description">{{entry.description}}</div>
                            <div class="images">
                              <image-sized :image="image"
                                           size="small"
                                           v-for="image in entry.images"
                                           :key="image.id" />
                            </div>
                            <div class="blog-posts" v-if="entry.blog_posts.length">
                              <div class="blog-post" v-for="blogPost in entry.blog_posts" :key="blogPost.id">
                                <nuxt-link :to="{ name: 'posts-slug', params: {slug: blogPost.slug} }">
                                  <img :src="headerImageUrl(blogPost)" />
                                  {{ blogPost.title }}
                                </nuxt-link>
                              </div>
                            </div>
                            <div class="links" v-if="entry.links.length">
                              <div class="link" v-for="link in entry.links" :key="link.id">
                                <a :href="link.url" :target="link.target">{{link.title}}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './_slug.scss';
import timelineBySlugQuery from '~/apollo/queries/timeline/timelineBySlug.gql';
import {imageToSize} from '~/util/imageUtilFrontend';
import Tags from '~/components/Tags';
import ImageSized from '~/components/images/ImageSized';

const MONTHS = [undefined, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  components: {ImageSized, Tags},
  data() {
    return {
      timelines: undefined,
      years: []
    }
  },
  computed: {
    timeline() {
      return this.timelines ? this.timelines[0] : undefined;
    },
    timelineTitle() {
      return this.timeline ? this.timeline.title : 'Loading...';
    },
    timelineDescription() {
      return this.timeline ? this.timeline.description : '';
    }
  },
  methods: {
    entryClass(entry) {
      return {
        content: true,
        expanded: entry.expanded
      }
    },
    headerImageUrl(blogPost) {
      return imageToSize(blogPost.image_header, 'small');
    },
    rebuild() {
      console.log('Rebuilding timeline');
      if (this.timeline) {
        const years = [];

        this.timeline.timeline_entries.forEach(entry => {
          let year = years.find(y => y.value === entry.year);
          if (!year) {
            years.push(year = {
              value: entry.year,
              label: entry.year < 0 ? Math.abs(entry.year).toString() + ' BC' : entry.year.toString(),
              months: []
            });
          }

          let month = year.months.find(m => m.value === entry.month);
          if (!month) {
            year.months.push(month = {
              value: entry.month,
              label: entry.month ? MONTHS[entry.month] : '',
              dates: []
            });

            year.months.sort((m1, m2) => m2.value - m1.value);
          }

          let date = month.dates.find(d => d.value === entry.date);
          if (!date) {
            month.dates.push(date = {
              value: entry.date,
              label: entry.date ? entry.date.toString() : '',
              entries: []
            });

            month.dates.sort((d1, d2) => d2.value - d1.value);
          }

          entry.expanded = false;

          date.entries.push(entry);
        });

        years.sort((y1, y2) => y2.value - y1.value);

        this.years = years;
      }
    },
    entryHeader_clickHandler(entry) {
      entry.expanded = !entry.expanded;
      this.$forceUpdate();
    }
  },
  apollo: {
    timelines: {
      prefetch: true,
      query: timelineBySlugQuery,
      variables() {
        return {
          slug: this.$route.params.slug
        };
      }
    }
  },
  watch: {
    timelines: function(cur, prev) {
      this.rebuild();
    }
  }
};
</script>
