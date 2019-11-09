window.onload = function () {
    // canvas section
    const canvas = document.querySelector('.work-area-canvas-block__canvas'),
          ctx = canvas.getContext('2d'),
          canvasFrameSize = 512,
          columns = [],
          rows = [];
    let pixelSize = 4,
        colorToFillTemplate = 'rgb(196, 196, 196)';

    for (let i = 0; i < canvasFrameSize / pixelSize; i++) {
        columns.push(i);
        rows.push(i);
    }

    // get color section
    const colorSet = {
        current: window.getComputedStyle(document.querySelector('.js-current')).getPropertyValue('background-color'),
        prev: window.getComputedStyle(document.querySelector('.js-prev')).getPropertyValue('background-color')
    };

    document.querySelectorAll('.work-area-left-panel-block-colors__item').forEach((value) => {
        value.addEventListener('click', function () {
            let color = this.querySelector('.work-area-left-panel-block-colors__color'),
                style = window.getComputedStyle(color);
            colorToFillTemplate = style.getPropertyValue('background-color');

            colorSet.prev = colorSet.current;
            colorSet.current = colorToFillTemplate;
            document.querySelector('.js-current').style.setProperty('background-color', colorSet.current);
            document.querySelector('.js-prev').style.setProperty('background-color', colorSet.prev);
        });
    });

    // tools section
    let tool = 'pencil';
    document.querySelectorAll('.work-area-left-panel-block-tools__item').forEach((value) => {
        value.addEventListener('click', function () {
            // set active
            document.querySelectorAll('.work-area-left-panel-block-tools__item').forEach((value) => {
                value.classList.remove('active');
            });
            this.classList.add('active');
            tool = this.getAttribute('data-tool');

            if (tool === 'picker') {
                document.querySelector('.wrapper').style.cursor = 'crosshair';
            } else {
                document.querySelector('.wrapper').style.cursor = 'default';
            }
        });
    });

    // canvas filling
    let mouseCoords = { x:0, y:0},
        draw = false;

    canvas.addEventListener('click', () => {
        if (tool === 'bucket') {
            columns.forEach((columnValue, i) => {
                rows.forEach((rowValue, j) => {
                    ctx.fillStyle = colorToFillTemplate;
                    ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
                });
            });
        }
    });

    canvas.addEventListener('mousedown', (e) => {
        if (tool === 'pencil') {
            ctx.beginPath();
            draw = true;
        }
    });

    canvas.addEventListener("mousemove", function(e){
        if (tool === 'pencil' && draw === true) {
            mouseCoords.x = e.offsetX === undefined ? e.layerX : e.offsetX;
            mouseCoords.y = e.offsetY === undefined ? e.layerY : e.offsetY;
            ctx.lineTo(mouseCoords.x, mouseCoords.y);
            ctx.strokeStyle = colorToFillTemplate;
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", function(e){
        if (tool === 'pencil') {
            ctx.closePath();
            draw = false;
        }
    });

    // change cursor in canvas
    canvas.addEventListener('mouseenter', () => {
        if (tool === 'bucket') {
            document.querySelector('.wrapper').style.cursor = `url(./palette/images/tools_${tool}.png), default`;
        } else if (tool === 'pencil') {
            document.querySelector('.wrapper').style.cursor = 'crosshair';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        if (tool !== 'picker') {
            document.querySelector('.wrapper').style.cursor = 'default';
        }
    });

    localStorage.setItem('myCat', 'Tom');
};
