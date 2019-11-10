window.onload = function () {
    // canvas section
    const canvas = document.querySelector('.work-area-canvas-block__canvas'),
          ctx = canvas.getContext('2d'),
          canvasFrameSize = 512,
          defaultColor = 'rgb(196, 196, 196)',
          pixelSize = 4,
          columnsCount = canvasFrameSize / pixelSize,
          rowsCount = canvasFrameSize / pixelSize;
    let colorToFillTemplate = defaultColor;

    // set canvas grid
    let columns = [];
    for (let i = 0; i < columnsCount; i++) {
        let row = [];
        for (let j = 0; j < rowsCount; j++) {
            row.push('transparent');
        }
        columns.push(row);
    }

    // check if canvas already exists
    if (localStorage.getItem('canvasImage')) {
        columns = JSON.parse(localStorage.getItem('canvasImage'));
        columns.forEach((row, i) => {
            row.forEach((pixelColor, j) => {
                ctx.fillStyle = pixelColor;
                ctx.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
            })
        })
    }

    // color state section
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
        });
    });

    // canvas filling according to chosen tools
    let mouseCoords = { x:0, y:0 },
        draw = false;

    const drawPixel = (e) => {
        mouseCoords.x = e.offsetX === undefined ? Math.round(e.layerX / pixelSize) : Math.round(e.offsetX / pixelSize);
        mouseCoords.y = e.offsetY === undefined ? Math.round(e.layerY / pixelSize) : Math.round(e.offsetY / pixelSize);

        ctx.fillStyle = colorToFillTemplate;
        ctx.fillRect(mouseCoords.x * pixelSize, mouseCoords.y * pixelSize, pixelSize, pixelSize);

        columns[+mouseCoords.x][+mouseCoords.y] = colorToFillTemplate;
        let storageData = JSON.stringify(columns);
        localStorage.setItem('canvasImage', storageData);
    };

    canvas.addEventListener('click', (e) => {
        if (tool === 'bucket') {
            columns.forEach((row, i) => {
                row.forEach((pixelColor, j) => {
                    ctx.fillStyle = colorToFillTemplate;
                    ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);

                    columns[i][j] = colorToFillTemplate;
                });
            });

            let storageData = JSON.stringify(columns);
            localStorage.setItem('canvasImage', storageData);
        }

        if (tool === 'picker') {
            mouseCoords.x = e.offsetX === undefined ? e.layerX : e.offsetX;
            mouseCoords.y = e.offsetY === undefined ? e.layerY : e.offsetY;

            let p = ctx.getImageData(mouseCoords.x, mouseCoords.y, 1, 1).data;
            let pixelColor;

            if (p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0) {
                pixelColor = defaultColor;
            } else {
                pixelColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`
            }

            colorSet.prev = colorSet.current;
            colorSet.current = pixelColor;
            document.querySelector('.js-current').style.setProperty('background-color', colorSet.current);
            document.querySelector('.js-prev').style.setProperty('background-color', colorSet.prev);
            colorToFillTemplate = pixelColor;
        }

        if (tool === 'pencil') {
            drawPixel(e);
        }
    });

    canvas.addEventListener('mousedown', () => {
        if (tool === 'pencil') {
            draw = true;
        }
    });

    canvas.addEventListener("mousemove", function(e){
        if (tool === 'pencil' && draw === true) {
            drawPixel(e);
        }
    });

    canvas.addEventListener("mouseup", function(){
        if (tool === 'pencil') {
            draw = false;
        }
    });

    // change cursor in canvas
    canvas.addEventListener('mouseenter', () => {
        if (tool === 'bucket') {
            document.querySelector('.wrapper').style.cursor = `url(./palette/images/tools_${tool}.png), default`;
        } else {
            document.querySelector('.wrapper').style.cursor = 'crosshair';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        document.querySelector('.wrapper').style.cursor = 'default';
    });

    // keyboard section
    const changeActiveTabToNecessaryOnKeyPressed = (tabName) => {
        document.querySelectorAll('.work-area-left-panel-block-tools__item').forEach((value) => {
            value.classList.remove('active');

            if (value.getAttribute('data-tool') === tabName) {
                value.classList.add('active');
                tool = tabName;
            }
        });
    };

    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyB') {
            changeActiveTabToNecessaryOnKeyPressed('bucket');
            document.querySelector('.wrapper').style.cursor = `url(./palette/images/tools_${tool}.png), default`;
        }
        if (e.code === 'KeyP') {
            changeActiveTabToNecessaryOnKeyPressed('pencil');
            document.querySelector('.wrapper').style.cursor = 'crosshair';
        }
        if (e.code === 'KeyC') {
            changeActiveTabToNecessaryOnKeyPressed('picker');
            document.querySelector('.wrapper').style.cursor = 'crosshair';
        }
    })
};
