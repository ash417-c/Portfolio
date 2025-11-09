// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {

	// Example 1: Animate from invisible to visible
	gsap.from("#quote", {
		opacity: 0,
		filter: "blur(8px)",
		y: 30,
		duration: 1.6,
		ease: "power3.out"
	});

	// Example 2: Animate paragraph after the title
	gsap.from("#author", {
		duration: 1,
		delay: 0.5,
		y: 50,
		opacity: 0,
		ease: "power2.out"
	});

});
