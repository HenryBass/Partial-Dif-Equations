width = 128
height = 128
var c = document.getElementById("canvas");
var ctx = canvas.getContext('2d', { alpha: false });
let csize = 512
var scalex = (csize / width);
var scaley = (csize / height);
var drawpos = [0, 0]
var mdown = false
var place = false
let damp = 0.95
let t = 0

var sheat = false
var swave = true
var sburger = false
var slaplace = false

let RCell = class {
  constructor(c, v, d, x, y) {
    this.c = c;
    this.v = v;
    this.d = d;
    this.x = x;
    this.y = y;
  }
};

var pxs = new Array(width);
for (var x = 0; x < width; x++) {
  pxs[x] = (new Array(height))
  for (var y = 0; y < height; y++) {
    pxs[x][y] = new RCell(0.1, 0, 1, x, y);
  }
}


var ratemap = new Array(width);
for (var i = 0; i < pxs.length; i++) {
  ratemap[i] = new Array(height).fill(0);
}

function d2(pxs, x, y) {
    let nx = 0

    if (x < width - 1) {
        nx += pxs[x + 1][y].v
        //sx += 1
    } if (x > 0) {
      nx += pxs[x - 1][y].v
      //sx += 1
    } if (y < height - 1) {
      nx += pxs[x][y + 1].v
      //sx += 1
    } if ((y > 0)) {
      nx += pxs[x][y - 1].v
      //sx += 1 
    } else {
      nx = 0
      return nx
    }

    nx = (nx / 4) - pxs[x][y].v
    
    return nx
}

function d1(pxs, x, y) {
  let nx = 0
  
  if (x < width - 1) {
    nx += pxs[x + 1][y].v
} if (x > 0) {
    nx -= pxs[x - 1][y].v
} if (y < height - 1) {
    nx += pxs[x][y + 1].v
} if ((y > 0)) {
    nx -= pxs[x][y - 1].v
} else {
    nx = 0
}

  nx = (nx * 0.5)
  
  return nx
}

function getCursorPosition (canvas, e) {
  let rect = canvas.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  if (x > 2 * scalex && y > 2 * scalex && x < csize-1 && y < csize-1) {
    drawpos = [Math.floor(x/scalex), Math.floor(y/scaley)]
  }
}

setInterval(() => {
  requestAnimationFrame(draw);
}, 1000 / 30);


function draw() {
  t+=1
  let y = 0
  let x = 0
  if (mdown && (!place)) {
    pxs[drawpos[0]][drawpos[1]].v += 15
  } else if (mdown && place) {
    for (let xi = 0; xi < 3; xi ++) {
      for (let yi = 0; yi < 3; yi ++) {
        pxs[drawpos[0] + xi][drawpos[1] + yi].c = 0.5
        pxs[drawpos[0] + xi][drawpos[1] + yi].d = 1
      }
    }
  }

  while (y < height) {
    while (x < width) {
      px = pxs[x][y];

      ctx.fillStyle = 'hsl('+ (((360/2)+50) - (Math.floor(px.v * 360))) + ',' + ((px.c * 10 * 100) + 25) + '%, ' + (100 * 0.5) + '%)';
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

          newmap[x][y].v += d2(pxs, x, y) * pxs[x][y].c * 2;
        
      }
      if (swave) {
          ratemap[x][y] += d2(pxs, x, y) * pxs[x][y].c;
      }
      if (sburger) {
        let v = 1 * ((d2(pxs, x, y) * 0.2) - (pxs[x][y].v * 0.1 * d1(pxs, x, y))); 
        //v *= 0.9

        if (Math.abs(v) !== Infinity && Math.abs(v) !== NaN && Math.abs(v) < 1000) {
          newmap[x][y] += v
        } else {
          newmap[x][y] += v
        }
      }
      if (slaplace) {
        newmap[x][y] = d2(pxs, x, y) * 0.94;
      }

      newmap[x][y].v = (newmap[x][y].v  + (ratemap[x][y])) * pxs[x][y].d
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


document.onkeypress = function(evt) {
  var char = String.fromCharCode(window.event.keyCode);
  if (char == "e") {
    place = !place
    console.log(place)
  }
};
