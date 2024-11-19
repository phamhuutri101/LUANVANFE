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
</template>

<script>
export default {};
</script>

<style scoped>
.carousel-item img {
  height: 300px; /* Adjust height as needed */
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
</style>
