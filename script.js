const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const xtox = x=>x/800*canvas.width
const ytoy = y=>y/800*canvas.height

window.onresize=e=>{
  canvas.width=window.width
  canvas.height=window.height
}

function update(){

}
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // const t = audio.currentTime * 1000;
  // for (const note of notes) {
    // const y = hitLineY - (note.time - t) * speed;
    ctx.fillRect(xtox(5*Math.floor(Math.random()*100)), ytoy(5*Math.floor(Math.random()*100)), 60, 20); // ノーツを四角で描く
  // }
}

function loop(now) {
  update()
  draw()
  requestAnimationFrame(loop) // 次のフレームも予約する
}
requestAnimationFrame(loop);
