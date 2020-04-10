<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col1">
        <h1>Reviews System</h1>
        <p>
          Welcome to the Night Life Sofia - Reviews System. The social media web app powered by Vue.js and Firebase.
          Login to view what others think about the venues or visit us at
          <a
            href="https://nightlifesofia.com/"
            target="_blank"
          >Night Life Sofia</a>
        </p>
      </div>
      <div class="col2" :class="{ 'signup-form': !showLoginForm }">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>

          <label for="email1">Email</label>
          <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />

          <label for="password1">Password</label>
          <input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="******"
            id="password1"
          />

          <button @click="login" class="button">Log In</button>

          <div class="extras">
            <a @click="toggleForm">Create an Account</a>
          </div>
        </form>
        <form v-if="!showLoginForm " @submit.prevent>
          <h1>Get Started</h1>

          <label for="name">Name</label>
          <input v-model.trim="signupForm.name" type="text" placeholder="Name" id="name" />
          <label for="surname">Surname</label>
          <input v-model.trim="signupForm.surname" type="text" placeholder="Surname" id="surname" />
          <label for="phoneNumber">Phone number</label>
          <input
            v-model.trim="signupForm.phoneNumber"
            type="text"
            placeholder="Phone number"
            id="phone-number"
          />
          <label for="email2">Email</label>
          <input
            v-model.trim="signupForm.email"
            type="text"
            placeholder="your@email.com"
            id="email2"
          />

          <label for="password2">Password</label>
          <input
            v-model.trim="signupForm.password"
            type="password"
            placeholder="min 6 characters"
            id="password2"
          />

          <button @click="signup" class="button">Sign Up</button>

          <div class="extras">
            <a @click="toggleForm">Back to Log In</a>
          </div>
        </form>
        <transition name="fade">
          <div v-if="errorMsg !== ''" class="error-msg">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require("../firebase.js");

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        surname: "",
        phoneNumber: "",
        email: "",
        password: "",
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    login() {
      this.performingRequest = true;

      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          this.$router.push("/venue-list");
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    signup() {
      this.performingRequest = true;

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user);

          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              surname: this.signupForm.surname,
              phoneNumber: this.signupForm.phoneNumber,
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.performingRequest = false;
              this.$router.push("/venue-list");
            })
            .catch(err => {
              console.log(err);
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
