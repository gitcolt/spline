import {Path} from './path';
import {dist} from './mathHelpers';
import {Point} from './point';

const path = new Path();
path.addAnchor(0, 0);
path.grabbedNodes = [path.anchors[path.anchors.length - 1]];

document.addEventListener('mousedown', e => {
  if (path.isClosed) {
    path.anchors.forEach(anchor => {
      const p = new Point(e.clientX, e.clientY);
      if (dist(p, anchor.handles[0]) < anchor.handles[0].radius) {
        path.grabbedNodes = [anchor.handles[0]];
        return;
      } else if (dist(p, anchor.handles[1]) < anchor.handles[1].radius) {
        path.grabbedNodes = [anchor.handles[1]];
        return;
      } else if (dist(p, anchor) < anchor.radius) {
        path.grabbedNodes = [anchor];
        return;
      }
    });
    return;
  }

  if (path.anchors.length >= 3 &&
      dist(new Point(e.clientX, e.clientY), path.anchors[0]) < path.anchors[0].radius) {
    path.close();
    return;
  }

  path.grabbedNodes = [path.anchors[path.anchors.length - 1].handles[1]];
});

document.addEventListener('mouseup', e => {
  if (path.isClosed) {
    path.grabbedNodes = [];
    return;
  }

  path.addAnchor(e.clientX, e.clientY);
  path.grabbedNodes = [path.anchors[path.anchors.length - 1]];
});

document.addEventListener('mousemove', e => {
  if (path.isClosed) {
    path.grabbedNodes.forEach(node => node.moveTo(e.clientX, e.clientY));
    return;
  }

  path.grabbedNodes.forEach(node => node.moveTo(e.clientX, e.clientY));
});

const can = document.querySelector('#can');
can.width = window.innerWidth;
can.height = window.innerHeight;
const ctx = can.getContext('2d');

(function loop() {
  ctx.fillStyle = '#ede4c0';
  ctx.fillRect(0, 0, can.width, can.height);

  path.draw(ctx);

  requestAnimationFrame(loop);
})();
