<template>
  <div class="login-page layout-content">
    <div class="content-header">
      <div class="content-title-block">
        <div class="content-title">Login</div>
      </div>
    </div>
    <div class="content-section">
      <div v-if="sending">
          Logging in...
      </div>
      <div v-else>
        <form @submit="login" class="form">
          <div class="form-confirmation" 
               v-if="confirmation">
            Your email has been successfully confirmed. Login below.
          </div>
          Email or Username
          <input v-model="loginForm.identifier" autofocus/>
          Password
          <input v-model="loginForm.password" type="password" />
          <button type="submit">Login</button>
          <div v-if="error" class="form-error">
            {{ error }}
          </div>
        </form>
        <a href="/register">Register as New User</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      sending: false, 
      error: undefined,
      confirmation: this.$route.query.confirmation,
      loginForm: {
        identifier: '',
        password: ''
      }
    };
  },
  methods: {
    login() {
      this.sending = true;

      this.$auth.loginWith('local', { data: this.loginForm })
        .then(response => {
          this.sending = false;
          this.$auth.setUser(response.user);
          window.location.href = '/';
        })
        .catch(error => {
          this.sending = false;
          
          let message = "An error occurred registering. Please try again later.";
          
          if (error.response.data.message) {
            message = error.response.data.message.map(m => m.messages.map(m2 => m2.message).join('\n')).join('\n');
          }

          this.error = message;
        })
    }
  }
}
</script>
