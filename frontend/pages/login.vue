<template>
  <div class="login-page">
    <div v-if="sending">
        Logging in...
    </div>
    <div v-else>
      <form @submit="login">
        Email or Username
        <input v-model="loginForm.identifier" />
        Password
        <input v-model="loginForm.password" type="password" />
        <button type="submit">Login</button>
        <div v-if="error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      sending: false, 
      error: undefined,
      loginForm: {
        identifier: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {
      this.sending = true;

      try {
        const response = await this.$auth.loginWith('local', { data: this.loginForm });

        this.sending = false;

        this.$auth.setUser(response.user);

        window.location.href = '/';
      } catch (error) {
        this.sending = false;

        if (error.message) {
          let message = "An error occurred registering. Please try again later.";
          
          message = response.message.map(m => m.messages.map(m2 => m2.message).join('\n')).join('\n');

          this.error = message;
        } else {
          this.error = "An error occurred registering. Please try again later.";
        }
      }
    }
  }
}
</script>
