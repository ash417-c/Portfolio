
const cards = document.querySelectorAll(".project-card");

let lastX = 0;
let lastY = 0;
let vx = 0;
let vy = 0;

// Settings
const radius = 250;         // Effect radius
const sensitivity = 2;    // Force multiplier
const speedThreshold = 25;   // Minimum flick speed
const maxDistance = 100;     // Max offset distance

// Track mouse velocity
window.addEventListener("mousemove", (e) => {
	vx = e.clientX - lastX;
	vy = e.clientY - lastY;
	lastX = e.clientX;
	lastY = e.clientY;

	const speed = Math.sqrt(vx * vx + vy * vy);
	if (speed < speedThreshold) return; // ignore slow movement

	cards.forEach((card) => {
		const rect = card.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const dist = Math.sqrt((dx * dx) + (dy * dy));

		if (dist < radius) {
			const proximity = 1 - (dist / radius);
			const force = proximity * sensitivity;

			// Calculate impulse offset
			const offsetX = gsap.utils.clamp(-maxDistance, maxDistance, vx * force);
			const offsetY = gsap.utils.clamp(-maxDistance, maxDistance, vy * force);

			// Cancel any ongoing tweens before applying new ones
			gsap.killTweensOf(card);

			// Quick push
			gsap.to(card, {
				x: offsetX,
				y: offsetY,
				rotation: offsetX * 0.1,
				duration: 0.2,
				ease: "power2.out",
				onComplete: () => {
					// Snap back smoothly with a spring
					gsap.to(card, {
					x: 0,
					y: 0,
					rotation: 0,
					duration: 1,
					ease: "elastic.out(1, 0.4)"
					});
				}
			});
		}
	});
});
