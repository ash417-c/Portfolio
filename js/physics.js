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

// --- Load toys ---
let y_pos = window.innerHeight*(0.9);
let object_num = 4;
let x_pos = [];
for (let i = 1; i < object_num+1; i++) {
    x_pos.push((window.innerWidth*i)/(object_num+1));
}

const MAX_TOYS = 20;    // limit how many toys can exist at once
const spawnedToys = [];
let allToys = [];       // holds toy definitions from JSON
let spawnIndex = 0;     // keeps track of which toy to spawn next
let spawnInterval;      // handle for the interval timer

// --- Spawn functions ----
function startSpawning() {
    if (!spawnInterval) { // only start if not already running
        spawnInterval = setInterval(() => {
            const randX = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
            const spawnY = window.innerHeight / 9;
            spawnNextToy(randX, spawnY);
        }, 3000); // every 3 seconds
    }
}

function stopSpawning() {
    clearInterval(spawnInterval);
    spawnInterval = null;
}

// --- Load toys from json
fetch('./data/toys.json')
    .then(res => res.json())
    .then(data => {
        // Store toy data in a global list for later spawning
        allToys = data.toys;

        // Spawn the first four immediately
        for (let i = 0; i < object_num; i++) {
            spawnNextToy(x_pos[i], y_pos);
        }

        // Keep spawning new toys if tab in focus
        startSpawning();
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopSpawning();
            } else {
                startSpawning();
            }
        });
    })
    .catch(err => console.error('Error loading toys.json:', err));


// --- Spawning Logic ---
function spawnNextToy(x, y) {
    if (allToys.length === 0) return; // safety check

    // Loop back to start if we reach the end (or remove if you want finite)
    const toyData = allToys[spawnIndex % allToys.length];
    spawnIndex++;

    // Create Matter.js body from toy data
    let body;
    switch (toyData.type) {
    case 'circle':
        body = Bodies.circle(x, y, toyData.radius, toyData.options);
        break;
    case 'polygon':
        body = Bodies.polygon(x, y, toyData.sides, toyData.radius, toyData.options);
        break;
    case 'rectangle':
        body = Bodies.rectangle(x, y, toyData.width, toyData.height, toyData.options);
        break;
    case 'fromVertices':
        body = Matter.Bodies.fromVertices(x, y, toyData.vertices, toyData.options);
        break;
    }

    // Add to the world
    World.add(engine.world, body);
    spawnedToys.push(body);

    // Remove oldest if limit exceeded
    if (spawnedToys.length > MAX_TOYS) {
        const oldest = spawnedToys.shift();
        World.remove(engine.world, oldest);
    }
}

// // Off screen toy cleanup -- REMOVES WALLS DONT KNOW WHY
// Events.on(engine, 'afterUpdate', () => {
//   engine.world.bodies.forEach(body => {
//     if (body.position.y > window.innerHeight + 1000) {
//       World.remove(engine.world, body);
//     }
//   });
// });

// create walls
const wall_thickness = 100;
const wall_offset = wall_thickness/2;
const walls = {
    bot : Bodies.rectangle(window.innerWidth/2, window.innerHeight + wall_offset, window.innerWidth, wall_thickness, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    top : Bodies.rectangle(window.innerWidth/2, -wall_offset, window.innerWidth, wall_thickness, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    left : Bodies.rectangle(-wall_offset, window.innerHeight/2, wall_thickness, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    right : Bodies.rectangle(window.innerWidth+wall_offset, window.innerHeight/2, wall_thickness, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#555' }
        })
};

World.add(world, Object.values(walls));

// Keep canvas fullscreen on resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    Matter.Body.setPosition(walls.bot, { x: window.innerWidth/2, y: window.innerHeight + wall_offset });
    let bot_scale = (window.innerWidth)/(walls.bot.bounds.max.x - walls.bot.bounds.min.x);
    Matter.Body.scale(walls.bot, bot_scale, 1)

    Matter.Body.setPosition(walls.top, { x: window.innerWidth/2, y: -wall_offset });
    let top_scale = (window.innerWidth)/(walls.top.bounds.max.x - walls.top.bounds.min.x);
    Matter.Body.scale(walls.top, top_scale, 1)

    Matter.Body.setPosition(walls.left, { x: -wall_offset, y: window.innerHeight/2 });
    let left_scale = (window.innerHeight)/(walls.left.bounds.max.y - walls.left.bounds.min.y);
    Matter.Body.scale(walls.left, 1, left_scale)

    Matter.Body.setPosition(walls.right, { x: window.innerWidth + wall_offset, y: window.innerHeight/2 });
    let right_scale = (window.innerHeight)/(walls.right.bounds.max.y - walls.right.bounds.min.y);
    Matter.Body.scale(walls.right, 1, right_scale)
});

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2 }
});
World.add(world, mouseConstraint);