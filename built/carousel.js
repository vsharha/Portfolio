export class Carousel {
    constructor(el) {
        this.el = el;
        this.currentOffset = 0;
        this.startX = 0;
        const middle = Math.ceil(this.getCards().length / 2 - 1);
        if (window.innerWidth > 576) {
            this.activeIndex = middle;
            if (this.getCards().length % 2 == 0) {
                this.offset(-0.5);
            }
            this.threshold = 80;
        }
        else {
            this.activeIndex = 0;
            this.threshold = 30;
        }
        for (let card of this.getCards()) {
            if (card != this.activeCard()) {
                card.classList.add("inactive");
            }
            card.addEventListener("click", (event) => {
                this.processInput(event.currentTarget);
            });
        }
        const buttons = this.el.querySelectorAll(".nav-buttons button");
        if (buttons.length > 0) {
            buttons[0].classList.add("left");
            for (let button of buttons) {
                button.addEventListener("click", (event) => {
                    this.processInput(event.currentTarget);
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
            indicator.addEventListener("click", (event) => {
                this.processInput(event.currentTarget);
            });
            indicatorBar.appendChild(indicator);
        }
        this.el.appendChild(indicatorBar);
        let container = this.el.querySelector(".container");
        container.addEventListener("wheel", (event) => {
            this.handleScroll(event);
        });
        container.addEventListener("touchstart", (event) => {
            this.handleTouchStart(event);
        });
        container.addEventListener("touchmove", (event) => {
            this.handleTouchMove(event);
        });
        container.addEventListener("touchend", (event) => {
            this.handleTouchEnd(event);
        });
    }
    // handle scroll
    handleTouchStart(event) {
        this.startX = event.touches[0].clientX;
    }
    handleTouchMove(event) {
        event.preventDefault();
    }
    handleTouchEnd(event) {
        const endX = event.changedTouches[0].clientX;
        const delta = this.startX - endX;
        this.scrollMove(delta);
    }
    handleScroll(event) {
        if (event.deltaX != 0) {
            event.preventDefault();
        }
        this.startX += event.deltaX;
        this.scrollMove(this.startX);
    }
    scrollMove(distance) {
        if (Math.abs(distance) >= this.threshold) {
            this.move(distance > 0 ? 1 : -1);
            this.startX = 0;
        }
    }
    // carousel functionality
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
        this.setPixelOffset(this.currentOffset * this.getOffsetValue());
    }
    getOffsetValue() {
        return (this.el.querySelector(".container").offsetWidth /
            this.getCards().length);
    }
    setPixelOffset(pixelOffset) {
        this.el.querySelector(".container").style.transform = `translateX(${pixelOffset}px)`;
    }
    // get element nodelists
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
        let elements;
        if (element.classList.contains("card")) {
            elements = this.getCards();
        }
        else if (element.classList.contains("indicator")) {
            elements = this.getIndicators();
        }
        for (let i = 0; i < elements.length; i++) {
            if (elements[i] == element) {
                return i;
            }
        }
    }
    // general functionality
    onResize() {
        let offset = this.currentOffset;
        this.offset(-offset);
        this.setPixelOffset(0);
        this.offset(offset);
    }
    processInput(el) {
        let modifier = 0;
        console.log(el);
        if (el.classList.contains("card") ||
            el.classList.contains("indicator")) {
            modifier = this.getIndex(el) - this.activeIndex;
        }
        else {
            modifier = el.classList.contains("left") ? 1 : -1;
        }
        this.move(modifier);
    }
}
export class Carousels {
    constructor() {
        this.carousels = [];
        for (let carouselEl of document.querySelectorAll(".carousel")) {
            this.carousels.push(new Carousel(carouselEl));
        }
        window.onresize = this.onResize;
    }
    onResize() {
        for (let carousel of this.carousels) {
            carousel.onResize();
        }
    }
    getFromHTML(carouselEl) {
        for (let carousel of this.carousels) {
            if (carousel.el == carouselEl) {
                return carousel;
            }
        }
    }
    moveFromHTML(carouselEl, modifier) {
        this.getFromHTML(carouselEl).move(modifier);
    }
}
