document.addEventListener("turbolinks:load", function () {
  ////トップページのキャンペーンバナー////
  $(".campaigns").slick({
    dots: true, // 下部の点々を表示する
    dotsClass: "slick-dots campaign-dots", // 点々のclassを指定する
    prevArrow: `<button type="button" class="slick-prev campaign-arrow-prev">Previous</button>`, // 矢印のcssを指定する
    nextArrow: `<button type="button" class="slick-next campaign-arrow-next">Next</button>` // 矢印のcssを指定する
  });
  ////トップページのキャンペーンバナー////

  ////トップページの新着商品一覧////
  $(".auto-slick").slick({
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    autoplay: true
  });
  ////トップページの新着商品一覧////

  ////商品詳細ページの写真一覧////
  $(".item-images__main-images").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    waitForAnimate: false,
    speed: 300
  });
  $(".item-images__mini-images").slick({
    slidesToShow: 5,
    asNavFor: ".item-images__main-images",
    infinite: false,
    focusOnSelect: true
  });

  $(".item-images__mini-images img").on("mouseover", function () {
    $(this).click();
  });
  ////商品詳細ページの写真一覧////
});
