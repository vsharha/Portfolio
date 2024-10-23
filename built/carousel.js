export class Carousel {
    constructor(el) {
        this.el = el;
        this.currentOffset = 0;
        this.startCoord = 0;
        this.container = this.el.querySelector(".container");
        this.cardEls = this.container.querySelectorAll(".card");
        const middle = Math.ceil(this.cardEls.length / 2 - 1);
        if (window.innerWidth > 576) {
            if (this.isVerticalContainer()) {
                this.activeIndex = 0;
            }
            else {
                this.activeIndex = middle;
                if (this.cardEls.length % 2 == 0) {
                    this.offset(-0.5);
                }
            }
            this.threshold = 80;
        }
        else {
            this.activeIndex = 0;
            this.threshold = 30;
        }
        for (let card of this.cardEls) {
            if (card != this.activeCard()) {
                card.classList.add("inactive");
            }
            card.addEventListener("click", (event) => {
                this.processInput(event.currentTarget);
            });
        }
        let buttons = this.el.querySelectorAll(".nav-buttons button");
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
        for (let i = 0; i < this.cardEls.length; i++) {
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
        this.indicatorEls = this.el.querySelectorAll(".indicator");
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
        this.infoEls = document.querySelectorAll("#portfolio .info");
        for (let cardEl of this.cardEls) {
            let infoEl;
            for (let info of this.infoEls) {
                if (info.parentNode == cardEl) {
                    infoEl = info;
                }
            }
            if (infoEl == undefined) {
                infoEl = document.createElement("p");
                infoEl.classList.add("info");
            }
            if (cardEl != this.activeCard()) {
                infoEl.classList.add("inactive");
            }
            this.el.appendChild(infoEl);
        }
        this.infoEls = document.querySelectorAll("#portfolio .info");
    }
    isVertical(el) {
        return window.getComputedStyle(el).flexDirection == "column";
    }
    isVerticalContainer() {
        let container = this.el.querySelector(".container");
        return this.isVertical(container);
    }
    // handle scroll
    handleTouchStart(event) {
        if (this.isVerticalContainer()) {
            this.startCoord = event.touches[0].clientY;
        }
        else {
            this.startCoord = event.touches[0].clientX;
        }
    }
    handleTouchMove(event) {
        event.preventDefault();
    }
    handleTouchEnd(event) {
        let endCoord = 0;
        if (this.isVerticalContainer()) {
            endCoord = event.changedTouches[0].clientY;
        }
        else {
            endCoord = event.changedTouches[0].clientX;
        }
        let delta = this.startCoord - endCoord;
        this.scrollMove(delta);
    }
    handleScroll(event) {
        if ((this.isVerticalContainer() && event.deltaY != 0) ||
            event.deltaX != 0) {
            event.preventDefault();
        }
        if (this.isVerticalContainer()) {
            this.startCoord += event.deltaY;
        }
        else {
            this.startCoord += event.deltaX;
        }
        this.scrollMove(this.startCoord);
    }
    scrollMove(distance) {
        if (Math.abs(distance) >= this.threshold) {
            this.move(distance > 0 ? 1 : -1);
            this.startCoord = 0;
        }
    }
    // carousel functionality
    move(modifier) {
        let newIndex = this.activeIndex + modifier;
        if (!(newIndex < 0 || newIndex > this.cardEls.length - 1)) {
            this.updateIndex(newIndex);
            this.offset(modifier);
        }
    }
    updateIndex(index) {
        this.activeCard().classList.add("inactive");
        this.activeDot().classList.add("inactive");
        this.activeInfo().classList.add("inactive");
        this.activeIndex = index;
        this.activeCard().classList.remove("inactive");
        this.activeDot().classList.remove("inactive");
        this.activeInfo().classList.remove("inactive");
    }
    offset(modifier) {
        this.currentOffset -= modifier;
        this.setPixelOffset(this.currentOffset * this.getOffsetValue());
    }
    getOffsetValue() {
        let totalOffset = 0;
        if (this.isVerticalContainer()) {
            totalOffset = this.container.offsetHeight;
        }
        else {
            totalOffset = this.container.offsetWidth;
        }
        console.log(totalOffset);
        return totalOffset / this.indicatorEls.length;
    }
    setPixelOffset(pixelOffset) {
        let container = this.el.querySelector(".container");
        let dir = this.isVertical(container) ? "Y" : "X";
        container.style.transform = `translate${dir}(${pixelOffset}px)`;
    }
    // get element nodelists
    activeDot() {
        return this.indicatorEls[this.activeIndex].firstChild;
    }
    activeCard() {
        return this.cardEls[this.activeIndex];
    }
    activeInfo() {
        return this.infoEls[this.activeIndex];
    }
    getIndex(element) {
        let elements;
        if (element.classList.contains("card")) {
            elements = this.cardEls;
        }
        else if (element.classList.contains("indicator")) {
            elements = this.indicatorEls;
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
        window.onresize = this.onResize.bind(this);
    }
    onResize() {
        for (let carousel of this.carousels) {
            carousel.onResize();
        }
    }
}
