<template>
  <Header />
  <div class="activation-container pt-5 mt-5">
    <h3 class="text-center">Kích hoạt tài khoản</h3>
    <div>
      <input
        type="text"
        maxlength="6"
        class="form-control text-center"
        v-model="activationCode"
        placeholder="Nhập mã kích hoạt"
        @keydown.enter="submitActivationCode"
      />
      <div class="text-center">
        <button
          @click="submitActivationCode"
          type="submit "
          class="btn btn-primary mt-3"
        >
          Kích hoạt Tài khoản
        </button>
      </div>
    </div>

    <p class="mt-3 text-center">
      Thời gian còn lại: {{ minutes }}:{{ seconds < 10 ? "0" : ""
      }}{{ seconds }}
    </p>
    <p @click="reActive" class="re-active mt-3 text-center text-info">
      Gửi lại mã kích hoạt
    </p>
  </div>
  <Footer />
</template>

<script>
import authServices from "@/services/auth.services";
import emailServices from "@/services/email.services";
import Swal from "sweetalert2";
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      activationCode: "",
      timeLeft: 300, // 5 minutes in seconds
    };
  },
  computed: {
    minutes() {
      return Math.floor(this.timeLeft / 60);
    },
    seconds() {
      return this.timeLeft % 60;
    },
  },
  methods: {
    countdown() {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    },
    async submitActivationCode() {
      if (this.activationCode.length === 6) {
        try {
          const response = await authServices.activeOtp(
            localStorage.getItem("registeredEmail"),
            this.activationCode
          );
          Swal.fire({
            title: "Kích hoạt tài khoản thành công",
            icon: "success",
          });
          localStorage.removeItem("registeredEmail");
          this.$router.push("/login");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Sai mã kích hoạt.",
            footer: '<a href="#">Gửi lại mã kích hoạt?</a>',
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "vui lòng nhập đủ 6 số",
        });
      }
    },
    // reActive test chưa thành công
    async reActive() {
      try {
        const response = await emailServices.sendMailOTP(
          localStorage.getItem("registeredEmail")
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.timer = setInterval(this.countdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style>
.activation-container {
  max-width: 400px;
  margin: 0 auto;
  height: 70vh;
}
input {
  font-size: 24px;
  height: 50px;
  text-align: center;
}
.re-active {
  cursor: pointer;
}
</style>
