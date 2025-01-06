;(() => {
  const init = async () => {
    try {
      showLoading() // lazy loading
      await fetchData()
      hideLoading()
      buildHTML()
      buildCSS()
      setEvents()
    } catch (e) {
      console.error('AJAX request failed:', e)
      hideLoading()
      buildHTML()
    }
  }

  let productData = []
  let currentIndex = 0
  let isDraggingFromNavigation = false

  const fetchData = async () => {
    const storedData = localStorage.getItem('productData')
    const parsedData = JSON.parse(storedData)

    if (Array.isArray(parsedData) && parsedData?.length > 0) {
      try {
        productData = parsedData
        return
      } catch (err) {
        console.error('Local Storage data is not in JSON format:', err)
        localStorage.removeItem('productData')
      }
    }

    // Direkt native fetch de kullanılabilirdi
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json',
        method: 'GET',
        success: function (data) {
          try {
            productData = JSON.parse(data)
            localStorage.setItem('productData', data)
            resolve()
          } catch (err) {
            console.error('JSON Parse error:', err)
            hideLoading()
            reject(err)
          }
        },
        error: function (xhr, status, error) {
          console.error('AJAX request failed:', status, error)
          hideLoading()
          reject(error)
        },
      })
    })
  }

  const buildHTML = () => {
    if (productData?.length > 0 && Array.isArray(productData)) {
      const html = `
      <div class="roof-recommendation-items">
        <div class="recommendation-carousel">
          <div class="carousel-container">
            <p class="carousel-title">You Might Also Like</p>
              <div class="carousel-wrapper">
                <div class="carousel-slider">
                    ${productData
                      .map(
                        (productData) => `
                        <div class="carousel-selected">
                          <div class="carousel-inner">
                            <div class="carousel-item">
                              <div class="carousel-image-wrapper">
                                <a href="${productData.url}" target="_blank"  >
                                    <img src="${productData.img}" alt="${productData.name}" class="product-image" >
                                </a>  
                                <div class="carousel-like-button"><i class="fa fa-heart-o"></i></div>
                              </div>
                              <div class="carousel-desc-wrapper">
                                <div class="title">
                                  <a href="${productData.url}" class="product-link" target="_blank">
                                    <p class="product-name">${productData.name}</p>
                                  </a>
                                </div>
                                <div class="price">
                                  <p class="current-price">${productData.price}</p>
                                </div>
                                <div class="new-product-cart"><button class="product-add-to-cart ">SEPETE EKLE</button></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        `
                      )
                      .join('')}
                </div>
                <button class="carousel-prev">‹</button>
                <button class="carousel-next">›</button>
              </div>
          </div>
        </div>
      </div>
      `
      $('.product-detail').after(html)
    } else {
      $('.product-detail').after('<p>Data could not be loaded.</p>')
    }
  }

  const buildCSS = () => {
    const css = `
    a {
      color: #428bca;
      text-decoration: none;
    }

    .roof-recommendation-items {
      background-color: #faf9f7;
      position: relative;
    }

    .recommendation-carousel {
      margin-left: 15px;
    }

    .carousel-wrapper {
      padding-bottom: 24px;
      display: flex;
      overflow:hidden;
    }

    .carousel-slider {
      position: relative;
      touch-action: pan-y pinch-zoom;
      display: flex;
      transition: transform 0.3s ease-in-out;
    }

    .carousel-like-button {
      cursor: pointer;
      position: absolute;
      top: 9px;
      right: 15px;
      width: 34px;
      height: 34px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
      border: solid .5px #b6b7b9;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .new-product-cart {
      display: none;
    }

    .carousel-selected {
      flex: 0 0 15.38%;
      padding-bottom: unset;
      height: unset;
      position: relative;
      display: block;
      box-sizing: border-box;
      margin: 0;
      list-style-type: none;
      float: left;
    }

    .carousel-inner {
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      position: unset;
    }
    
    .carousel-title {
      font-size: 24px;
      color: #29323b;
      line-height: 33px;
      font-weight: lighter;
      padding: 15px 0;
      margin: 0;
    }

    .carousel-item {
      text-align: center;
      box-sizing: border-box;
      color: #555;
      position: relative;
      background-color: #fff;
    }

    .carousel-item img {
      max-width: 100%;
      height: auto;
    }

    .carousel-prev, .carousel-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      z-index: 10;
    }

     .carousel-prev {
         left: 8%;
     }

     .carousel-next {
         right: 7%;
     }


    .product-link {
      text-decoration: none;
      color: black;
    }

    .product-image {
      width: 100%;
      height: 100%;
    }

    .carousel-image-wrapper {
      position: relative
    }

    .carousel-desc-wrapper {
      display: flex;
      flex-direction: column;
      padding: 0 10px;
    }

    .carousel-desc-wrapper .title {
      font-size: 14px;
      height: 30px;
      margin-top: 5px;
      white-space: initial;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .carousel-desc-wrapper .price {
      display: flex;
      align-items: flex-start;
      height: 50px;
      flex-direction: column;
      justify-content: flex-end;
    }

    .current-price {
      color: #193db0;
      font-size: 18px;
      display: inline-block;
      line-height: 22px;
      font-weight: bold;
    }

    .product-name {
      margin: 0 0 10px;
      text-align: left;
    }

    .spinner {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


@media (min-width: 992px) {
      .recommendation-carousel {
        display: flex !important;
        justify-content: center !important;
      }

      .carousel-container {
          display: block !important;
          width: 80% !important;
       }
    } 

        @media (max-width: 1200px) {
      .carousel-selected {
        flex: 0 0 calc(100% / 4) !important; 
      }
    }

    @media (max-width: 768px) {
      .carousel-selected {
        flex: 0 0 calc(100% / 3) !important; 
      }
    }

    @media(max-width: 992px) {
      .new-product-cart {
        display: flex !important;
        gap: 5px !important;
      }

      .product-add-to-cart {
        height: 35px;
        display: block;
        background-color: #193db0;
        color: #fff;
        width: 100%;
        border-radius: 5px;
        border: none;
        line-height: 19px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .carousel-prev, .carousel-next {
        display: none;
      }
    }

    `
    $('<style>').addClass('carousel-style').html(css).appendTo('head')
  }

  const setEvents = () => {
    $('.carousel-prev').on('click', () => moveCarousel('prev'))
    $('.carousel-next').on('click', () => moveCarousel('next'))

    $(document).on('click', '.carousel-like-button', function () {
      const index = $(this).closest('.carousel-selected').index()
      toggleFavorite(index)
    })

    applyFavorites()
    // _setDragEvents()
  }

  const moveCarousel = (direction) => {
    const totalItems = productData.length
    let itemsPerView = 6.5
    const itemWidth = 100 / itemsPerView
    const maxOffset = (totalItems - itemsPerView) * itemWidth

    let currentOffset = currentIndex * itemWidth
    if (direction === 'next' && currentOffset < maxOffset) {
      const remainingOffset = maxOffset - currentOffset
      currentOffset += remainingOffset < itemWidth ? remainingOffset : itemWidth
    } else if (direction === 'prev' && currentOffset > 0) {
      // currentOffset -= itemWidth + (remainingOffset > 0 ? remainingOffset : 0)
      currentOffset -= currentOffset < itemWidth ? currentOffset : itemWidth
    }

    $('.carousel-slider').css('transform', `translateX(-${currentOffset}%)`)

    currentIndex = currentOffset / itemWidth

    toggleNavigationButtons(currentOffset, maxOffset)
  }

  const toggleNavigationButtons = (currentOffset, maxOffset) => {
    $('.carousel-prev').prop('disabled', currentOffset <= 0)
    $('.carousel-next').prop('disabled', currentOffset >= maxOffset)
  }

  toggleNavigationButtons(
    0,
    (productData.length - 6.5) * (100 / productData.length)
  )

  const toggleFavorite = (index) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.includes(index)) {
      const newFavorites = favorites.filter((favIndex) => favIndex !== index)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(index)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    applyFavorites()
  }

  const applyFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || []
    $('.carousel-like-button i').each(function (index) {
      const isFavorite = favorites.includes(index)
      $(this)
        .toggleClass('fa-heart', isFavorite)
        .toggleClass('fa-heart-o', !isFavorite)
        .closest('.carousel-like-button')
        .css('color', isFavorite ? 'blue' : 'black')
    })
  }

  const showLoading = () => {
    const spinner = `<div class="spinner"></div>`
    $('.product-detail').after(spinner)
  }

  const hideLoading = () => {
    $('.spinner').remove()
  }

  const _setDragEvents = () => {
    const $slider = $('.carousel-wrapper')
    let isDragging = false
    let startX, scrollLeft

    // Mouse events
    $slider.on('mousedown', function (e) {
      isDragging = true
      $(this).addClass('active')
      startX = e.pageX - $(this).offset().left
      scrollLeft = $(this).scrollLeft()

      isDraggingFromNavigation = true
    })

    $(document).on('mouseup', function () {
      isDragging = false
      $slider.removeClass('active')

      setTimeout(() => (isDraggingFromNavigation = false), 100)
    })

    $(document).on('mousemove', function (e) {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - $slider.offset().left
      const walk = (x - startX) * 2 // scroll-fast
      $slider.scrollLeft(scrollLeft - walk)
    })

    // Touch events
    $slider.on('touchstart', function (e) {
      isDragging = true
      startX = e.originalEvent.touches[0].pageX - $(this).offset().left
      scrollLeft = $(this).scrollLeft()

      isDraggingFromNavigation = true
    })

    $slider.on('touchend', function () {
      isDragging = false

      setTimeout(() => (isDraggingFromNavigation = false), 100)
    })

    $slider.on('touchmove', function (e) {
      if (!isDragging) return
      const x = e.originalEvent.touches[0].pageX - $(this).offset().left
      const walk = (x - startX) * 2
      $(this).scrollLeft(scrollLeft - walk)
    })
  }

  init()
})()
