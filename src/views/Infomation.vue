<template>
  <Header @favoriteClicked="setActiveComponent('favorite')" />
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
            :class="{ active: activeComponent == 'favorite' }"
            @click="setActiveComponent('favorite')"
          >
            Sản phẩm yêu thích
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
      <favorite v-if="activeComponent === 'favorite'" />
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
import favorite from "@/components/user/Infomation/favorite.vue";
export default {
  name: "information",
  components: {
    Header,
    Footer,
    Profile,
    order,
    addressUser,
    repassword,
    favorite,
  },
  data() {
    return {
      activeComponent: "profile",
    };
  },
  created() {
    // Kiểm tra query để đặt component mặc định
    const component = this.$route.query.component;
    if (component) {
      this.activeComponent = component;
    }
  },
  watch: {
    // Theo dõi sự thay đổi của route để cập nhật component
    $route(to) {
      const component = to.query.component;
      if (component) {
        this.activeComponent = component;
      }
    },
  },
  methods: {
    setActiveComponent(component) {
      this.activeComponent = component;
    },
  },
};
</script>
