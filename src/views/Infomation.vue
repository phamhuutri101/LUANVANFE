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
<style scoped>
.container {
  min-height: 80vh;
}

.list-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.list-group-item {
  border: none;
  padding: 16px 20px;
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.list-group-item:not(:last-child) {
  border-bottom: 1px solid #f0f2f5;
}

.list-group-item:hover {
  background: #f8f9fa;
  color: #09884d;
  transform: translateX(5px);
}

.list-group-item.active {
  background: #e0f7e9;
  color: #09884d;
  border-left: 4px solid #09884d;
  font-weight: 600;
}

.list-group-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: #09884d;
  transform: translateX(-4px);
  transition: transform 0.3s ease;
}

.list-group-item:hover::before {
  transform: translateX(0);
}

/* Hover effects for each menu item */
.list-group-item:nth-child(1):hover {
  background: linear-gradient(to right, rgba(9, 136, 77, 0.05), transparent);
}

.list-group-item:nth-child(2):hover {
  background: linear-gradient(to right, rgba(9, 136, 77, 0.05), transparent);
}

.list-group-item:nth-child(3):hover {
  background: linear-gradient(to right, rgba(9, 136, 77, 0.05), transparent);
}

.list-group-item:nth-child(4):hover {
  background: linear-gradient(to right, rgba(9, 136, 77, 0.05), transparent);
}

.list-group-item:nth-child(5):hover {
  background: linear-gradient(to right, rgba(9, 136, 77, 0.05), transparent);
}

/* Active state animations */
@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.list-group-item.active {
  animation: slideIn 0.3s ease;
}

/* Icon indicators */
.list-group-item::after {
  content: "›";
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.list-group-item:hover::after {
  opacity: 1;
  transform: translate(5px, -50%);
}

/* Loading state */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.list-group.loading .list-group-item {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .list-group {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .list-group-item {
    padding: 12px 16px;
    font-size: 14px;
  }

  .list-group-item:hover {
    transform: none;
  }

  .list-group-item.active {
    border-left: 3px solid #09884d;
  }
}

/* Component transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Active indicator dot */
.list-group-item.active::before {
  content: "";
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 30px;
  background: #09884d;
  border-radius: 0 4px 4px 0;
}

/* Menu item counter */
.list-group-item .counter {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
}

.list-group-item:hover .counter {
  background: #09884d;
  color: white;
}

/* Focus state for accessibility */
.list-group-item:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(9, 136, 77, 0.2);
}

/* Active item shadow effect */
.list-group-item.active {
  box-shadow: 0 2px 4px rgba(9, 136, 77, 0.1);
}
</style>
