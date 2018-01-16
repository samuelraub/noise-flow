function setup() {
  createCanvas(400, 400);
  background(255);

  const makeGrid = (offset, scale, width, height) => {
    let cols = new Array(floor(width / offset)).fill(0);
    return (cols = cols.map((col, colIndex) => {
      let row = new Array(floor(height / offset)).fill(0);
      return (row = row.map((row, rowIndex) => {
        return noise(colIndex * scale, rowIndex * scale);
      }));
    }));
  };

  const visualizeGrid = (grid, offset) => {
    grid.forEach((col, x) => {
      col.forEach((val, y) => {
        push();
        translate(x * offset, y * offset);
        noStroke();
        stroke(255, 50);
        fill(map(val, 0, 1, 0, 255));
        noFill();
        rect(0, 0, offset, offset);
        rotate(map(val, 0, 1, -PI, PI));
        stroke(255, 0, 0);
        line(0, 0, offset, 0);
        pop();
      });
    });
  };

  const makeParticle = function (x, y) {
    return {
      x,
      y
    };
  };

  const makeParticlesArray = (count, gridSize) => {
    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);

    return new Array(count)
      .fill(0)
      .map(elem => makeParticle(floor(random(cols / 2) + cols / 4), floor(random(rows / 2) + cols / 4)));
  }

  const showParticles = (particles, size, col, offset = 1) => {
    particles.forEach(party => {
      fill(col[0], col[1], col[2], col[3]);
      noStroke();
      ellipse(party.x * offset, party.y * offset, size);
    });
  };

  const advectParticle = (particle, vector, offset) => {
    let nX = particle.x + vector.x * offset;
    let nY = particle.y + vector.y * offset;
    return makeParticle(nX, nY);
  };

  const advectParticlesArray = (particles, noisefield, offset) => {
    return particles.filter(particle => {
      if (particle.x < noisefield.length
        && particle.x > 0
        && particle.y < noisefield[0].length
        && particle.y > 0) {
        return true
      } else {
        return false
      }
    }).map(particle => {
      let lookupX = floor(particle.x);
      let lookupY = floor(particle.y);
      let noiseVal = noisefield[lookupX][lookupY];
      let angle = map(noiseVal, 0, 1, -PI * 3, PI * 3);
      let tempV = createVector(cos(angle), sin(angle));
      let vector = tempV.normalize();
      return advectParticle(particle, vector, offset);
    });
  };

  let scale = 0.01;
  let gridSize = 1;
  let grid = makeGrid(gridSize, scale, width, height);

  let particles = makeParticlesArray(100, gridSize);

  let loop = new Array(500).fill(0);
  loop.forEach((elem, id) => {
    showParticles(particles, 1, [96, 144, 223, 50], gridSize);
    particles = advectParticlesArray(particles, grid, 1);
  });
}
