<template>
  <div class="container mt-4">
    <div id="carouselExample" class="carousel slide">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="../../public/img/carousel/3a441455-ffcb-412d-b4f0-564aaaac1218_VN-1976-688.jpg_2200x2200q80 (1).jpg"
            class="d-block w-100"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            src="../../public/img/carousel/3a441455-ffcb-412d-b4f0-564aaaac1218_VN-1976-688.jpg_2200x2200q80.jpg"
            class="d-block w-100"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            src="../../public/img/carousel/83556c2b-a9f4-418a-ab44-55fd0ed30650_VN-1976-688.jpg_2200x2200q80.jpg"
            class="d-block w-100"
            alt="..."
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="row pt-5">
      <!-- Sản phẩm 1 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 1"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 1</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">500.000₫</p>
              <p class="card-text text-secondary"><s>1.000.000₫</s></p>
            </div>

            <p class="card-text">Hà Nội</p>
          </div>
        </div>
      </div>
      <!-- Sản phẩm 2 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 2"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 2</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">300.000₫</p>
              <p class="card-text text-secondary"><s>600.000₫</s></p>
            </div>

            <p class="card-text">Hồ Chí Minh</p>
          </div>
        </div>
      </div>
      <!-- Sản phẩm 3 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 3"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 3</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">150.000₫</p>
              <p class="card-text text-secondary"><s>300.000₫</s></p>
            </div>

            <p class="card-text">Đà Nẵng</p>
          </div>
        </div>
      </div>
      <!-- Sản phẩm 4 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 4"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 4</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">250.000₫</p>
              <p class="card-text text-secondary"><s>500.000₫</s></p>
            </div>

            <p class="card-text">Cần Thơ</p>
          </div>
        </div>
      </div>
      <!-- Sản phẩm 5 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 5"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 5</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">200.000₫</p>
              <p class="card-text text-secondary"><s>400.000₫</s></p>
            </div>

            <p class="card-text">Nha Trang</p>
          </div>
        </div>
      </div>
      <!-- Sản phẩm 6 -->
      <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-4">
        <div class="card">
          <img
            src="https://via.placeholder.com/150"
            class="card-img-top"
            alt="Sản phẩm 6"
          />
          <div class="card-body">
            <h5 class="card-title">Tên sản phẩm 6</h5>
            <div class="d-flex justify-content-between">
              <p class="card-text text-danger">450.000₫</p>
              <p class="card-text text-secondary"><s>900.000₫</s></p>
            </div>
            <p class="card-text">Hải Phòng</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
};
</script>
