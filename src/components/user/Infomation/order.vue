<template>
  <div class="col-md-9 background-component background-height p-4">
    <!-- modal đánh giá sp -->
    <div
      class="modal modal-lg fade"
      id="ratingModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="ratingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title text-title fs-5" id="ratingModalLabel">
              Đánh Giá Sản Phẩm
            </h1>
          </div>
          <div
            class="modal-body"
            v-if="orderDataRating"
            v-for="item in orderDataRating.LIST_PRODUCT"
            :key="item._id"
          >
            <div class="card">
              <div class="card-body">
                <p>{{ item.NAME_PRODUCT }}</p>
                <div class="d-flex">
                  <p class="classify">Phân loại hàng:</p>
                  <p
                    class="px-1 classify"
                    v-for="classify in item.LIST_MATCH_KEY"
                    :key="classify._id"
                  >
                    {{ classify.VALUE }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label class="product_quality">Chất lượng sản phẩm</label>
              <div class="">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['bi', n <= item.rating ? 'bi-star-fill' : 'bi-star']"
                  @click="item.rating = n"
                  style="color: gold; cursor: pointer; font-size: 25px"
                ></i>
              </div>
              <div class="px-3">
                <small v-if="item.rating === 5" class="text-warning text-rating"
                  >Tuyệt vời</small
                >
                <small v-if="item.rating === 4" class="text-warning text-rating"
                  >Hài lòng</small
                >
                <small
                  v-if="item.rating === 3"
                  class="text-secondary text-rating"
                  >Bình thường</small
                >
                <small
                  v-if="item.rating === 2"
                  class="text-secondary text-rating"
                  >Không hài lòng</small
                >
                <small
                  v-if="item.rating === 1"
                  class="text-secondary text-rating"
                  >Tệ</small
                >
              </div>
            </div>

            <div class="mb-3">
              <textarea
                class="form-control"
                id="reviewText"
                rows="5"
                placeholder="để lại đánh giá."
                v-model="item.desc_reviews"
              ></textarea>
            </div>

            <div class="mb-3">
              <button class="btn btn-outline-success me-2">
                <i class="bi bi-camera"></i> Thêm Hình ảnh
                <input
                  class="input-file"
                  type="file"
                  @change="UploadFile($event, item)"
                  multiple
                />
              </button>
              <div v-if="item.images && item.images.length > 0">
                <h5>Hình ảnh đã upload:</h5>
                <div class="uploaded-images">
                  <img
                    v-for="image in item.images"
                    :key="image._id"
                    :src="image.file_url"
                    alt="Uploaded Image"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer sticky-position">
            <button
              type="button"
              class="btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              TRỞ LẠI
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitRating()"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Hoàn Thành
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal đánh giá sp -->
    <!-- modal Hủy đơn -->
    <div
      class="modal fade"
      id="cancelOrder"
      tabindex="-1"
      aria-labelledby="cancelOrderLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="cancelOrderLabel">Hủy đơn hàng</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label for="color" class="form-label">Lý do hủy đơn</label>
            <select
              class="form-select"
              v-model="payloadCancelOrder.content_cancel"
            >
              <option
                selected
                value="Tôi muốn thay đổi sản phẩm (Kích thước, màu sắc, số lượng ...)<"
              >
                Tôi muốn thay đổi sản phẩm (Kích thước, màu sắc, số lượng ...)
              </option>
              <option value="Tôi muốn cập nhật địa chỉ/sdt nhận hàng">
                Tôi muốn cập nhật địa chỉ/sdt nhận hàng
              </option>
              <option value="Tôi không có nhu cầu mua nữa">
                Tôi không có nhu cầu mua nữa
              </option>
              <option value="Người bán xác nhận gửi sai hàng">
                Người bán xác nhận gửi sai hàng
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              @click="cancelOrder()"
              type="button"
              class="btn btn-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- modal Hủy đơn -->
    <ul
      class="nav nav-pills mb-3 d-flex justify-content-between"
      id="pills-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="AllOrder-tab"
          data-bs-toggle="pill"
          data-bs-target="#AllOrder"
          type="button"
          role="tab"
          aria-controls="AllOrder"
          aria-selected="true"
        >
          Tất cả
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
        >
          Chờ xác nhận
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="pills-contact-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-contact"
          type="button"
          role="tab"
          aria-controls="pills-contact"
          aria-selected="false"
        >
          Đang xử lý
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="sendProduct-tab"
          data-bs-toggle="pill"
          data-bs-target="#sendProduct"
          type="button"
          role="tab"
          aria-controls="sendProduct"
          aria-selected="false"
        >
          Đã gửi hàng
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="success-order-tab"
          data-bs-toggle="pill"
          data-bs-target="#success-order"
          type="button"
          role="tab"
          aria-controls="success-order"
          aria-selected="false"
        >
          Hoàn thành
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="cancel-order-tab"
          data-bs-toggle="pill"
          data-bs-target="#cancel-order"
          type="button"
          role="tab"
          aria-controls="cancel-order"
          aria-selected="false"
        >
          Đã hủy
        </button>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="AllOrder"
        role="tabpanel"
        aria-labelledby="AllOrder-tab"
      >
        <div class="wrap" v-for="item in orders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)">
              <i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span v-if="item.lastStatusCode === 4"
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <span v-if="item.lastStatusCode === 7">Đơn hàng đã hủy</span>
              <span v-if="item.lastStatusCode < 4"
                >Bạn có thể "hủy đơn" nếu có vấn đề về đơn hàng</span
              >
              <div v-if="item.lastStatusCode === 6">
                <span v-if="item.is_reviews == false"
                  >Đơn hàng đã hoàn thành vui lòng cho biết cảm nhận sản phẩm
                  bằng cách đánh giá sản phẩm</span
                >
                <span v-else>đơn hàng của bạn đã hoàn thành</span>
              </div>

              <div class="confirm d-flex">
                <div v-if="item.lastStatusCode === 6">
                  <button
                    v-if="item.is_reviews == false"
                    data-bs-toggle="modal"
                    data-bs-target="#ratingModal"
                    @click="getOrderSuccessById(item._id)"
                  >
                    Đánh giá
                  </button>
                  <button v-else>Đã đánh giá</button>
                </div>

                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button
                  v-if="item.lastStatusCode < 4"
                  data-bs-toggle="modal"
                  data-bs-target="#cancelOrder"
                  @click="getIdOrderCancelOrder(item._id)"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
      >
        <div class="wrap" v-for="item in pendingOrders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)">
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span>Bạn có thể "hủy đơn" nếu có vấn đề về đơn hàng</span>
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button
                  v-if="item.lastStatusCode < 4"
                  data-bs-toggle="modal"
                  data-bs-target="#cancelOrder"
                  @click="getIdOrderCancelOrder(item._id)"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="pills-contact"
        role="tabpanel"
        aria-labelledby="pills-contact-tab"
      >
        <div class="wrap" v-for="item in confirmedOrders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span>Bạn có thể "hủy đơn" nếu có vấn đề về đơn hàng</span>
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button
                  v-if="item.lastStatusCode < 4"
                  data-bs-toggle="modal"
                  data-bs-target="#cancelOrder"
                  @click="getIdOrderCancelOrder(item._id)"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="sendProduct"
        role="tabpanel"
        aria-labelledby="sendProduct-tab"
      >
        <div class="wrap" v-for="item in processingOrders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)">
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
              <span>Giảm giá</span>
              <span class="text-danger">{{
                formatNumber(item.PRICE_REDUCED)
              }}</span>
            </div>
            <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
              <span>Phí vận chuyển</span>
              <span class="text-danger">{{
                formatNumber(item.SHIPPING_FEE)
              }}</span>
            </div>
            <hr />
            <div class="total-price text-end" v-if="item.ORDER_PRICE">
              <span>Thành tiền</span>
              <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
            </div>
            <div class="notification d-flex">
              <span
                >Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.</span
              >
              <div class="confirm d-flex">
                <button
                  v-if="item.lastStatusCode === 4"
                  @click="receivedProduct(item.ACCOUNT__ID, item._id)"
                >
                  Đã nhận hàng
                </button>
                <button
                  v-if="item.lastStatusCode < 4"
                  data-bs-toggle="modal"
                  data-bs-target="#cancelOrder"
                  @click="getIdOrderCancelOrder(item._id)"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="success-order"
        role="tabpanel"
        aria-labelledby="success-order-tab"
      >
        <div class="wrap" v-for="item in completedOrders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end">
              <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
                <span>Giảm giá</span>
                <span class="text-danger">{{
                  formatNumber(item.PRICE_REDUCED)
                }}</span>
              </div>
              <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
                <span>Phí vận chuyển</span>
                <span class="text-danger">{{
                  formatNumber(item.SHIPPING_FEE)
                }}</span>
              </div>
              <hr />
              <div class="total-price text-end" v-if="item.ORDER_PRICE">
                <span>Thành tiền</span>
                <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
              </div>
            </div>
            <div class="notification d-flex justify-content-between">
              <span v-if="item.is_reviews == false"
                >Đơn hàng đã hoàn thành vui lòng cho biết cảm nhận sản phẩm bằng
                cách đánh giá sản phẩm</span
              >
              <span v-else>đơn hàng của bạn đã hoàn thành</span>
              <div class="confirm d-flex">
                <button
                  v-if="item.is_reviews == false"
                  data-bs-toggle="modal"
                  data-bs-target="#ratingModal"
                  @click="getOrderSuccessById(item._id)"
                >
                  Đánh giá
                </button>
                <button v-else>Đã đánh giá</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="cancel-order"
        role="tabpanel"
        aria-labelledby="cancel-order-tab"
      >
        <div class="wrap" v-for="item in cancelledOrders" :key="item._id">
          <div class="title-order d-flex border-bottom">
            <span>{{ item.shopName }}</span>
            <span class="show-shop" @click="gotoDetailShop(item.ACCOUNT__ID)"
              ><i class="fa-solid fa-shop"></i> Xem shop</span
            >
          </div>
          <div
            class="body-order d-flex border-bottom justify-content-between"
            v-for="classify in item.LIST_PRODUCT"
            :key="classify._id"
          >
            <div class="img_name_product d-flex py-4">
              <div class="img">
                <img
                  :src="item.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                  alt="Hình ảnh"
                />
              </div>
              <div class="name px-2">
                <span>{{ classify.productName }}</span>
                <span class="d-block classify py-2"
                  >Phân loại hàng:
                  <span
                    class="px-2"
                    v-for="classify1 in classify.LIST_MATCH_KEY"
                    :key="classify1._id"
                  >
                    {{ classify1.KEY }} {{ classify1.VALUE }}</span
                  >
                </span>

                <span class="d-block">x{{ classify.QLT }}</span>
              </div>
            </div>
            <div class="price_product d-flex align-items-center">
              <span>{{ formatNumber(classify.UNITPRICES) }}</span>
            </div>
          </div>
          <div class="footer-order py-4">
            <div class="total-price text-end">
              <div class="total-price text-end py-1" v-if="item.PRICE_REDUCED">
                <span>Giảm giá</span>
                <span class="text-danger">{{
                  formatNumber(item.PRICE_REDUCED)
                }}</span>
              </div>
              <div class="total-price text-end py-1" v-if="item.SHIPPING_FEE">
                <span>Phí vận chuyển</span>
                <span class="text-danger">{{
                  formatNumber(item.SHIPPING_FEE)
                }}</span>
              </div>
              <hr />
              <div class="total-price text-end" v-if="item.ORDER_PRICE">
                <span>Thành tiền</span>
                <span>{{ formatNumber(item.ORDER_PRICE) }}</span>
              </div>
            </div>
            <div class="notification d-flex justify-content-between">
              <div class="confirm d-flex">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#ratingModal"
                  @click="getOrderSuccessById(item._id)"
                >
                  Chi tiết đơn hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VPagination
        v-model="page"
        :pages="currentMaxPage"
        :range-size="5"
        active-color="#DCEDFF"
        @update:modelValue="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import orderServices from "@/services/order.services";
import productServices from "@/services/product.services";
import { formatNumber } from "@/utils/formatNumber";

import uploadServices from "@/services/upload.services";
import shopServices from "@/services/shop.services";
import reviewServices from "@/services/review.services";
export default {
  components: {
    VPagination,
  },
  data() {
    return {
      payloadCancelOrder: {
        id_order: "",
        content_cancel: "",
      },
      orders: [],
      orderSuccess: [],
      reviewId: "",
      rating: 0,
      reviewContent: "",
      orderDataRating: null,
      page: 1,
      limit: 10,
      currentMaxPage: 1,
    };
  },
  created() {
    this.getOrder();
    this.getOrderSuccess();
  },
  computed: {
    // Filter orders by status
    allOrders() {
      return this.orders;
    },
    pendingOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 1
      );
    },
    confirmedOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 3
      );
    },
    processingOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 4
      );
    },
    completedOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 6
      );
    },
    cancelledOrders() {
      return this.orders.filter(
        (order) => order.LIST_STATUS.at(-1)?.STATUS_CODE === 7
      );
    },
  },

  methods: {
    async getOrder() {
      const order = await orderServices.getOrderUser(this.page, this.limit);
      // Sau khi lấy danh sách đơn hàng, gọi API để lấy tên sản phẩm
      for (const item of order.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
          item.shopName = await this.getNameShopByAccountId(item.ACCOUNT__ID);
          item.is_reviews = await this.is_review(item._id);
        }
      }
      this.orders = order.data;
      this.orders.sort(
        (a, b) => new Date(b.TIME_PAYMENT) - new Date(a.TIME_PAYMENT)
      );
      for (const item of this.orders) {
        const response = await orderServices.getLastStatusOrder(item._id);

        item.lastStatusCode = response.data;
      }
      if (this.orders.length < this.limit) {
        this.currentMaxPage = this.page;
      } else {
        // Set currentMaxPage to allow for another page
        this.currentMaxPage = this.page + 1;
      }
    },
    async getOrderSuccess() {
      const orderSuccess = await orderServices.getSuccessPaymentOrder();
      for (const item of orderSuccess.data) {
        for (const classify of item.LIST_PRODUCT) {
          const productName = await this.getNameProduct(classify.ID_PRODUCT);
          classify.productName = productName;
        }
      }
      this.orderSuccess = orderSuccess.data;
    },
    async getOrderSuccessById(id) {
      const response = await orderServices.getOrderById(id);
      for (const item of response.data.LIST_PRODUCT) {
        const NAME_PRODUCT = await this.getNameProduct(item.ID_PRODUCT);
        item.NAME_PRODUCT = NAME_PRODUCT;
        item.rating = 0;
        item.desc_reviews = "";
        item.classify = item.LIST_MATCH_KEY.map((key) => key.VALUE).join(", "); // Ghép các giá trị phân loại thành chuỗi
      }
      this.orderDataRating = response.data;
    },
    async getNameProduct(id) {
      const response = await productServices.getById(id);

      return response.data.NAME_PRODUCT;
    },
    calculateTotalPrice(order) {
      return order.LIST_PRODUCT.reduce((total, item) => {
        return total + item.UNITPRICES * item.QLT; // Giá * Số lượng
      }, 0); // Bắt đầu từ 0
    },
    formatNumber(number) {
      return formatNumber(number);
    },
    setRating(n, item) {
      item.rating = n;
    },
    async UploadFile(event, item) {
      const files = Array.from(event.target.files);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("imgs", file);
        });
        const response = await uploadServices.uploadFiles(formData);
        const uploadedImages = response.data.map((file) => ({
          file_url: file.url,
          file_type: file.type,
        }));
        if (!item.images) {
          item.images = []; // Khởi tạo mảng nếu chưa có
        }
        item.images.push(...uploadedImages); // Thêm các hình ảnh vào mảng images của sản phẩm
      } catch (error) {
        console.error(error);
      }
    },
    async receivedProduct(id_account, id_order) {
      const payload = {
        id_order: id_order,
      };
      try {
        await orderServices.receivedGoods(id_account, payload);

        this.getOrder();
      } catch (error) {
        console.error(error);
      }
    },
    async submitRating() {
      if (!this.orderDataRating) return;

      const reviews = this.orderDataRating.LIST_PRODUCT.map((item) => ({
        ID_PRODUCT: item.ID_PRODUCT,
        id_account_shop: this.orderDataRating.ACCOUNT__ID,
        id_order: this.orderDataRating._id,
        number_start: item.rating,
        desc_reviews: item.desc_reviews,
        img_url: item.images.map((img) => img.file_url),
        classify: item.classify,
      }));
      try {
        for (const review of reviews) {
          const payload = {
            number_start: review.number_start,
            desc_reviews: review.desc_reviews,
            img_url: review.img_url,
            classify: review.classify,
            id_account_shop: review.id_account_shop,
            id_order: review.id_order,
          };
          // Gọi API với ID_PRODUCT và payload trong vòng lặp
          const response = await reviewServices.AddReviews(
            review.ID_PRODUCT,
            payload
          );
          console.log(
            "Dữ liệu đánh giá gửi thành công cho sản phẩm",
            review.ID_PRODUCT,
            response
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    async cancelOrder() {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn hủy đơn hàng ?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`,
      });
      if (result.isConfirmed) {
        await orderServices.cancelOrder(this.payloadCancelOrder);
        this.getOrder();
      }
    },
    getIdOrderCancelOrder(id) {
      this.payloadCancelOrder.id_order = id;
      console.log(this.payloadCancelOrder);
    },
    async getNameShopByAccountId(id_account) {
      const response = await shopServices.getNameShopByAccountId(id_account);
      if (response && response.data) {
        // Lưu tên shop vào biến tương ứng trong cart
        return response.data;
      }
      return ""; // Trả về chuỗi rỗng nếu không có kết quả
    },
    async is_review(id) {
      try {
        const response = await reviewServices.is_review(id);
        if (response && response.data) {
          return response.data;
        }
        return false;
      } catch (error) {
        console.error(error);
      }
    },
    onPageChange(newPage) {
      this.page = newPage;
      this.getOrder();
    },
    gotoDetailShop(id_account) {
      this.$router.push({ name: "ShopDetail", params: { id: id_account } });
    },
  },
};
</script>

<style scoped>
/* Container styles */
.background-component {
  background: #f6f9fc;
  border-radius: 12px;
  padding: 20px;
}

/* Tab navigation styles */
.nav-pills {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
}

.nav-pills .nav-link {
  color: #666;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-pills .nav-link.active {
  background: #09884d;
  color: white;
}

/* Order card styles */
.wrap {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  overflow: hidden;
}

/* Shop header */
.title-order {
  background: #fafafa;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.show-shop {
  color: #09884d;
  font-size: 14px;
  cursor: pointer;
}

.show-shop i {
  margin-right: 5px;
}

/* Product section */
.body-order {
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.img img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.name {
  font-size: 14px;
  color: #333;
}

.classify {
  color: #666;
  font-size: 13px;
  margin: 8px 0;
}

.price_product {
  color: #09884d;
  font-weight: 600;
  font-size: 16px;
}

/* Footer section */
.footer-order {
  background: #fafafa;
  padding: 20px;
}

.total-price {
  margin: 10px 0;
}

.total-price span:first-child {
  color: #666;
  margin-right: 15px;
}

.total-price span:last-child {
  color: #09884d;
  font-weight: 600;
  font-size: 18px;
}

/* Buttons */
.confirm button {
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

button[data-bs-target="#cancelOrder"] {
  background: #dc3545;
  color: white;
}

button[data-bs-target="#ratingModal"] {
  background: #09884d;
  color: white;
}

.confirm button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Notification text */
.notification {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: 15px;
  border-top: 1px solid #eee;
}

.notification span {
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  flex: 1;
  margin-right: 20px;
}

/* Upload section */
.uploaded-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.uploaded-images img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-pills {
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav-pills .nav-link {
    width: 100%;
    text-align: center;
  }

  .notification {
    flex-direction: column;
    gap: 15px;
  }

  .notification span {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .confirm {
    width: 100%;
  }

  .confirm button {
    width: 100%;
    margin: 5px 0;
  }
}

/* Animation */
.wrap {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
