<template>
  <Header />
  <div class="container mt-5">
    <div class="row">
      <!-- Thanh menu bên trái -->
      <div class="col-md-3">
        <ul class="list-group">
          <li
            class="list-group-item"
            :class="{ active: activeComponent == 'profile' }"
            @click="setActiveComponent('profile')"
          >
            Hồ sơ
          </li>
          <li
            class="list-group-item"
            :class="{ active: activeComponent == 'order' }"
            @click="setActiveComponent('order')"
          >
            Quản lý đơn hàng
          </li>
          <li
            class="list-group-item"
            :class="{ active: activeComponent == 'addressUser' }"
            @click="setActiveComponent('addressUser')"
          >
            Địa chỉ
          </li>
          <li
            class="list-group-item"
            :class="{ active: activeComponent == 'repass' }"
            @click="setActiveComponent('repass')"
          >
            Đổi mật khẩu
          </li>
        </ul>
      </div>
      <Profile v-if="activeComponent === 'profile'" />
      <order v-if="activeComponent === 'order'" />
      <addressUser v-if="activeComponent === 'addressUser'" />
      <repassword v-if="activeComponent === 'repass'" />
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/user/Header.vue";
import Footer from "@/components/user/Footer.vue";
import Profile from "@/components/user/Infomation/profile.vue";
import order from "@/components/user/Infomation/order.vue";
import addressUser from "@/components/user/Infomation/address.vue";
import repassword from "@/components/user/Infomation/repassword.vue";
export default {
  name: "information",
  components: {
    Header,
    Footer,
    Profile,
    order,
    addressUser,
    repassword,
  },
  data() {
    return {
      activeComponent: "profile",
    };
  },
  methods: {
    setActiveComponent(component) {
      this.activeComponent = component;
    },
  },
};
</script>

<style scoped></style>
