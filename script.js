function onReady() {
	carousels = document.querySelectorAll(".carousel");
	for (carousel of carousels) {
		for (button of carousel.querySelectorAll(".nav-buttons button")) {
			button.addEventListener("click", function () {
				processInput(this);
			});
		}
	}
	console.log(carousels);
}

window.onload = onReady();

function processInput(button) {}
