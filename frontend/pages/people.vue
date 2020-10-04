<template>
  <Loader :loading="loading || !people">
    <div class="people" v-if="!!people">
      <div class="hero"
           style="background-image: url(https://joshoncode.s3.us-east-2.amazonaws.com/pexels_luis_quintero_2774556_6107fe7451.jpg?27200.124999973923);">
      </div>
      <div class="layout-content">
        <div class="content-header">
          <div class="content-title-block">
            <div class="content-title">Important People</div>
            
            <div class="content-description"><TextByTag tag="people_page"></TextByTag></div>
          </div>
        </div>
        <div class="content-section">
          <PeoplePostCards :people="people"
                           v-if="people && people.length" />
          <div v-else>
            <h2>No information on people posted yet.</h2>
          </div>
        </div>
      </div>
    </div>
  </Loader>
</template>

<script>
  import peopleQuery from "~/apollo/queries/people/people.gql";
  import PeoplePostCards from "~/components/PeoplePostCards";
  import moment from 'moment';
  import Loader from "~/components/Loader";
  import TextByTag from "~/components/TextByTag";
  import { publishedAt } from '~/util/dates';
  
  export default {
    data() {
      return {
        people: undefined,
        loading: 0
      };
    },
    components: {
      PeoplePostCards,
      Loader,
      TextByTag
    },
    apollo: {
      people: {
        prefetch: false,
        loadingKey: "loading",
        query: peopleQuery
      }
    }
  };
</script>