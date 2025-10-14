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

//toys position
let y_pos = window.innerHeight/2;
let object_num = 4;
let x_pos = [];
for (let i = 1; i < object_num+1; i++) {
    x_pos.push((window.innerWidth*i)/(object_num+1));
}

//list of toys
let python_radius = 70;
let cpp_radius = 65;
let unity_size = 150;
let toys = [
    Bodies.circle(x_pos[0], y_pos, python_radius, {
        restitution: 0.3, // bounce
        render: {
            sprite: {
                texture: './images/python.png', // always starts from index.html
                xScale: (python_radius*2)/165,          // 165 = image width
                yScale: (python_radius*2)/165           // 165 = image height
            }
        }
    }),
    Bodies.polygon(x_pos[1], y_pos, 6, cpp_radius, {
        restitution: 0.3,
        render: {
            sprite: {
                texture: './images/cpp-1to1.png', // always starts from index.html
                xScale: (cpp_radius*2)/500,          // 490 = image width
                yScale: (cpp_radius*2)/500           // 490 = image height
            }
        }
    }),
    Bodies.rectangle(x_pos[2], y_pos, unity_size, unity_size, {
        restitution: 0.3,
        render: {
            sprite: {
                texture: './images/unity.png', // always starts from index.html
                xScale: (unity_size)/512,          // 512 = image width
                yScale: (unity_size)/512           // 512 = image height
            }
        }
    }),
    Matter.Bodies.fromVertices(x_pos[3], y_pos, [
        { x: 0,     y: 0    },
        { x: -50,   y: 28   },
        { x: -100,  y: 0    },
        { x: -80,   y: -120 },
        { x: -20,   y: -90  }
    ],{
        restitution: 0.3,
        render: {
            sprite: {
                texture: './images/firebase.svg', // always starts from index.html
                xScale: (3)/17,     
                yScale: (3)/17  
            }
        }
    })
];

// create walls
const wall_thickness = 20;
const walls = {
    bot : Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, wall_thickness, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    top : Bodies.rectangle(window.innerWidth/2, 0                 , window.innerWidth, wall_thickness, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    left : Bodies.rectangle(0,               window.innerHeight/2, wall_thickness, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#555' }
        }),
    right : Bodies.rectangle(window.innerWidth, window.innerHeight/2, wall_thickness, window.innerHeight, {
        isStatic: true,
        render: { fillStyle: '#555' }
        })
};

World.add(world, Object.values(walls));
World.add(world, toys);

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

    Matter.Body.setPosition(walls.bot, { x: window.innerWidth/2, y: window.innerHeight   });
    let bot_scale = (window.innerWidth)/(walls.bot.bounds.max.x - walls.bot.bounds.min.x);
    Matter.Body.scale(walls.bot, bot_scale, 1)

    Matter.Body.setPosition(walls.top, { x: window.innerWidth/2, y: 0                    });
    let top_scale = (window.innerWidth)/(walls.top.bounds.max.x - walls.top.bounds.min.x);
    Matter.Body.scale(walls.top, top_scale, 1)

    Matter.Body.setPosition(walls.left, { x: 0,                  y: window.innerHeight/2 });
    let left_scale = (window.innerHeight)/(walls.left.bounds.max.y - walls.left.bounds.min.y);
    Matter.Body.scale(walls.left, 1, left_scale)

    Matter.Body.setPosition(walls.right, { x: window.innerWidth, y: window.innerHeight/2 });
    let right_scale = (window.innerHeight)/(walls.right.bounds.max.y - walls.right.bounds.min.y);
    Matter.Body.scale(walls.right, 1, right_scale)
});
