interface Options {
  seed: string;
  size?: number;
  scale?: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
}

interface Point {
  x: number;
  y: number;
  color: string;
}

export default class Blockie {
  // The random number is a js implementation of the Xorshift PRNG
  randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values
  size: number;
  color: string;
  bgcolor: string;
  spotcolor: string;
  pixels: Array<Point>;

  // This stuff is mutating itself so constructor order should stay like this.
  constructor(seed: string, options = {} as Options) {
    this.seedrand(seed.toLowerCase());

    this.size = options.size || 8;
    this.color = options.color || this.createColor();
    this.bgcolor = options.bgcolor || this.createColor();
    this.spotcolor = options.spotcolor || this.createColor();
    this.pixels = this.buildPixels();
  }

  private seedrand(seed: string) {
    for (let i = 0; i < this.randseed.length; i++) {
      this.randseed[i] = 0;
    }
    for (let i = 0; i < seed.length; i++) {
      this.randseed[i % 4] =
        (this.randseed[i % 4] << 5) - this.randseed[i % 4] + seed.charCodeAt(i);
    }
  }

  private rand() {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    var t = this.randseed[0] ^ (this.randseed[0] << 11);

    this.randseed[0] = this.randseed[1];
    this.randseed[1] = this.randseed[2];
    this.randseed[2] = this.randseed[3];
    this.randseed[3] =
      this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8);

    return (this.randseed[3] >>> 0) / ((1 << 31) >>> 0);
  }

  private createColor() {
    //saturation is the whole color spectrum
    var h = Math.floor(this.rand() * 360);
    //saturation goes from 40 to 100, it avoids greyish colors
    var s = this.rand() * 60 + 40 + "%";
    //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    var l = (this.rand() + this.rand() + this.rand() + this.rand()) * 25 + "%";

    var color = "hsl(" + h + "," + s + "," + l + ")";
    return color;
  }

  private createImageData() {
    var dataWidth = Math.ceil(this.size / 2);
    var mirrorWidth = this.size - dataWidth;

    let data: Array<number> = [];
    for (var y = 0; y < this.size; y++) {
      var row: Array<number> = [];
      for (var x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(this.rand() * 2.3);
      }

      let r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);

      for (var i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }

    return data;
  }

  private buildPixels() {
    var imageData = this.createImageData();
    var width = Math.sqrt(imageData.length);

    const pixels: Array<Point> = [];
    for (var i = 0; i < imageData.length; i++) {
      // if data is 0, leave the background
      if (imageData[i]) {
        var row = Math.floor(i / width);
        var col = i % width;

        // 1 - foreground
        // 2 - spot color
        pixels.push({
          x: col,
          y: row,
          color: imageData[i] === 1 ? this.color : this.spotcolor,
        });
      }
    }
    return pixels;
  }

  public getSvgString(scale = 3) {
    return `<rect x="0" y="0" width="${this.size * scale}" height="${
      this.size * scale
    }" fill="${this.bgcolor}" />
  ${this.pixels
    .map(
      ({ x, y, color }) =>
        `<rect x="${x * scale}" y="${
          y * scale
        }" width="${scale}" height="${scale}" fill="${color}" />`
    )
    .join("")}`;
  }
}
