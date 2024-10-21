class Carousel {
	constructor(el) {
		this.el = el;
		this.currentOffset = 0;
		let middle = Math.ceil(this.getCards().length / 2 - 1);
		if (window.innerWidth > 576) {
			this.activeIndex = middle;
			if (this.getCards().length % 2 == 0) {
				this.offset(-0.5);
			}
		} else {
			this.activeIndex = 0;
			this.offset(-middle);
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
		// return (
		// 	this.el.querySelector(".container").offsetWidth /
		// 	this.getCards().length
		// );
		return this.getCards()[1].offsetWidth;
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
		modifier = 1;
		if (el.classList.contains("left")) {
			modifier = -1;
		}
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
