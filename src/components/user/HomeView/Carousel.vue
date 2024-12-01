<template>
  <div id="carouselExampleIndicators" class="carousel slide">
    <div class="carousel-indicators">
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="0"
        class="active"
        aria-current="true"
        aria-label="Slide 1"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="1"
        aria-label="Slide 2"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="2"
        aria-label="Slide 3"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="3"
        aria-label="Slide 4"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="4"
        aria-label="Slide 5"
      ></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img
          src="/img/carousel/sg-11134258-7repz-m2j8gl96phzqcf_xxhdpi.png"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="/img/carousel/sg-11134258-7req2-m2j3ac3ovydc85_xxhdpi.png"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="/img/carousel/sg-11134258-7rep9-m2j33xyvnrk3f8_xxhdpi.png"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="/img/carousel/sg-11134258-7reom-m2j2xobtuvcrb5_xxhdpi.png"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="/img/carousel/sg-11134258-7ren7-m2j2fqgl4gs8d1_xxhdpi.png"
          class="d-block w-100"
          alt=""
        />
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
  <div class="container pt-3">
    <div class="d-flex justify-content-between">
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi"
          alt=""
        />
        <span>Voucher Giảm Đến 1 Triệu</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xhdpi"
          alt=""
        />
        <span>Miễn Phí Ship - Có Shopay</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-50009109-5bf65d4dc0eb8f6b42074751e8b736a7_xhdpi"
          alt=""
        />
        <span>Mua Nhiều Giảm Sâu</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4_xhdpi"
          alt=""
        />
        <span>Mã Giảm Giá</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-50009109-c02353c969d19918c53deaa4ea15bdbe_xhdpi"
          alt=""
        />
        <span>Shopay Style Voucher 30%</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/vn-11134258-7ras8-m2ujo91vppty7f_xhdpi"
          alt=""
        />
        <span>Hàng Quốc Tế</span>
      </div>
      <div class="img-header">
        <img
          src="https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85_xhdpi"
          alt=""
        />
        <span>Nạp Thẻ, Dịch Vụ & Vé Máy Bay</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.carousel-item img {
  /* Adjust height as needed */
  object-fit: cover;
  object-position: center;
}

.carousel-indicators {
  margin-bottom: 0.5rem;
}

.carousel-indicators button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.img-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.img-header img {
  width: 75px;

  object-fit: cover;
  object-position: center;
}
.img-header span {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}
</style>
