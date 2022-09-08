width = 128
height = 128
var c = document.getElementById("canvas");
var ctx = canvas.getContext('2d', { alpha: false });
let csize = 512
var scalex = (csize / width);
var scaley = (csize / height);
var drawpos = [0, 0]
var mdown = false
let damp = 0.95
var sheat = true
var swave = false

var pxs = new Array(width);
for (var i = 0; i < pxs.length; i++) {
  pxs[i] = new Array(height).fill(0);
}

var ratemap = new Array(width);
for (var i = 0; i < pxs.length; i++) {
  ratemap[i] = new Array(height).fill(0);
}

function d2(pxs, x, y) {
    let nx = 0

    if (x < width - 1) {
        nx += pxs[x + 1][y]
    } if (x > 0) {
      nx += pxs[x - 1][y]
    } if (y < height - 1) {
      nx += pxs[x][y + 1]
    } if ((y > 0)) {
      nx += pxs[x][y - 1] 
    } else {
      nx = 0
    }


    //console.log(nx)

    nx = (nx * 0.25) -  pxs[x][y]
    return nx
}

function getCursorPosition (canvas, e) {
  let rect = canvas.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  if (x > 0 && y > 0 && x < csize && y < csize) {
    drawpos = [Math.floor(x/scalex), Math.floor(y/scaley)]
  }
}

setInterval(() => {
  requestAnimationFrame(draw);
}, 1);


function draw() {
  let y = 0
  let x = 0
  if (mdown) {
    pxs[drawpos[0]][drawpos[1]] += 10
  }
  while (y < height) {
    while (x < width) {
      px = pxs[x][y];

      ctx.fillStyle = 'hsl('+ (((360/2)+50) - (Math.floor(px * 360))) + ',100%,50%)';
      //ctx.fillStyle = 'rgb('+ Math.floor(px * 255) + ',100,50)';
      ctx.fillRect(x * scalex, y * scaley, scalex, scaley);
      x++;
    }
    x = 0;
    y++;
  }
  x = 0
  y = 0
  
  var newmap = pxs
  while (y < height) {
    while (x < width) {
      if (sheat) {
        newmap[x][y] += d2(pxs, x, y) * 0.1;
      }
      if (swave) {
        ratemap[x][y] += (d2(pxs, x, y) * 0.1);
      }
      newmap[x][y] += (ratemap[x][y] * 1)
      ratemap[x][y] *= damp
      x++;
    }
    x = 0;
    y++;
  }
  pxs = newmap
}



canvas.addEventListener('mousedown', (e) => {
  mdown = true
})

canvas.addEventListener('mouseup', (e) => {
  getCursorPosition(canvas, e, pxs)
  mdown = false
})

c.addEventListener("mousemove", function (e) {
  getCursorPosition(canvas, e, pxs)
});