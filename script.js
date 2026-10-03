const canvas = document.getElementById("game");
canvas.width=document.documentElement.clientWidth
canvas.height=document.documentElement.clientHeight
const ctx = canvas.getContext("2d");
const xtox = x=>x/1000*canvas.width
const ytoy = y=>y/1000*canvas.height

window.onresize=e=>{
  canvas.width=document.documentElement.clientWidth
  canvas.height=document.documentElement.clientHeight
}

function update(){

}
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle='black'
  ctx.fillRect(0,0,xtox(1000),ytoy(1000));
  // const t = audio.currentTime * 1000;
  // for (const note of notes) {
    // const y = hitLineY - (note.time - t) * speed;
  ctx.fillStyle='white'
  ctx.fillRect(xtox(10*Math.floor(Math.random()*100)), ytoy(10*Math.floor(Math.random()*100)), 60, 20); // ノーツを四角で描く
  // }
}

function loop(now) {
  update()
  draw()
  requestAnimationFrame(loop) // 次のフレームも予約する
}
requestAnimationFrame(loop);
