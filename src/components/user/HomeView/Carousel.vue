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
    </div>
    <div class="carousel-inner carousel-inner-custom">
      <div class="carousel-item active">
        <img
          src="../../../../public/img/carousel/pexels-mnzoutfits-1670770.jpg"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="../../../../public/img/carousel/pexels-andersonguerra-1115128.jpg"
          class="d-block w-100"
          alt=""
        />
      </div>
      <div class="carousel-item">
        <img
          src="../../../../public/img/carousel/9d1217ab-b8ec-48ca-bd77-1ede59de43e3.jpg"
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
</template>

<script>
export default {};
</script>

<style scoped>
.carousel-inner-custom {
  height: 400px;
  object-fit: cover;
}
</style>
