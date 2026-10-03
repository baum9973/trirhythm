const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function update(){

}
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // const t = audio.currentTime * 1000;
  // for (const note of notes) {
    // const y = hitLineY - (note.time - t) * speed;
    ctx.fillRect(5*Math.floor(Math.random()*100), 5*Math.floor(Math.random()*100), 60, 20); // ノーツを四角で描く
  // }
}

function loop(now) {
  update()
  draw()
  requestAnimationFrame(loop) // 次のフレームも予約する
}
requestAnimationFrame(loop);
