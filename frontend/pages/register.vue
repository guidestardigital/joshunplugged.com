<template>
  <div class="registration-page content">
    <div class="content-header">
      <div class="content-title-block">
        <div class="content-title">Register</div>
        <div class="content-description">Become a user to comment on posts, receive emails on comment replies, and receive updates when new content is added.</div>
      </div>
    </div>
    <div class="content-section">
      <form v-on:submit.prevent="register" 
            class="form">
        <div v-if="sending">
          Sending registration...
        </div>
        <div v-else-if="success" class="form-confirmation">
          You have been registered as <span class="username">{{user.username}}</span>.
          Please check your email at <span class="email">{{user.email}}</span> to confirm your registration.
        </div>
        Email
        <input id="email" />
        Username
        <input id="username" />
        First Name
        <input id="firstName" placeholder="Optional" />
        Last Name
        <input id="lastName" placeholder="Optional" />
        Password
        <input id="password" type="password" />
        <TextByTag tag="signup_notice" class="notice" />
        <button type="submit">Signup</button>
        <div v-if="error" class="form-error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import TextByTag from "~/components/TextByTag";

  export default {
    data() {
      return {
        sending: false, 
        success: false,
        error: undefined
      };
    },
    components: {
      TextByTag
    },
    methods: {
      register() {
        this.sending = true;
        this.error = undefined;
        this.success = false;

        fetch(process.env.BLOG_API_BASE + '/auth/local/register', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
          })
        })
        .then(response => {
          this.sending = false;
          return response.json();
        })
        .then(response => {
          if (!response) return;
          
          if (response.message) {
            let message = "An error occurred registering. Please try again later.";
            
            message = response.message.map(m => m.messages.map(m2 => m2.message).join('\n')).join('\n');

            this.error = message;
          } else {
            this.success = true;
            this.user = response.user;
          }
        });
      }
    }
  }
</script>
