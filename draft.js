// Air canvas
const airCanvas = document.getElementById("air-canvas");
const airCtx = airCanvas.getContext("2d");

// Water canvas
const waterCanvas = document.getElementById("water-canvas");
const waterCtx = waterCanvas.getContext("2d");

// Steel canvas
const steelCanvas = document.getElementById("steel-canvas");
const steelCtx = steelCanvas.getContext("2d");

// Common parameters
const xwidth = airCanvas.width;
const xheight = airCanvas.height;
const xfrequency = 440;
const xamplitude = 50;
const xspeed = 0.05;

// Air simulation
function simulateAir() {
    airCtx.clearRect(0, 0, xwidth, xheight);
    for (let x = 0; x < xwidth; x++) {
        const y =
            xheight / 2 +
            xamplitude *
            Math.sin(
                (2 * Math.PI * xfrequency * x) / xwidth -
                xspeed * Date.now()
            );
        airCtx.fillRect(x, y, 1, 1);
    }
    requestAnimationFrame(simulateAir);
}
simulateAir();

// Water simulation
function simulateWater() {
    waterCtx.clearRect(0, 0, xwidth, xheight);
    for (let x = 0; x < xwidth; x++) {
        const y =
            xheight / 2 +
            xamplitude *
            Math.sin(
                (2.5 * Math.PI * xfrequency * x) / xwidth -
                xspeed * Date.now()
            );
        waterCtx.beginPath();
        waterCtx.moveTo(x, xheight / 2);
        waterCtx.lineTo(x, y);
        waterCtx.stroke();
    }
    requestAnimationFrame(simulateWater);
}
simulateWater();

// Steel simulation
function simulateSteel() {
    steelCtx.clearRect(0, 0, xwidth, xheight);
    for (let x = 0; x < xwidth; x++) {
        const y =
            xheight / 2 +
            xamplitude *
            Math.sin(
                (2 * Math.PI * xfrequency * x) / xwidth -
                xspeed * Date.now()
            );
        steelCtx.beginPath();
        steelCtx.moveTo(x, xheight / 2);
        steelCtx.lineTo(x, y);
        steelCtx.stroke();
    }
    requestAnimationFrame(simulateSteel);
}
simulateSteel();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const amplitude = document.getElementById("amplitude");
const frequency = document.getElementById("frequency");
const speed = document.getElementById("speed");
const densityEl = document.getElementById("density");
const distanceEl = document.getElementById("distance");


let time = 0;
const densityData = [];
const distanceData = [];

// Get chart canvas
const chartCanvas = document.getElementById('chart-canvas');
const cctx = chartCanvas.getContext('2d');

// Create chart
const chart = new Chart(cctx, {
    type: 'line',
    data: {
        labels: distanceData,
        datasets: [{
            label: 'Density vs Distance',
            data: densityData,
            borderColor: 'black',
            fill: false
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Distance (m)'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Density (kg/m^3)'
                }
            }]
        }
    }
});

function calculateValues() {
    const wavelength = (2 * Math.PI) / frequency.value;
    const velocity = wavelength * speed.value;
    const density = (amplitude.value * frequency.value) / speed.value;
    const distance = velocity * time;

    densityEl.innerText = density;
    distanceEl.innerText = distance.toFixed(2);


    densityData.push(density);
    distanceData.push(distance.toFixed(2));

    // Only show the last 50 data points on the chart
    if (densityData.length > 50) {
        densityData.shift();
        distanceData.shift();
    }

    // Update chart with new data
    chart.data.labels = distanceData;
    chart.data.datasets[0].data = densityData;
    chart.update();
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw axis on the main canvas
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x < canvas.width; x += 10) {
        const y = canvas.height / 2 + amplitude.value * Math.sin((frequency.value * time + x / canvas.width * 2 * Math.PI) * speed.value);
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'black';
    ctx.stroke();
    time += 0.01;

    // Label the waveform graph
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Amplitude: ${amplitude.value}`, 30, 30);
    ctx.fillText(`Frequency: ${frequency.value}`, 30, 50);
    ctx.fillText(`Speed: ${speed.value}`, 30, 70);


}
animate();
function graphanimate(){

    calculateValues();
    if (distanceData.length >= canvas.width / 10) {
        // Remove first elements of data arrays, so they don't grow too large
        densityData.splice(0, 1);
        distanceData.splice(0, 1);
    }

    // Update chart with new data
    chart.update();

    // Stop animation if wave has reached the end of the canvas
    const wavelength = (2 * Math.PI) / frequency.value;
    const maxDistance = (canvas.width / 10) * wavelength * speed.value;
    if (distanceData[distanceData.length - 1] >= maxDistance) {
        return;
    }

    setTimeout(function() {
        requestAnimationFrame(graphanimate);
    },1000);

}
canvas.width = window.innerWidth - 700;
canvas.height = 300;

graphanimate();

