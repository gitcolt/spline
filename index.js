import {Path} from './path';

const can = document.querySelector('#can');
can.width = window.innerWidth;
can.height = window.innerHeight;
const ctx = can.getContext('2d');

const path = new Path();

can.addEventListener('mousedown', e => path.onMouseDown(e));
can.addEventListener('mouseup', e => path.onMouseUp(e));
can.addEventListener('mousemove', e => path.onMouseMove(e));

(function loop() {
  ctx.fillStyle = '#ede4c0';
  ctx.fillRect(0, 0, can.width, can.height);
  path.draw(ctx);
  requestAnimationFrame(loop);
})();
