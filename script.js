const canvas = document.getElementById("game");
canvas.width=document.documentElement.clientWidth
canvas.height=document.documentElement.clientHeight
const ctx = canvas.getContext("2d");
const xtox = x=>x/1000*canvas.width
const ytoy = y=>y/1000*canvas.height

let last = 0
let count = 0
let frame10 = []
let scene = 'loading', lastscene = ''
let obj = {}
let currentTime
/* obj キー
  自動入力
    id (キーそのもの)
    t (生成した時間を自動入力)
  必須入力
    type (circle, rect, text, image)
    width
    height
    x
    y
    color
  任意入力
    f(obj,now) (動きの関数)
    radious (もしcircleなら必須)
    src (もしimageなら必須)
    font (もしtextなら必須)
    text (もしtextなら必須)
    data (なんか持たせたければ)
*/

// マウス座標管理 当たり判定などもここから使う
const mouse = { x: 0, y: 0, click: false};
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect()
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width) / canvas.width * 1000
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height) / canvas.height * 1000
})

window.onresize=e=>{
  canvas.width=document.documentElement.clientWidth
  canvas.height=document.documentElement.clientHeight
}

window.onpointerdown=e=>{
  mouse.click=true
}
window.onpointerup=e=>{
  mouse.click=false
}

window.onkeydown=e=>{
  console.log(e.key)
}

// 設定一覧
if(localStorage.getItem('lane_backwidth')===null){
  localStorage.setItem('lane_backwidth',100)
}
if(localStorage.getItem('acceleration')===null){
  localStorage.setItem('acceleration',0)
}
if(localStorage.getItem('speed')===null){
  localStorage.setItem('speed',10)
}
if(localStorage.getItem('timingA')===null){
  localStorage.setItem('timingA',0)
}
if(localStorage.getItem('timingB')===null){
  localStorage.setItem('timingB',0)
}
if(localStorage.getItem('volume_bgm')===null){
  localStorage.setItem('volume_bgm',100)
}
if(localStorage.getItem('volume_se')===null){
  localStorage.setItem('volume_se',100)
}
if(localStorage.getItem('judge_display')===null){
  localStorage.setItem('judge_display',true)
}
if(localStorage.getItem('judgefl_display')===null){
  localStorage.setItem('judgefl_display',true)
}
if(localStorage.getItem('key')===null){
  localStorage.setItem('key',{
    left:['a','ArrowLeft'],
    right:['d','ArrowRight'],
    attack:['w','ArrowUp']
  })
}

const files = Object.freeze({
})
const images = {};
const audios = {};
let loaded = 0;
const total = Object.keys(files).length;

const songs = Object.freeze([
  {title:'song1',easy:{difficulty:1,chart:[]}}
])

async function loading() {
  const tasks = Object.entries(files).map(async ([name, src]) => {
    if(src[0]=='i'){
      images[name] = await loadImage(src);
    }else{
      audios[name] = await loadAudio(src);
    }
    loaded++;
  });
  await Promise.all(tasks); // 全部終わるまで待つ
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);          // 読み込み完了
    img.onerror = () => reject(new Error(src + " の読み込みに失敗"));
    img.src = src; // onloadを先に設定してからsrcを入れる
  });
}

function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio); // 最後まで途切れず再生できる状態
    audio.onerror = () => reject(new Error(src + " の読み込みに失敗"));
    audio.src = src;
  });
}

function addobj(key,json){
  json['t'] = currentTime
  json['key'] = key
  obj[key] = json
}

function hitobj(key){
  switch(obj[key].type){
    case 'circle':
      return (mouse.x - obj[key].x)**2 + (mouse.y - obj[key].y)**2 <= obj[key].radious**2
    case 'rect':
      // console.log(obj[key],mouse)
      return obj[key].x <= mouse.x && mouse.x <= obj[key].x + obj[key].width
      &&  obj[key].y <= mouse.y && mouse.y <= obj[key].y + obj[key].height
  }
}

function update(){
  if(lastscene !== scene){
    lastscene = scene
    obj = {}
    switch(scene){
      case 'loading':
        addobj('loading_bar',{type:'rect',x:500,y:800,width:100,height:5,color:"#fff",f:(o,n)=>{
          o.width=Math.max(0,Math.min(1000,(-1)**(Math.floor(Math.random()*2))*Math.floor(Math.random()*20)))
          if(loaded>=Object.keys(files).length){scene='title'}
        }})
        addobj('loading_bgbar',{type:'rect',x:500,y:800,width:100,height:5,color:"#666"})
        // addobj('gamestart_btn',{type:'rect',x:500,y:600,width:100,height:50,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='title'}}})
        break
      case 'title':
        addobj('startbtn',{type:'rect',x:500,y:600,width:100,height:50,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='selectsong'}}})
        
        break
      case 'story':
        break
      case 'selectsong':
        for(let i=0;i<songs.length;i++){
          addobj('song'+i,{type:'rect',x:550,y:100+i*100,width:800,height:100,color:"#800",data:{id:i},f:(o,n)=>{if(hitobj(o.key)){
            console.log(o.data.id)
          }}})
          addobj('backbtn',{type:'rect',x:100,y:100,width:40,height:40,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='title'}}})
          addobj('setting',{type:'rect',x:100,y:200,width:40,height:40,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='setting_ss'}}})
        }
        break
      case 'setting_ss':
        addobj('backbtn',{type:'rect',x:100,y:100,width:40,height:40,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='selectsong'}}})
        break
      case 'play':
        addobj('lane0',{type:'line',x1:200,y1:0,x2:200,y2:1000,width:2,color:"#800"})
        addobj('lane1',{type:'line',x1:400,y1:0,x2:400,y2:1000,width:2,color:"#800"})
        addobj('lane2',{type:'line',x1:600,y1:0,x2:600,y2:1000,width:2,color:"#800"})
        addobj('lane3',{type:'line',x1:800,y1:0,x2:800,y2:1000,width:2,color:"#800"})
        addobj('backbtn',{type:'rect',x:100,y:100,width:40,height:40,color:"#800",f:(o,n)=>{if(hitobj(o.key)){scene='selectsong'}}})
        break
      case 'result':
        break
    }
  }
  // オブジェクトの動作
  let objkeys = Object.keys(obj)
  for(let i=0;i<objkeys.length;i++){
    obj[objkeys[i]].f?.(obj[objkeys[i]],currentTime)
  }
}

function draw(now){
  // 前のフレームからの経過時間(ms)
  const dt = now - last
  last = now
  count++
  //fps計測
  let c_fps = dt
  if(count<10){
    frame10.push(dt)
  }else{
    for(let i=0;i<9;i++){
      frame10[i] = frame10[i+1]
      c_fps += frame10[i]
    }
    frame10[9] = dt
  }
  const FPS = 10000/c_fps

  // 描画リセット
  ctx.clearRect(0, 0, xtox(canvas.width), ytoy(canvas.height))
  ctx.fillStyle='black'
  ctx.fillRect(0,0,xtox(1000),ytoy(1000))
  // オブジェクトの描画
  let objkeys = Object.keys(obj)
  for(let i=0;i<objkeys.length;i++){
    let objt = obj[objkeys[i]]
    ctx.fillStyle=objt.color
    switch(objt.type){
      case 'rect':
        ctx.fillRect(xtox(objt.x),ytoy(objt.y),xtox(objt.width),ytoy(objt.height))
        break
      case 'circle':
        ctx.beginPath()
        ctx.ellipse(xtox(objt.x),ytoy(objt.y), xtox(objt.radious),ytoy(objt.radious), 0, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        break
      case 'text':
        ctx.font = objt.font
        ctx.fillText(objt.text,xtox(objt.x),ytoy(objt.y))
        break
      case 'image':
        ctx.fillRect(xtox(objt.x),ytoy(objt.y),xtox(objt.width),ytoy(objt.height))
        break
      case 'line':
        ctx.beginPath()
        ctx.moveTo(xtox(objt.x1),ytoy(objt.y1))
        ctx.lineTo(xtox(objt.x2),ytoy(objt.y2))
        ctx.strokeStyle = objt.color
        ctx.lineWidth = objt.width
        ctx.stroke()
    }
  }

  // const t = audio.currentTime * 1000
    // const y = hitLineY - (note.time - t) * speed

  /* fps描画用
    ctx.fillStyle='red'
    ctx.font = "100px serif";
    ctx.fillText('fps'+FPS.toFixed(2), xtox(50), ytoy(50));
  //*/
}

function loop(now) {
  currentTime = now
  update(now)
  draw(now)
  requestAnimationFrame(loop) // 次のフレームも予約する
}

async function main() {
  try{
    requestAnimationFrame(loop); // 読み込み後にゲーム開始
    await loading();
  }catch(e){
    ctx.fillText("読み込みエラー:"+e.message,xtox(500),ytoy(500))
  }
}

main()
