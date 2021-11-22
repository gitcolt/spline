import {Point} from './point';
import {cubicCurve} from './mathHelpers';

const STEP_SIZE = 0.1;
const ANCHOR_COLOR = 'red';
const HANDLE_COLOR = 'lightgray';
const CURVE_COLOR = 'darkblue';

class Node extends Point {
  constructor(x = 0, y = 0, {radius, color} = {}) {
    super(x, y);
    this.color = color;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}

export class Handle extends Node {
  constructor(x, y, nodeOpts = {radius: 8, color: HANDLE_COLOR}) {
    super(x, y, nodeOpts);
    this.parent = null;
  }

  moveTo(x, y, lockCorrespondingHandle = true) {
    this.x = x;
    this.y = y;

    const parentAnchor = this.parent;
    if (parentAnchor == null)
      return;
    const otherHandle = parentAnchor.handles[0] == this ? parentAnchor.handles[1] :
                                                          parentAnchor.handles[0];
    [otherHandle.x, otherHandle.y] = [parentAnchor.x + (parentAnchor.x - this.x),
                                      parentAnchor.y + (parentAnchor.y - this.y)];
  }
}

export class Anchor extends Node {
  constructor(x = 0, y = 0, nodeOpts = {radius: 15, color: ANCHOR_COLOR}) {
    super(x, y, nodeOpts);
    const handleLeft = new Handle(x, y);
    handleLeft.parent = this;
    const handleRight = new Handle(x, y);
    handleRight.parent = this;
    this.handles = [handleLeft, handleRight];
  }

  moveTo(x, y) {
    const dX = x - this.x;
    const dY = y - this.y;
    const handleLeft = this.handles[0];
    const handleRight = this.handles[1];
    [handleLeft.x, handleLeft.y] = [handleLeft.x + dX, handleLeft.y + dY];
    [handleRight.x, handleRight.y] = [handleRight.x + dX, handleRight.y + dY];
    this.x = x;
    this.y = y;
  }
}

export class Path {
  constructor() {
    this.anchors = [];
    this.grabbedNodes = [];
    this.curveColor = CURVE_COLOR;
    this.isClosed = false;
  }

  addAnchor(x, y) {
    const anchor = new Anchor(x, y);
    this.anchors.push(anchor);
  }

  close() {
    this.anchors.pop();
    this.isClosed = true;
  }

  draw(ctx) {
    if (this.anchors.length >= 2) {
      for (let i = 0; i < this.anchors.length - 1; i++) {
        // curve
        const steps = generateCurve(
          this.anchors[i],
          this.anchors[i].handles[1],
          this.anchors[i + 1].handles[0],
          this.anchors[i + 1]
        );
        ctx.beginPath();
        ctx.strokeStyle = this.curveColor;
        ctx.lineWidth = 2;
        ctx.moveTo(steps[0].x, steps[0].y);
        for (let j = 1; j < steps.length; j++) {
          ctx.lineTo(steps[j].x, steps[j].y);
        }
        ctx.stroke();
      }

      if (this.isClosed) {
        const steps = generateCurve(
          this.anchors[this.anchors.length - 1],
          this.anchors[this.anchors.length - 1].handles[1],
          this.anchors[0].handles[0],
          this.anchors[0]
        );
        ctx.beginPath();
        ctx.strokeStyle = this.curveColor;
        ctx.lineWidth = 2;
        ctx.moveTo(steps[0].x, steps[0].y);
        for (let j = 1; j < steps.length; j++) {
          ctx.lineTo(steps[j].x, steps[j].y);
        }
        ctx.stroke();
      }
    }

    this.anchors.forEach(anchor => {
      // handle arms
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(anchor.handles[0].x, anchor.handles[0].y);
      ctx.lineTo(anchor.x, anchor.y);
      ctx.lineTo(anchor.handles[1].x, anchor.handles[1].y);
      ctx.stroke();

      anchor.draw(ctx);
      anchor.handles[0].draw(ctx);
      anchor.handles[1].draw(ctx);
    });
  }
}

function generateCurve(p0, p1, p2, p3) {
  const steps = [];
  for(let t = 0; t < 1; t += STEP_SIZE) {
    const step = cubicCurve(p0, p1, p2, p3, t);
    steps.push(step);
  }
  return steps;
}
