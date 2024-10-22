import { Carousels } from "./carousel.js";

let carousels: Carousels;

function onReady() {
	carousels = new Carousels();
}

window.onload = onReady;
