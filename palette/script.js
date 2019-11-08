window.onload = function () {
    const canvas = document.querySelector('.work-area-canvas-block__canvas'),
          ctx = canvas.getContext('2d'),
          canvasFrameSize = 512,
          columns = [],
          rows = [];
    let pixelSize = 4,
        colorToFillTemplate = '#41f795';

    for (let i = 0; i < canvasFrameSize / pixelSize; i++) {
        columns.push(i);
        rows.push(i);
    }

    columns.forEach((columnValue, i) => {
        rows.forEach((rowValue, j) => {
            ctx.fillStyle = colorToFillTemplate;
            ctx.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
        });
    })
};
