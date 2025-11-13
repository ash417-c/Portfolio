const cards = document.querySelectorAll(".project-card");
let lastX = 0, lastY = 0, vx = 0, vy = 0;
let ticking = false;

window.addEventListener("mousemove", (e) => {
	if (!ticking) {
		requestAnimationFrame(() => {
			updateMomentum(e);
			ticking = false;
		});
		ticking = true;
	}
});

function updateMomentum(e) {
	vx = e.clientX - lastX;
	vy = e.clientY - lastY;
	lastX = e.clientX;
	lastY = e.clientY;

	const speed = Math.hypot(vx, vy);
	if (speed < 25) return;

	cards.forEach((card) => {
		const rect = card.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = e.clientX - cx;
		const dy = e.clientY - cy;
		const dist = Math.hypot(dx, dy);
		if (dist > 250) return;

		const proximity = 1 - dist / 250;
		const force = proximity * 2;
		const offsetX = gsap.utils.clamp(-100, 100, vx * force);
		const offsetY = gsap.utils.clamp(-100, 100, vy * force);
		const jitter = (Math.random() - 0.5) * 3;

		gsap.killTweensOf(card);
		gsap.to(card, {
			x: offsetX,
			y: offsetY,
			rotation: offsetX * 0.1 + jitter,
			duration: 0.25,
			ease: "power2.out",
			onComplete: () => {
				gsap.to(card, {
					x: 0, y: 0, rotation: 0,
					duration: 0.9,
					ease: "elastic.out(1, 0.4)"
				});
			}
		});
	});
}
