class Carousel {
	constructor(el) {
		this.el = el;
		this.currentOffset = 0;
		this.startX = 0;
		this.threshold = 30;

		let middle = Math.ceil(this.getCards().length / 2 - 1);
		if (window.innerWidth > 576) {
			this.activeIndex = middle;
			if (this.getCards().length % 2 == 0) {
				this.offset(-0.5);
			}
		} else {
			this.activeIndex = 0;
		}

		for (let card of this.getCards()) {
			if (card != this.activeCard()) {
				card.classList.add("inactive");
			}
			card.addEventListener("click", function () {
				processInput(this);
			});
		}

		let buttons = this.el.querySelectorAll(".nav-buttons button");

		if (buttons.length > 0) {
			buttons[0].classList.add("left");

			for (let button of buttons) {
				button.addEventListener("click", function () {
					processInput(this);
				});
			}
		}

		let indicatorBar = document.createElement("div");
		indicatorBar.classList.add("indicator-bar");

		for (let i = 0; i < this.getCards().length; i++) {
			let indicator = document.createElement("div");
			indicator.classList.add("indicator");
			let dot = document.createElement("div");
			dot.classList.add("dot");
			indicator.appendChild(dot);
			if (i != this.activeIndex) {
				dot.classList.add("inactive");
			}
			indicator.addEventListener("click", function () {
				processInput(this);
			});

			indicatorBar.appendChild(indicator);
		}

		this.el.appendChild(indicatorBar);

		this.el.addEventListener("wheel", (event) => {
			this.handleScroll(event);
		});

		this.el.addEventListener("touchstart", (event) => {
			this.handleTouchStart(event);
		});
		this.el.addEventListener("touchmove", (event) => {
			this.handleTouchMove(event);
		});
		this.el.addEventListener("touchend", (event) => {
			this.handleTouchEnd(event);
		});
	}
	handleTouchStart(event) {
		this.startX = event.touches[0].clientX;
	}
	handleTouchMove(event) {
		event.preventDefault();
	}
	handleTouchEnd(event) {
		const endX = event.changedTouches[0].clientX;
		const delta = this.startX - endX;
		console.log(delta);
		this.scrollMove(delta);
	}
	handleScroll(event) {
		this.startX += event.deltaX;
		console.log(this.startX);
		this.scrollMove(this.startX);
	}
	scrollMove(distance) {
		if (Math.abs(distance) >= this.threshold) {
			this.move(distance > 0 ? 1 : -1);
			this.startX = 0;
		}
	}
	move(modifier) {
		let newIndex = this.activeIndex + modifier;

		if (!(newIndex < 0 || newIndex > this.getCards().length - 1)) {
			this.updateIndex(newIndex);
			this.offset(modifier);
		}
	}
	updateIndex(index) {
		this.activeCard().classList.add("inactive");
		this.activeDot().classList.add("inactive");
		this.activeIndex = index;
		this.activeCard().classList.remove("inactive");
		this.activeDot().classList.remove("inactive");
	}
	offset(modifier) {
		this.currentOffset -= modifier;
		let offsetValue = this.getOffsetValue();
		this.setPixelOffset(this.currentOffset * offsetValue);
	}
	getOffsetValue() {
		return (
			this.el.querySelector(".container").offsetWidth /
			this.getCards().length
		);
		// return this.getCards()[1].offsetWidth;
	}
	setPixelOffset(pixelOffset) {
		this.el.querySelector(
			".container"
		).style.transform = `translateX(${pixelOffset}px)`;
	}
	getCards() {
		return this.el.querySelectorAll(".container .card");
	}
	getIndicators() {
		return this.el.querySelectorAll(".indicator");
	}
	activeDot() {
		return this.getIndicators()[this.activeIndex].firstChild;
	}
	activeCard() {
		return this.getCards()[this.activeIndex];
	}

	getIndex(element) {
		let elements = [];
		if (element.classList.contains("card")) {
			elements = this.getCards();
		} else if (element.classList.contains("indicator")) {
			elements = this.getIndicators();
		}

		for (let i = 0; i < elements.length; i++) {
			if (elements[i] == element) {
				return i;
			}
		}
	}
}

function onResize() {
	for (let carousel of carousels) {
		let offset = carousel.currentOffset;
		carousel.offset(-offset);
		carousel.setPixelOffset(0);
		carousel.offset(offset);
	}
}

function getCarouselIndex(carouselEl) {
	for (let i = 0; i < carousels.length; i++) {
		if (carousels[i].el == carouselEl) {
			return i;
		}
	}

	// return 0;
}

let carousels = [];

function processInput(el) {
	let carouselEl = el.parentElement.parentElement;
	carousel = carousels[getCarouselIndex(carouselEl)];

	let modifier = 0;

	if (el.classList.contains("card") || el.classList.contains("indicator")) {
		modifier = carousel.getIndex(el) - carousel.activeIndex;
	} else {
		modifier = el.classList.contains("left") ? 1 : -1;
	}

	carousels[getCarouselIndex(carouselEl)].move(modifier);
}

function onReady() {
	for (let carouselEl of document.querySelectorAll(".carousel")) {
		carousels.push(new Carousel(carouselEl));
	}
}

window.onload = onReady;
window.onresize = onResize;
