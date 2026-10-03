function update(){

}
function draw(){
  
}

function loop(now) {
  update()
  draw()
  console.log("hello")
  requestAnimationFrame(loop) // 次のフレームも予約する
}
requestAnimationFrame(loop);
