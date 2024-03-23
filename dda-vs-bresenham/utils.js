const convertCoords = (x, y) => {
    let gpuCoords = {
        min: {
            x: -1,
            y: -1,
        },
        max: {
            x: 1,
            y: 1,
        },
    };

    var convertedX =
        ((x / maxX) * (gpuCoords.max.x - gpuCoords.min.x) + gpuCoords.min.x);
    var convertedY =
        ((y / maxY) * (gpuCoords.max.y - gpuCoords.min.y) + gpuCoords.min.y);

    return { convertedX, convertedY };
};