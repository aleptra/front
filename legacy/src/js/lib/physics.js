libAttribute.push({
  'attr': 'slide',
  'func': 'slide'
})

var slideIndex = 1

function slide(e) {

  params = e.getAttribute("slide").toObject()
  console.dir(params)
  //console.log(obj['domain']);

  var jdata = JSON.parse(JSON.stringify(e.getAttribute("slide").toString()))
  console.dir(jdata)

  showSlides(slideIndex)
}

function plusSlides(n) {
  showSlides(slideIndex += n)
}

function slideTo(n) {
  showSlides(slideIndex = n)
}

function showSlides(n) {
  var i
  var slides = document.getElementsByClassName("slide")
  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
  }
  slides[slideIndex - 1].style.display = "inherit"
}