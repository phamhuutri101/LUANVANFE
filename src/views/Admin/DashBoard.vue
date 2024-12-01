<template>
  <!-- modal -->
  <div
    class="modal modal-xl fade"
    id="detailUser"
    tabindex="-1"
    aria-labelledby="detailUserLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="detailUserLabel">
            Thông tin người dùng
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Ảnh đại diện</th>
                <th scope="col">Họ & Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Giới tính</th>
                <th scope="col">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><img class="img-info" :src="infoUser.AVT_URL" alt="" /></td>
                <td>{{ infoUser.FULL_NAME }}</td>
                <td>{{ infoUser.EMAIL_USER }}</td>
                <td>{{ infoUser.PHONE_NUMBER }}</td>
                <td>{{ infoUser.GENDER_USER }}</td>
                <td>{{ formatDay(infoUser.CREATED_AT) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- end modal -->
  <div class="row flex-column flex-md-row">
    <div class="col-12 col-md-2 background">
      DashBoard
      <ul
        class="dash-board-list nav list-unstyled nav nav-underline"
        id="pills-tab"
        role="tablist"
      >
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active text-white"
            aria-current="page"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
            ><i class="fa-solid fa-chart-simple"></i> Tổng quan</a
          >
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link text-white"
            aria-current="page"
            id="pills-user-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-user"
            type="button"
            role="tab"
            aria-controls="pills-user"
            aria-selected="true"
            ><i class="fa-solid fa-users-gear"></i> Quản lý người dùng</a
          >
        </li>
        <li class="nav-item position-relative" role="presentation">
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ shopNonActive.length }}</span
          >
          <a
            class="nav-link text-white"
            aria-current="page"
            id="pills-confirm-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-confirm"
            type="button"
            role="tab"
            aria-controls="pills-confirm"
            aria-selected="true"
            ><i class="fa-regular fa-circle-check"></i> Xác nhận mở shop</a
          >
        </li>
        <li class="nav-item position-relative" role="presentation">
          <a class="nav-link text-white" @click="logout"
            ><i class="fa-solid fa-right-from-bracket"></i> đăng xuất</a
          >
        </li>
      </ul>
    </div>

    <!-- Biểu đồ trong col-10 -->
    <div class="col-12 col-md-10">
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active py-4"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <div class="row">
            <div class="col-4">
              <div class="number-user">
                <div class="row">
                  <div class="col-2 d-flex align-items-center px-3">
                    <i class="fa-regular fa-user fs-3"></i>
                  </div>
                  <div class="col-10">
                    <span class="text-title"> Tài khoản trên hệ thống </span>
                    <div class="user">
                      <span class="fs-4">{{ numberUser }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-user"
          role="tabpanel"
          aria-labelledby="pills-user-tab"
        >
          <table class="table table-hover">
            <thead>
              <tr>
                <th class="text-center" scope="col">#</th>
                <th class="text-center" scope="col">Tên đăng nhập</th>
                <th class="text-center" scope="col">Quyền truy cập</th>
                <th class="text-center" scope="col">Trạng thái</th>
                <th class="text-center" scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in users" :key="index">
              <tr>
                <th scope="row">{{ index + 1 }}</th>
                <td
                  data-bs-toggle="modal"
                  data-bs-target="#detailUser"
                  @click="getUserById(item.USER_ID)"
                  class="text-center hover-name"
                >
                  {{ item.USER_NAME }}
                </td>
                <td class="text-center">
                  <span class="px-2" v-if="item.OBJECT_ROLE.IS_ADMIN"
                    >Admin</span
                  >
                  <span class="px-2" v-if="item.OBJECT_ROLE.IS_SHOPPER"
                    >Người bán hàng</span
                  >
                  <span class="px-2" v-if="item.OBJECT_ROLE.IS_USER">
                    Khách hàng</span
                  >
                </td>
                <td class="text-center">
                  <span class="is-active" v-if="item.IS_ACTIVE"
                    >Đã kích hoạt</span
                  >
                  <span v-else class="non-active">Chưa kích hoạt</span>
                </td>
                <td class="text-center">
                  <i
                    v-if="item.IS_ACTIVE"
                    @click="deleteUser(item._id, item.USER_ID, item.USER_NAME)"
                    class="fa-solid fa-lock icon-lock"
                  ></i>

                  <i
                    v-else
                    @click="reactive(item._id, item.USER_ID, item.USER_NAME)"
                    class="fa-solid fa-unlock icon-unlock"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="tab-pane fade"
          id="pills-confirm"
          role="tabpanel"
          aria-labelledby="pills-confirm-tab"
        >
          <table class="table table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Tên shop</th>
                <th scope="col">Mô tả shop</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in shopNonActive" :key="index">
              <tr>
                <th scope="row">{{ index + 1 }}</th>
                <td
                  data-bs-toggle="modal"
                  data-bs-target="#detailUser"
                  @click="getUserById(item.ID_USER)"
                >
                  {{ item.SHOP_NAME }}
                </td>
                <td>{{ item.SHOP_DESC }}</td>
                <td>{{ formatDay(item.TO_DATE) }}</td>
                <td>
                  <button
                    @click="activeShop(item.ID_ACCOUNT)"
                    class="btn btn-primary"
                  >
                    Xác nhận mở shop
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Swal from "sweetalert2";
import userServices from "@/services/user.services";
import authServices from "@/services/auth.services";
import emailServices from "@/services/email.services";
import shopServices from "@/services/shop.services";

import deleteCookie from "@/utils/deleteCookie";
export default {
  name: "Dashboard",
  data() {
    return {
      users: [],
      numberUser: [], // Mảng chứa dữ liệu số lượng người dùng
      infoUser: [],
      shopNonActive: [], // Mảng chứa dữ liệu shop không kích hoạt
    };
  },
  async created() {
    await this.getAllUser();
    await this.getUserRealtime();
    await this.getShopNonActive();
  },

  methods: {
    formatDay(day) {
      return dayjs(day).format("DD/MM/YYYY, HH:mm");
    },
    async getUserById(id) {
      try {
        const response = await userServices.getUserById(id);
        if (response && response.data) {
          this.infoUser = response.data; // Lưu dữ liệu vào mảng `infoUser`
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin người dùng",
        });
      }
    },
    async activeShop(id) {
      try {
        const response = await shopServices.activeShop(id);
        if (response && response.success == true) {
          Swal.fire({
            icon: "success",
            title: "Mở shop thành công",
          });
          this.getShopNonActive();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getShopNonActive() {
      try {
        const response = await shopServices.shopNonActive();
        if (response && response.data) {
          this.shopNonActive = response.data; // Lưu dữ liệu vào mảng `shopNonActive`
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi khi lấy thông tin tài khoản chưa kích hoạt",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi lấy thông tin người dùng",
        });
      }
    },
    async getUserRealtime() {
      try {
        const response = await userServices.updateNumberUser();

        if (response && response.data) {
          this.numberUser = response.data; // Lưu dữ liệu vào mảng `numberUser`
          this.updateChartData(); // Gọi phương thức cập nhật biểu đồ
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateChartData() {
      // Cập nhật dữ liệu của biểu đồ từ `numberUser`
      this.userGrowthData.datasets[0].data = this.numberUser;
    },
    async getAllUser() {
      try {
        const response = await userServices.getAllUsers();
        if (response && response.data) {
          this.users = response.data;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi lấy tài khoản người dùng",
        });
        console.error(error);
      }
    },
    async deleteUser(id, userId, name) {
      try {
        const result = await Swal.fire({
          title: `Bạn có muốn dừng hoạt động của tài khoản ${name} `,
          confirmButtonColor: "#DD6B55",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
          const response = await authServices.deleteUser(id);
          if (response && response.success) {
            this.getAllUser();
            Swal.fire({
              icon: "success",
              title: `Xóa tài khoản ${name} thành công`,
            });
            const user = await userServices.getUserById(userId);

            if (user) {
              const payload = {
                email: user.data.EMAIL_USER,
                name_account: name,
              };
              await emailServices.StopAccount(payload);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Xóa tài khoản thất bại",
              text: response.message,
            });
          }
        } else if (result.isDismissed) {
          Swal.fire({
            icon: "info",
            title: "Hủy bỏ",
            text: "Bạn đã hủy hành động xóa tài khoản.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi xóa tài khoản",
        });
      }
    },
    async reactive(id, userId, name) {
      try {
        const result = await Swal.fire({
          title: `Bạn có muốn cho tài khoản ${name} hoạt động trở lại `,
          confirmButtonColor: "#DD6B55",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
          const response = await authServices.reactive(id);
          if (response && response.success) {
            this.getAllUser();
            Swal.fire({
              icon: "success",
              title: `Kích hoạt lại tài khoản ${name} thành công`,
            });
            const user = await userServices.getUserById(userId);

            if (user) {
              const payload = {
                email: user.data.EMAIL_USER,
                name_account: name,
              };
              await emailServices.ReactiveAccount(payload);
            }
          }
        } else if (result.isDismissed) {
          Swal.fire({
            icon: "info",
            title: "Hủy bỏ",
            text: "Bạn đã hủy hành động kích hoạt lại tài khoản.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi kích hoạt lại tài khoản",
        });
      }
    },
    logout() {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      this.$router.push("/Admin/Login");
      this.accessToken = null;
    },
  },
};
</script>

<style scoped>
.background {
  background-color: #44ba69;
  padding: 20px;
  height: 100vh;
}
.dash-board-item {
  color: #fff;
}
.dash-board-list li {
  font-size: 18px;
  font-weight: 700;
  padding: 13px 0;
}
.number-user {
  display: block;
  flex-direction: row;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: justify;

  color: rgb(27, 37, 89);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow: none;
  padding: 20px 16px;
}
.is-active {
  background-color: #72c48c;
  color: #fff;
  padding: 5px;
  border-radius: 30px;
  font-weight: 700;
}
.non-active {
  background-color: rgb(221, 109, 109);
  color: #fff;
  padding: 5px;
  border-radius: 30px;
  font-weight: 700;
}
.text-title {
  margin: 0px;
  font-size: 18px;

  line-height: 1.43;
  color: rgb(163, 174, 208);
  font-weight: 500;
}
.icon-lock {
  font-size: 28px;
  color: #d2042d;
}
.icon-unlock {
  font-size: 28px;
  color: #0bda51;
}
.img-info {
  width: 100px;
  border-radius: 5%;
  object-fit: cover;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
}
.hover-name:hover {
  cursor: pointer;
  text-decoration: underline;
  color: #5f8575;
}
</style>
