<script>
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, helpers} from "@vuelidate/validators";
  import axios from 'axios';
  import { mapActions } from 'vuex';
  import { useRoute } from 'vue-router';

  export default {
    setup () {
        return { v$: useVuelidate() }
    },
    page: {
      title: "Login",
      meta: [{
        name: "description",
        content: "description",
      }, ],
    },
    data() {
      return {
        email: "",
        password: "",
        submitted: false,
        authError: null,
        tryingToLogIn: false,
        isAuthError: false,
        processing: 0,
      };
    },
    validations: {
      email: {
        required: helpers.withMessage("Email is required", required),
        email: helpers.withMessage("Please enter valid email", email),
      },
      password: {
        required: helpers.withMessage("Password is required", required),
      },
    },
    computed: {
    },
    methods: {
      ...mapActions({
          signIn:'auth/login'
      }),
      async signinapi() {
        this.v$.$validate() // checks all inputs      
        if (!this.v$.$error) {      // if ANY fail validation
          this.processing = 1;
          var that = this;   
          await axios.post(this.base_url+'/login', {
            email: this.email,
            password: this.password
          })
          .then(result => {
            this.processing = 0;
            if (result.data.status == 'error') {
              return that.authError = result.data.message;
            }
            localStorage.setItem('jwt', result.data.data.auth_token);
            this.$router.push({name:'work-orders'})
            //that.signIn(result.data.data)
          })
          
        }
      }
    },
  };
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <!-- auth page bg -->
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>

      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120">
          <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8
            1440,40L1440 140L0 140z"></path>
        </svg>
      </div>
    </div>

    <!-- auth page content -->
    <div class="auth-page-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <img src="@/assets/images/logo.jpg" alt="" height="70" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <!-- end row -->

        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p class="text-muted">Sign in to continue to Toughie Manufacture Login.</p>
                </div>
                <div class="p-2 mt-4">
                  <b-alert v-model="authError" variant="danger" class="mt-3" dismissible>{{ authError }}</b-alert>

                  <div>

                  </div>

                  <form @submit.prevent="signinapi">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" />
                      <span class="error" v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }} </span>
                    </div>

                    <div class="mb-3">
                      <div class="float-end">
                        <!--<router-link to="/forgot-password" class="text-muted">Forgot
                          password?</router-link>-->
                      </div>
                      <label class="form-label" for="password-input">Password</label>
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input type="password" v-model="password" class="form-control pe-5" placeholder="Enter password"
                          id="password-input" />
                        <span class="error" v-if="v$.password.$error"> {{ v$.password.$errors[0].$message }} </span>
                      </div>
                    </div>
                    <div class="mt-4">
                      <button class="btn btn-success w-100" type="submit" v-if="processing == 0">
                        Sign In
                      </button>
                      <button class="btn btn-success w-100" type="submit" disabled v-else>
                        Processing...
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- end card body -->
            </div>
            <!-- end card -->
          </div>
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
    <!-- end auth page content -->

    <!-- footer -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} Toughue. Crafted with
                <i class="mdi mdi-heart text-danger"></i> by SpiderWorks
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!-- end Footer -->
  </div>
  <!-- end auth-page-wrapper -->
</template>

<style scoped>
  span.error{
    color:red;
  }
</style>