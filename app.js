const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
const colorSelect = document.getElementById('colorSelect');
const thicknessSelect = document.getElementById('thickness');
const downloadBtn = document.getElementById('downloadBtn');
const eraseBtn = document.getElementById('eraseBtn');

// Set canvas dimensions
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

let isDrawing = false;
let x = 0;
let y = 0;
let color = '#000000';
let thickness = 5; // Default thickness
let drawnLines = []; // Store drawn lines

// Change color on select change
colorSelect.addEventListener('change', (e) => {
    color = e.target.value;
    colorSelect.style.backgroundColor = color;
    updateColorOptions();
    highlightSelectedColor();
    
    
});

function updateColorOptions() {
    const options = colorSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === color) {
            options[i].text = options[i].text.replace('*', '') + '*';
        } else {
            options[i].text = options[i].text.replace('*', '');
        }
    }
}

function highlightSelectedColor() {
    const options = colorSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === color) {
            options[i].style.outline = '2px solid black';
        } else {
            options[i].style.outline = 'none';
        }
    }
}

updateColorOptions();
highlightSelectedColor();

// Change thickness on select change
thicknessSelect.addEventListener('change', (e) => {
    thickness = parseInt(e.target.value, 10);
    redrawCanvas();
});

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

// Draw on canvas
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const newX = e.offsetX;
        const newY = e.offsetY;
        drawLine(ctx, x, y, newX, newY, color, thickness);
        drawnLines.push({ x1: x, y1: y, x2: newX, y2: newY, color, thickness });
        x = newX;
        y = newY;
    }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Stop drawing when mouse leaves canvas
canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

function drawLine(ctx, x1, y1, x2, y2, color, thickness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();
}



// Redraw canvas with updated thickness
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of drawnLines) {
        drawLine(ctx, line.x1, line.y1, line.x2, line.y2, line.color, thickness);
    }
}

// Download signature as PNG
downloadBtn.addEventListener('click', () => {
    downloadPNG();
});

function downloadPNG() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'signature.png';
    link.click();
}


// Erase the canvas
eraseBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawnLines = [];
});
