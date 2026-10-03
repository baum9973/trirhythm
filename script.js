const canvas = document.getElementById("game");
canvas.width=document.documentElement.clientWidth
canvas.height=document.documentElement.clientHeight
const ctx = canvas.getContext("2d");
const xtox = x=>x/1000*canvas.width
const ytoy = y=>y/1000*canvas.height
let last = 0
let count = 0
let frame10 = []

window.onresize=e=>{
  canvas.width=document.documentElement.clientWidth
  canvas.height=document.documentElement.clientHeight
}

function update(){

}
function draw(){
  const dt = now - last; // 前のフレームからの経過時間(ms)
  last = now
  count++
  let c_fps = dt
  if(count<10){
    frame10.push(dt)
  }else{
    for(let i=0;i<9;i++){
      frame10[i] = frame[i+1]
      c_fps += frame10[i]
    }
    frame10[9] = dt
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle='black'
  ctx.fillRect(0,0,xtox(1000),ytoy(1000));
  // const t = audio.currentTime * 1000;
  // for (const note of notes) {
    // const y = hitLineY - (note.time - t) * speed;
  ctx.fillStyle='white'
  for(let i=0;i<1000;i++){
    ctx.fillRect(xtox(10*Math.floor(Math.random()*100)), ytoy(10*Math.floor(Math.random()*100)), 60, 20); // ノーツを四角で描く
  }
  ctx.fillText('fps'+(10/c_fps).toFixed(2), 10, 50);
  // }
}

function loop(now) {
  update()
  draw()
  requestAnimationFrame(loop) // 次のフレームも予約する
}
requestAnimationFrame(loop);
