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

// ---- Define all objects ----
    //position
    let y_pos = window.innerHeight/2;
    let object_num = 4;
    let x_pos = [];
    for (let i = 1; i < object_num+1; i++) {
        x_pos.push((window.innerWidth*i)/(object_num+1));
    }

    //python object
    let python_radius = 70;
    let python = Bodies.circle(x_pos[0], y_pos, python_radius, {
    restitution: 0.3, // bounce
    render: {
        sprite: {
            texture: './images/python.png', // always starts from index.html
            xScale: (python_radius*2)/165,          // 165 = image width
            yScale: (python_radius*2)/165           // 165 = image height
        }
    }
    });
    //cpp object
    let cpp_radius = 65;
    let cpp = Bodies.polygon(x_pos[1], y_pos, 6, cpp_radius, {
    restitution: 0.3,
    render: {
        sprite: {
            texture: './images/cpp-1to1.png', // always starts from index.html
            xScale: (cpp_radius*2)/500,          // 490 = image width
            yScale: (cpp_radius*2)/500           // 490 = image height
        }
    }
    });
    //unity object
    let unity_size = 150;
    let unity = Bodies.rectangle(x_pos[2], y_pos, unity_size, unity_size, {
    restitution: 0.3,
    render: {
        sprite: {
            texture: './images/unity.png', // always starts from index.html
            xScale: (unity_size)/512,          // 512 = image width
            yScale: (unity_size)/512           // 512 = image height
        }
    }
    });
    //firebase object
    let firebase_size = 100;
    let firebase = Matter.Bodies.fromVertices(x_pos[3], y_pos, [
        { x: 0, y: 0 },
        { x: -50, y: 28 },
        { x: -100, y: 0 },
        { x: -80, y: -120 },
        { x: -20, y: -90 }
    ], {
        restitution: 0.3,
        render: {
            sprite: {
                texture: './images/firebase.svg', // always starts from index.html
                xScale: (unity_size)/850,          // 512 = image width
                yScale: (unity_size)/850           // 512 = image height
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

World.add(world, [python, cpp, unity, firebase, bot_wall, top_wall, left_wall, right_wall]);

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
    Matter.Body.setPosition(bot_wall, { x: window.innerWidth/2, y: window.innerHeight   });
    Matter.Body.setPosition(top_wall, { x: window.innerWidth/2, y: 0                    });
    Matter.Body.setPosition(left_wall, { x: 0,                  y: window.innerHeight/2 });
    Matter.Body.setPosition(right_wall, { x: window.innerWidth, y: window.innerHeight/2 });
});
