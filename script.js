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

		this.activeCard().classList.add("active");
	}
	move(modifier) {
		let newIndex = this.activeIndex + modifier;

		if (!(newIndex < 0 || newIndex > this.getCards().length - 1)) {
			this.activeCard().classList.remove("active");
			this.activeIndex = newIndex;
			this.activeCard().classList.add("active");

			this.offset(modifier);
		}
	}
	offset(modifier) {
		this.currentOffset -= modifier;
		let offsetValue = this.getCards()[1].offsetWidth;
		this.setPixelOffset(this.currentOffset * offsetValue);
	}
	setPixelOffset(pixelOffset) {
		this.el.querySelector(
			".container"
		).style.transform = `translateX(${pixelOffset}px)`;
	}
	getCards() {
		return this.el.querySelectorAll(".container .card");
	}
	getCardIndex(card) {
		let cards = this.getCards();
		for (let i = 0; i < cards.length; i++) {
			if (cards[i] == card) {
				return i;
			}
		}
	}
	activeCard() {
		return this.getCards()[this.activeIndex];
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

let carousels = [];

function getCarouselIndex(carouselEl) {
	for (let i = 0; i < carousels.length; i++) {
		if (carousels[i].el == carouselEl) {
			return i;
		}
	}

	// return 0;
}

function processInput(el) {
	let carouselEl = el.parentElement.parentElement;
	carousel = carousels[getCarouselIndex(carouselEl)];

	let modifier = 0;

	if (el.classList.contains("card")) {
		modifier = carousel.getCardIndex(el) - carousel.activeIndex;
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
		let buttons = carouselEl.querySelectorAll(".nav-buttons button");

		if (buttons.length > 0) {
			buttons[0].classList.add("left");

			for (let button of buttons) {
				button.addEventListener("click", function () {
					processInput(this);
				});
			}
		}

		let cards = carouselEl.querySelectorAll(".container .card");

		for (let card of cards) {
			card.addEventListener("click", function () {
				processInput(this);
			});
		}

		carousels.push(new Carousel(carouselEl));
	}
}

window.onload = onReady;
window.onresize = onResize;
