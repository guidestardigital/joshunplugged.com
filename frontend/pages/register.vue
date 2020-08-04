<template>
  <div>
    Email
    <input id="email" />
    Username
    <input id="username" />
    Password
    <input id="password" type="password" />
    <button v-on:click="signup">Signup</button>
  </div>
</template>

<script>

export default {
  methods: {
    signup() {

      fetch('http://localhost:1337/auth/local/register', {
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
        })
      })
    }
  }
}
</script>
