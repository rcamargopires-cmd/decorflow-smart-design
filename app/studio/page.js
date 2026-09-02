"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);img.onerror=reject;img.crossOrigin="anonymous";img.src=src;
  });
}

function canvasBlob(canvas,type="image/png",quality=0.95){
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Falha ao preparar imagem.")),type,quality));
}

function fitSize(w,h){
  const max=1536;
  const scale=Math.min(1,max/Math.max(w,h));
  let nw=Math.max(320,Math.round((w*scale)/16)*16);
  let nh=Math.max(320,Math.round((h*scale)/16)*16);
  return {w:nw,h:nh};
}

export default function Studio(){
  const router=useRouter();
  const displayRef=useRef(null),sourceRef=useRef(null),maskRef=useRef(null),lastRef=useRef(null),drawingRef=useRef(false);
  const [sim,setSim]=useState(null),[originalUrl,setOriginalUrl]=useState(""),[textureUrl,setTextureUrl]=useState(""),[resultUrl,setResultUrl]=useState("");
  const [msg,setMsg]=useState(""),[busy,setBusy]=useState(false),[brush,setBrush]=useState(42),[mode,setMode]=useState("paint"),[hasMask,setHasMask]=useState(false),[slider,setSlider]=useState(50);

  async function signed(bucket,path){
    if(!path)return "";
    const {data,error}=await supabase.storage.from(bucket).createSignedUrl(path,3600);
    if(error)throw error;return data?.signedUrl||"";
  }

  function redraw(){
    const d=displayRef.current,s=sourceRef.current,m=maskRef.current;if(!d||!s||!m)return;
    const ctx=d.getContext("2d");ctx.clearRect(0,0,d.width,d.height);ctx.drawImage(s,0,0);
    ctx.save();ctx.globalAlpha=.38;ctx.drawImage(m,0,0);ctx.restore();
  }

  async function initialize(url){
    const img=await loadImage(url);const size=fitSize(img.naturalWidth,img.naturalHeight);
    for(const ref of [displayRef,sourceRef,maskRef]){ref.current.width=size.w;ref.current.height=size.h;}
    const s=sourceRef.current.getContext("2d");s.clearRect(0,0,size.w,size.h);s.drawImage(img,0,0,size.w,size.h);
    maskRef.current.getContext("2d").clearRect(0,0,size.w,size.h);setHasMask(false);redraw();
  }

  useEffect(()=>{(async()=>{
    try{
      const {data:{session}}=await supabase.auth.getSession();if(!session){router.replace("/");return;}
      const id=new URLSearchParams(window.location.search).get("id");if(!id){setMsg("Simulação não informada.");return;}
      const {data,error}=await supabase.from("simulations").select("*,products(*),projects(*)").eq("id",id).single();
      if(error)throw error;setSim(data);
      const [o,t,r]=await Promise.all([
        signed("environment-photos",data.original_image_path),
        signed("product-textures",data.products?.texture_path),
        data.result_image_path?signed("simulation-results",data.result_image_path):Promise.resolve("")
      ]);
      setOriginalUrl(o);setTextureUrl(t);setResultUrl(r);await initialize(o);
    }catch(e){setMsg(e?.message||"Não foi possível abrir o estúdio.");}
  })()},[router]);

  function pointFromEvent(e){
    const c=displayRef.current,rect=c.getBoundingClientRect();
    return {x:(e.clientX-rect.left)*(c.width/rect.width),y:(e.clientY-rect.top)*(c.height/rect.height)};
  }

  function paintLine(a,b){
    const m=maskRef.current,ctx=m.getContext("2d");
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=brush*(m.width/900);
    if(mode==="erase"){ctx.globalCompositeOperation="destination-out";ctx.strokeStyle="#000";}
    else{ctx.globalCompositeOperation="source-over";ctx.strokeStyle="#fff";setHasMask(true);}
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();redraw();
  }

  function pointerDown(e){e.preventDefault();drawingRef.current=true;displayRef.current.setPointerCapture?.(e.pointerId);const p=pointFromEvent(e);lastRef.current=p;paintLine(p,p);}
  function pointerMove(e){if(!drawingRef.current)return;e.preventDefault();const p=pointFromEvent(e);paintLine(lastRef.current,p);lastRef.current=p;}
  function pointerUp(e){drawingRef.current=false;lastRef.current=null;displayRef.current.releasePointerCapture?.(e.pointerId);}
  function clearMask(){maskRef.current?.getContext("2d").clearRect(0,0,maskRef.current.width,maskRef.current.height);setHasMask(false);redraw();}

  async function buildOpenAIMask(){
    const select=maskRef.current;const c=document.createElement("canvas");c.width=select.width;c.height=select.height;const x=c.getContext("2d");
    x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation="destination-out";x.drawImage(select,0,0);x.globalCompositeOperation="source-over";
    return c;
  }

  async function generate(){
    if(!sim||!hasMask){setMsg("Pinte primeiro a área do piso ou revestimento que pode ser alterada.");return;}
    setBusy(true);setMsg("Preparando a área selecionada...");
    try{
      const {data:{session}}=await supabase.auth.getSession();if(!session)throw new Error("Sessão expirada.");
      await supabase.from("simulations").update({status:"processing",error_message:null}).eq("id",sim.id);

      const openMask=await buildOpenAIMask();
      const [originalBlob,maskBlob,textureResponse]=await Promise.all([
        canvasBlob(sourceRef.current),canvasBlob(openMask),fetch(textureUrl)
      ]);
      if(!textureResponse.ok)throw new Error("Não foi possível carregar a textura do produto.");
      const textureBlob=await textureResponse.blob();
      const form=new FormData();
      form.append("simulation_id",sim.id);form.append("original",originalBlob,"ambiente.png");form.append("mask",maskBlob,"mascara.png");form.append("texture",textureBlob,"produto."+(textureBlob.type.includes("png")?"png":"jpg"));
      setMsg("A IA está aplicando o material. Isso pode levar alguns segundos...");
      const response=await fetch("/api/simulate",{method:"POST",headers:{Authorization:`Bearer ${session.access_token}`},body:form});
      const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.message||"Falha na geração.");

      setMsg("Preservando exatamente o restante do ambiente...");
      const ai=await loadImage(data.image);const final=document.createElement("canvas");final.width=sourceRef.current.width;final.height=sourceRef.current.height;const f=final.getContext("2d");f.drawImage(sourceRef.current,0,0);
      const layer=document.createElement("canvas");layer.width=final.width;layer.height=final.height;const l=layer.getContext("2d");l.drawImage(ai,0,0,layer.width,layer.height);l.globalCompositeOperation="destination-in";l.drawImage(maskRef.current,0,0);l.globalCompositeOperation="source-over";f.drawImage(layer,0,0);
      const finalBlob=await canvasBlob(final);

      const stamp=Date.now();const base=`${sim.organization_id}`;const resultPath=`${base}/results/${sim.id}-${stamp}.png`;const maskPath=`${base}/masks/${sim.id}-${stamp}.png`;
      const [upResult,upMask]=await Promise.all([
        supabase.storage.from("simulation-results").upload(resultPath,finalBlob,{contentType:"image/png",upsert:false}),
        supabase.storage.from("simulation-results").upload(maskPath,maskBlob,{contentType:"image/png",upsert:false})
      ]);
      if(upResult.error)throw upResult.error;if(upMask.error)throw upMask.error;
      const {error:updateError}=await supabase.from("simulations").update({result_image_path:resultPath,mask_path:maskPath,status:"ready",error_message:null}).eq("id",sim.id);if(updateError)throw updateError;
      setResultUrl(URL.createObjectURL(finalBlob));setSim({...sim,status:"ready",result_image_path:resultPath,mask_path:maskPath});setMsg("Simulação pronta. O ambiente fora da área pintada foi preservado pixel a pixel.");
    }catch(e){
      setMsg(e?.message||"Não foi possível gerar a simulação.");
      if(sim)await supabase.from("simulations").update({status:"failed",error_message:e?.message||"Falha na geração"}).eq("id",sim.id);
    }finally{setBusy(false);}
  }

  if(!sim)return <main className="login"><div className="loginbox"><b>PREVIEW Estúdio</b><p className="muted">{msg||"Carregando ambiente..."}</p><button className="secondary" onClick={()=>router.push("/dashboard")}>Voltar</button></div></main>;
  const product=sim.products||{};

  return <main className="studioPage">
    <div className="studioTop"><div><div className="studioBrand"><div className="logo">P</div><div><b>PREVIEW Estúdio</b><div className="muted">{sim.projects?.name||"Projeto"} • {product.name||"Material"}</div></div></div></div><button className="secondary" onClick={()=>router.push("/dashboard")}>← Dashboard</button></div>
    {msg&&<div className="notice" style={{marginBottom:14}}>{msg}</div>}

    {resultUrl&&<section className="panel" style={{marginTop:0}}><div className="top"><div><h2>Antes × Depois</h2><div className="muted">Arraste para comparar.</div></div><span className="badge">PRONTO</span></div><div className="compareStudio"><img src={originalUrl} alt="Original"/><img src={resultUrl} alt="Resultado" className="compareAfter" style={{clipPath:`inset(0 0 0 ${slider}%)`}}/><div className="compareLine" style={{left:`${slider}%`}}/></div><input className="rangeStudio" type="range" min="0" max="100" value={slider} onChange={e=>setSlider(Number(e.target.value))}/></section>}

    <section className="studioGrid">
      <div className="studioCanvasWrap"><canvas ref={displayRef} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}/><canvas ref={sourceRef} style={{display:"none"}}/><canvas ref={maskRef} style={{display:"none"}}/></div>
      <div className="panel studioTools" style={{marginTop:0}}><h2>1. Marque a superfície</h2><p className="muted">Passe o dedo ou mouse somente sobre a parte visível que deve receber o material. Não pinte móveis, portas ou objetos.</p>
        <div className="toolToggle"><button className={mode==="paint"?"primary":"secondary"} onClick={()=>setMode("paint")}>🖌️ Pintar área</button><button className={mode==="erase"?"primary":"secondary"} onClick={()=>setMode("erase")}>⌫ Apagar</button></div>
        <div className="field"><label>Tamanho do pincel</label><input type="range" min="12" max="110" value={brush} onChange={e=>setBrush(Number(e.target.value))}/></div>
        <button className="secondary" onClick={clearMask}>Limpar seleção</button>
        <div className="materialCard">{textureUrl&&<img src={textureUrl} alt={product.name}/>}<div><b>{product.name}</b><div className="muted">{product.brand||""}{product.piece_width_cm&&product.piece_height_cm?` • ${product.piece_width_cm}×${product.piece_height_cm} cm`:""}</div></div></div>
        <button className="primary generateButton" disabled={busy||!hasMask} onClick={generate}>{busy?"Gerando...":"✨ Gerar prévia com IA"}</button>
        <div className="muted" style={{fontSize:12}}>A IA usa o material cadastrado como referência. Depois, o PREVIEW recompõe a foto original e mantém intactos todos os pixels fora da sua seleção.</div>
      </div>
    </section>
  </main>;
}
