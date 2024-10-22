export class Carousel {
	el: HTMLElement;
	currentOffset: number;
	startX: number;
	threshold: number;
	activeIndex: number;

	constructor(el: HTMLElement) {
		this.el = el;
		this.currentOffset = 0;
		this.startX = 0;

		const middle: number = Math.ceil(this.getCards().length / 2 - 1);
		if (window.innerWidth > 576) {
			this.activeIndex = middle;
			if (this.getCards().length % 2 == 0) {
				this.offset(-0.5);
			}
			this.threshold = 80;
		} else {
			this.activeIndex = 0;
			this.threshold = 30;
		}

		for (let card of this.getCards()) {
			if (card != this.activeCard()) {
				card.classList.add("inactive");
			}
			card.addEventListener("click", this.processInput.bind(this));
		}

		const buttons = this.el.querySelectorAll(".nav-buttons button");

		if (buttons.length > 0) {
			buttons[0].classList.add("left");

			for (let button of buttons) {
				button.addEventListener("click", this.processInput.bind(this));
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
			indicator.addEventListener("click", this.processInput.bind(this));

			indicatorBar.appendChild(indicator);
		}

		this.el.appendChild(indicatorBar);

		let container = this.el.querySelector(".container");
		container.addEventListener("wheel", (event: WheelEvent) => {
			this.handleScroll(event);
		});
		container.addEventListener("touchstart", (event: TouchEvent) => {
			this.handleTouchStart(event);
		});
		container.addEventListener("touchmove", (event: TouchEvent) => {
			this.handleTouchMove(event);
		});
		container.addEventListener("touchend", (event: TouchEvent) => {
			this.handleTouchEnd(event);
		});
	}
	handleTouchStart(event: TouchEvent) {
		this.startX = event.touches[0].clientX;
	}
	handleTouchMove(event: TouchEvent) {
		event.preventDefault();
	}
	handleTouchEnd(event: TouchEvent) {
		const endX = event.changedTouches[0].clientX;
		const delta = this.startX - endX;
		this.scrollMove(delta);
	}
	handleScroll(event: WheelEvent) {
		if (event.deltaX != 0) {
			event.preventDefault();
		}
		this.startX += event.deltaX;
		this.scrollMove(this.startX);
	}
	scrollMove(distance: number) {
		if (Math.abs(distance) >= this.threshold) {
			this.move(distance > 0 ? 1 : -1);
			this.startX = 0;
		}
	}
	move(modifier: number) {
		let newIndex = this.activeIndex + modifier;

		if (!(newIndex < 0 || newIndex > this.getCards().length - 1)) {
			this.updateIndex(newIndex);
			this.offset(modifier);
		}
	}
	updateIndex(index: number) {
		this.activeCard().classList.add("inactive");
		this.activeDot().classList.add("inactive");
		this.activeIndex = index;
		this.activeCard().classList.remove("inactive");
		this.activeDot().classList.remove("inactive");
	}
	offset(modifier: number) {
		this.currentOffset -= modifier;
		this.setPixelOffset(this.currentOffset * this.getOffsetValue());
	}
	getOffsetValue() {
		return (
			(this.el.querySelector(".container") as HTMLElement).offsetWidth /
			this.getCards().length
		);
	}
	setPixelOffset(pixelOffset: number) {
		(
			this.el.querySelector(".container") as HTMLElement
		).style.transform = `translateX(${pixelOffset}px)`;
	}
	getCards() {
		return this.el.querySelectorAll(".container .card");
	}
	getIndicators() {
		return this.el.querySelectorAll(".indicator");
	}
	activeDot() {
		return this.getIndicators()[this.activeIndex].firstChild as HTMLElement;
	}
	activeCard() {
		return this.getCards()[this.activeIndex];
	}

	getIndex(element: HTMLElement) {
		let elements: NodeListOf<HTMLElement>;
		if (element.classList.contains("card")) {
			elements = this.getCards() as NodeListOf<HTMLElement>;
		} else if (element.classList.contains("indicator")) {
			elements = this.getIndicators() as NodeListOf<HTMLElement>;
		}

		for (let i = 0; i < elements.length; i++) {
			if (elements[i] == element) {
				return i;
			}
		}
	}

	onResize() {
		let offset = this.currentOffset;
		this.offset(-offset);
		this.setPixelOffset(0);
		this.offset(offset);
	}

	processInput(el: HTMLElement) {
		let modifier = 0;

		if (
			el.classList.contains("card") ||
			el.classList.contains("indicator")
		) {
			modifier = this.getIndex(el) - this.activeIndex;
		} else {
			modifier = el.classList.contains("left") ? 1 : -1;
		}

		this.move(modifier);
	}
}

export class Carousels {
	carousels: Array<Carousel>;

	constructor() {
		this.carousels = [];

		for (let carouselEl of document.querySelectorAll(
			".carousel"
		) as NodeListOf<HTMLElement>) {
			this.carousels.push(new Carousel(carouselEl));
		}

		window.onresize = this.onResize;
	}

	onResize() {
		for (let carousel of this.carousels) {
			carousel.onResize();
		}
	}
	getFromHTML(carouselEl: HTMLElement) {
		for (let carousel of this.carousels) {
			if (carousel.el == carouselEl) {
				return carousel;
			}
		}
	}
	moveFromHTML(carouselEl: HTMLElement, modifier: number) {
		this.getFromHTML(carouselEl).move(modifier);
	}
}
