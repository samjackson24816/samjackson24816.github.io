const SEPARATION = 5; // Separation strength 
const ALIGNMENT = 0.05; // Alignment strength 

const COHESION = 5000; // Cohesion strength 
const COHESION_REACH = 100; // Cohesion reach distance

const SPEED = 2; // Speed of boids
const MOUSE_REPULSION = 1000; // Mouse repulsion distance
const BOID_NUMBER = 400; // Number of boids


export function initializeBoidsAnimation(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const boids = createBoids(BOID_NUMBER, canvas.width / dpr, canvas.height / dpr);

    let mouseX = 0;
    let mouseY = 0;

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        updateBoids(boids, canvas.width / dpr, canvas.height / dpr, mouseX, mouseY);
        drawBoids(ctx, canvas, boids, mouseX, mouseY);

        requestAnimationFrame(animate);
    }

    function updateMousePosition(event: MouseEvent | Event): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            if (event instanceof MouseEvent) mouseX = event.clientX - rect.left; // X-coordinate relative to the canvas
            if (event instanceof MouseEvent) mouseY = event.clientY - rect.top;  // Y-coordinate relative to the canvas
            console.log(`Mouse Position relative to canvas: X=${mouseX}, Y=${mouseY}`);
        }
    }
    
    window.addEventListener('mousemove', updateMousePosition);


    animate();
}

function createBoids(count: number, width: number, height: number) {

    return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
    }));
}

function updateBoids(boids: any[], width: number, height: number, mouseX: number, mouseY: number) {

    
    boids.forEach((boid) => {
        boid.x += boid.vx;
        boid.y += boid.vy;


        // Mouse repulsion with scroll compensation
        let dx = mouseX - boid.x;
        if (Math.abs(dx) > width / 2) {
            dx = dx > 0 ? dx - width : dx + width;
        }
        let dy = (mouseY) - boid.y;
        if (Math.abs(dy) > height / 2) {
            dy = dy > 0 ? dy - height : dy + height;
        }

        const distance = Math.sqrt(dx * dx + dy * dy);
        let repulsionForce = MOUSE_REPULSION / (distance * distance);

        boid.vx -= (dx / distance) * repulsionForce;
        boid.vy -= (dy / distance) * repulsionForce;

        // Alignment and Cohesion
        let alignmentX = 0;
        let alignmentY = 0;

        let cohesionX = 0;
        let cohesionY = 0;

        let count = 0;

        boids.forEach((otherBoid) => {
            // Alignment
            alignmentX += otherBoid.vx / boids.length
            alignmentY += otherBoid.vy / boids.length;

            if (otherBoid === boid) return;

            let dx = otherBoid.x - boid.x;

            if (Math.abs(dx) > width / 2) {
                if (dx > 0) {
                    dx = dx - width;
                } else {
                    dx = dx + width;
                }

            }

            let dy = otherBoid.y - boid.y;

            if (Math.abs(dy) > height / 2) {
                
                if (dy > 0) {
                    dy = dy - height;
                } else {
                    dy = dy + height;
                }
            }

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < COHESION_REACH) {
                count++;
                cohesionX += otherBoid.x;
                cohesionY += otherBoid.y;
            }


            // Separation
            let separationForce = SEPARATION / (distance * distance);
            let separationX = (dx / distance) * separationForce;
            let separationY = (dy / distance) * separationForce;


            // apply it away from the other boid
            boid.vx -= separationX;
            boid.vy -= separationY;
        });

        // Apply alignment
        boid.vx += alignmentX * ALIGNMENT;
        boid.vy += alignmentY * ALIGNMENT;

        if (count <= 0) count = 1;

        cohesionX /= count;
        cohesionY /= count;

        // Apply cohesion
        let cohesionDx = cohesionX - boid.x;
        if (Math.abs(cohesionDx) > width / 2) {
            if (cohesionDx > 0) {
                cohesionDx = cohesionDx - width;
            } else {
                cohesionDx = cohesionDx + width;
            }
        }
        let cohesionDy = cohesionY - boid.y;
        if (Math.abs(cohesionDy) > height / 2) {
            if (cohesionDy > 0) {
                cohesionDy = cohesionDy - height;
            } else {
                cohesionDy = cohesionDy + height;
            }
        }


        cohesionX = cohesionDx / COHESION;
        cohesionY = cohesionDy / COHESION;
        boid.vx += cohesionX;
        boid.vy += cohesionY;



        // Limit speed
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        if (speed > SPEED) {
            boid.vx = (boid.vx / speed) * SPEED;
            boid.vy = (boid.vy / speed) * SPEED;
        }


        // Wrap
        if (boid.x < 0) {boid.x += width; console.log('wrap x');}
        if (boid.x > width) boid.x -= width;
        if (boid.y < 0) boid.y += height;
        if (boid.y > height) boid.y -= height;

    });
}

function drawBoids(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, boids: any[], mouseX: number, mouseY: number) {
    ctx.beginPath();
    // Draw a circle at the mouse position

    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.closePath();



    boids.forEach((boid) => {
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);

        // Draw arrow shape with crisp rendering
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 5);
        ctx.lineTo(15, -5);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.closePath();

        ctx.restore();
    });
}