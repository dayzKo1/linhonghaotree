var thetaMin = 0;
var thetaMax = 6 * Math.PI;
var period = 5;
var lineSpacing = 1 / 30;
var lineLength = lineSpacing / 2;
var yScreenOffset = 300;
var xScreenOffset = 260;
var xScreenScale = 360;
var yScreenScale = 360;
var yCamera = 2;
var zCamera = -3;

var rate = 1 / (2 * Math.PI); // every rotation y gets one bigger
var factor = rate / 3;

function run() {
  var ctx = document.getElementById('scene').getContext('2d'),
    spirals = [
      new Spiral({
        foreground: "#220000", // Second shadow for red spiral
        angleOffset: Math.PI * 0.92,
        factor: 0.90 * factor
      }),
      new Spiral({
        foreground: "#002211", // Second shadow for cyan spiral
        angleOffset: -Math.PI * 0.08,
        factor: 0.90 * factor
      }),
      new Spiral({
        foreground: "#660000", // red spiral shadow
        angleOffset: Math.PI * 0.95,
        factor: 0.93 * factor
      }),
      new Spiral({
        foreground: "#003322", // cyan spiral shadow
        angleOffset: -Math.PI * 0.05,
        factor: 0.93 * factor
      }),
      new Spiral({
        foreground: "#ff0000", // red Spiral
        angleOffset: Math.PI,
        factor: factor
      }),
      new Spiral({
        foreground: "#00ffcc", // cyan spiral
        angleOffset: 0,
        factor: factor
      })];

  renderFrame(); // animation loop starts here

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, 500, 500);
    ctx.beginPath();
    spirals.forEach(renderSpiral);
  }

  function renderSpiral(spiral) {
    spiral.render(ctx);
  }

  function Spiral(config) {
    var offset = 0;
    var lineSegments = computeLineSegments();

    this.render = function (ctx) {
      offset -= 1;
      if (offset <= -period) {
        offset += period;
      }

      lineSegments[offset].forEach(drawLineSegment);
    };

    function drawLineSegment(segment) {
      stroke(config.foreground, segment.start.alpha);
      ctx.moveTo(segment.start.x, segment.start.y);
      ctx.lineTo(segment.end.x, segment.end.y);
    }

    function computeLineSegments() {
      var lineSegments = {};
      var factor = config.factor;
      var thetaNew, thetaOld;
      for (var offset = 0; offset > -period; offset--) {
        lineSegments[offset] = lines = [];
        for (
          var theta = thetaMin + getThetaChangeRate(thetaMin, offset * lineSpacing / period, rate, factor);
          theta < thetaMax;
          theta += getThetaChangeRate(theta, lineSpacing, rate, factor)
        ) {
          thetaOld = (theta >= thetaMin) ? theta : thetaMin;
          thetaNew = theta + getThetaChangeRate(theta, lineLength, rate, factor);

          if (thetaNew <= thetaMin) {
            continue;
          }

          lines.push({
            start: getPointByAngle(thetaOld, factor, config.angleOffset, rate),
            end: getPointByAngle(thetaNew, factor, config.angleOffset, rate)
          });
        }
      }

      return lineSegments;
    }
  }

  function stroke(color, alpha) {
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
  }

  function getPointByAngle(theta, factor, angleOffset, rate) {
    var x = theta * factor * Math.cos(theta + angleOffset);
    var z = - theta * factor * Math.sin(theta + angleOffset);
    var y = rate * theta;
    // now that we have 3d coordinates, project them into 2d space:
    var point = projectTo2d(1.6 * x, 0.9 * y, z);
    // calculate point's color alpha level:
    point.alpha = Math.atan((y * factor / rate * 0.1 + 0.02 - z) * 40) * 0.35 + 0.65;

    return point;
  }

  function getThetaChangeRate(theta, lineLength, rate, factor) {
    return lineLength / Math.sqrt(rate * rate + factor * factor * theta * theta);
  }

  function projectTo2d(x, y, z) {
    return {
      x: xScreenOffset + xScreenScale * (x / (z - zCamera)),
      y: yScreenOffset + yScreenScale * ((y - yCamera) / (z - zCamera))
    };
  }

  // I actually want it to be slower then 60fps
  function requestAnimationFrame(callback) {
    window.setTimeout(callback, 1000 / 24);
  }
}


function closeModel() {
  document.getElementById("model").style.display = 'none';
  document.getElementById("modelDiv").style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openModel() {
  document.getElementById("model").style.display = 'block';
  document.getElementById("modelDiv").style.display = 'block';
  document.body.style.overflow = 'auto';
}

function dianwo() {
  document.getElementById("dianwo").innerHTML = 'I love u,too~';
}

function button1() {
  document.getElementById("model").style.left = `${randomNum(0, 1600)}px`;
  document.getElementById("model").style.top = `${randomNum(0, 800)}px`;
  // 不遮挡后面的内容将body设置为原始样式，也就是实现可滚动
  document.body.style.overflow = 'auto';
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
} 