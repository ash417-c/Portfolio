const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Fullscreen renderer
const render = Render.create({
element: document.body,
engine: engine,
options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false, // show colors instead of wireframes
    background: '#222'
}
});
Render.run(render);

// Runner
const runner = Runner.create();
Runner.run(runner, engine); 

// Create objects
const radius = 75;
const python = Bodies.circle(300, 100, radius, {
restitution: 0.5, // medium bounce
render: {
    sprite: {
        texture: './images/python.png', // always starts from index.html
        xScale: (radius*2)/165,          // 165 = image width
        yScale: (radius*2)/165           // 165 = image height
    }
}
});
const cpp = Bodies.polygon(700, 200, 6, 65, {
restitution: 0.3,
render: {
    sprite: {
        texture: './images/cpp-1to1.png', // always starts from index.html
        xScale: (radius*2)/570,          // 490 = image width
        yScale: (radius*2)/570           // 490 = image height
    }
}
});

// create walls
const wall_thickness = 20;
const bot_wall = Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, wall_thickness, {
isStatic: true,
render: { fillStyle: '#555' }
});
const top_wall = Bodies.rectangle(window.innerWidth/2, 0, window.innerWidth, wall_thickness, {
isStatic: true,
render: { fillStyle: '#555' }
});
const left_wall = Bodies.rectangle(0, window.innerHeight/2, wall_thickness, window.innerHeight, {
isStatic: true,
render: { fillStyle: '#555' }
});
const right_wall = Bodies.rectangle(window.innerWidth, window.innerHeight/2, wall_thickness, window.innerHeight, {
isStatic: true,
render: { fillStyle: '#555' }
});

World.add(world, [python, cpp, bot_wall, top_wall, left_wall, right_wall]);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
mouse: mouse,
constraint: { stiffness: 0.2 }
});
World.add(world, mouseConstraint);

// Keep canvas fullscreen on resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth/2, y: window.innerHeight-50 });
});