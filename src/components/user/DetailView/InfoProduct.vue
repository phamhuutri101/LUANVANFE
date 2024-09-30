<template>
  <div class="col-7">
    <div class="text-title">
      <p>
        {{ product.NAME_PRODUCT }}
      </p>
    </div>
    <div class="price">
      <span>69.000đ - 129.000</span>
    </div>
    <div
      v-for="(key, index) in product.LIST_PRODUCT_METADATA"
      :key="index"
      class="row key-value"
    >
      <div class="col-2 key">
        <span>{{ key.KEY }}</span>
      </div>
      <div class="col-10 d-flex">
        <div class="value" v-for="(value, index) in key.VALUE" :key="index">
          <span>{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="row number-cart">
      <div class="col-2 number">
        <span> Số lượng</span>
      </div>
      <div class="col-10">
        <div class="add-cart d-flex">
          <span>-</span>
          <span>1</span>
          <span>+</span>
          <p class="product-available">
            {{ product.NUMBER_INVENTORY_PRODUCT }} sản phẩm có sẵn
          </p>
        </div>
      </div>
    </div>
    <div class="add-to-cart-and-buy">
      <button type="submit" class="add-cart">
        <i class="fa-solid fa-cart-shopping"></i>Thêm Vào Giỏ Hàng
      </button>
      <button type="submit" class="buy">Mua Ngay</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.text-title {
  font-size: 20px;
  font-weight: 450;
}
.price span {
  color: #d0011b;
  font-size: 35px;
  font-weight: 500;
}
.key {
  display: flex;
  align-items: center;
}
.key span,
.number span {
  color: #757575;
  flex-shrink: 0;
  font-size: inherit;
  font-weight: 400;
  margin: 0;
  text-transform: capitalize;
  width: 110px;
}
.key-value,
.number-cart {
  padding: 20px 0;
}
.value {
  display: flex;
  flex-wrap: wrap;
}

.value span {
  padding: 5px 25px;
  border: 1px solid #ebebeb;
  margin-left: 7px;
  font-size: 14px;
  margin-bottom: 7px; /* Thêm khoảng cách bên dưới để tránh chồng lên nhau */
}
.value span:hover {
  border: 1px solid #09884d; /* Thay đổi màu viền khi hover */
  transform: scale(1.09);
  transition: 0.2s ease;
  cursor: pointer;
}
.add-cart span {
  border: 1px solid #ebebeb;
  padding: 5px 15px;
  font-size: 14px;
}
.product-available {
  margin: 0;
  align-items: center;
  display: flex;
  padding-left: 40px;
  color: #757575;
  font-size: 14px;
}
.add-to-cart-and-buy {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.add-to-cart-and-buy .add-cart {
  background-color: #09884d;
  color: #ffffff;
  border: none;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 5px;
  margin-right: 10px;
}
.add-to-cart-and-buy .buy {
  background-color: #d3344c;
  color: #fff;
  border: none;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 5px;
}
.add-to-cart-and-buy .add-cart i {
  margin-right: 10px;
}
</style>
