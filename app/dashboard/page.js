"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard(){
  const router=useRouter();
  const [tab,setTab]=useState("home");
  const [membership,setMembership]=useState(undefined);
  const [orgName,setOrgName]=useState("");
  const [clients,setClients]=useState([]),[projects,setProjects]=useState([]),[products,setProducts]=useState([]),[sims,setSims]=useState([]);
  const [msg,setMsg]=useState("");
  const [clientForm,setClientForm]=useState({name:"",phone:"",email:""});
  const [projectForm,setProjectForm]=useState({name:"",room_type:"Sala",client_id:""});
  const [productForm,setProductForm]=useState({name:"",brand:"",category:"floor",w:"90",h:"90",price:""});
  const [productFile,setProductFile]=useState(null);
  const [simForm,setSimForm]=useState({project_id:"",product_id:"",surface:"floor"});
  const [simFile,setSimFile]=useState(null),[photoPreview,setPhotoPreview]=useState("");

  async function currentMembership(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return null;
    const {data,error}=await supabase.from("organization_members")
      .select("organization_id,role,organizations(id,name)")
      .eq("user_id",user.id).limit(1).maybeSingle();
    if(error)throw error;
    return data;
  }

  async function signed(bucket,path){
    if(!path)return null;
    const {data}=await supabase.storage.from(bucket).createSignedUrl(path,3600);
    return data?.signedUrl||null;
  }

  async function loadAll(m){
    const org=m.organization_id;
    const [a,b,c,d]=await Promise.all([
      supabase.from("clients").select("*").eq("organization_id",org).order("name"),
      supabase.from("projects").select("*").eq("organization_id",org).order("created_at",{ascending:false}),
      supabase.from("products").select("*").eq("organization_id",org).order("created_at",{ascending:false}),
      supabase.from("simulations").select("*").eq("organization_id",org).order("created_at",{ascending:false})
    ]);
    setClients(a.data||[]); setProjects(b.data||[]);
    setProducts(await Promise.all((c.data||[]).map(async p=>({...p,url:await signed("product-textures",p.texture_path)}))));
    setSims(await Promise.all((d.data||[]).map(async s=>({...s,url:await signed(s.result_image_path?"simulation-results":"environment-photos",s.result_image_path||s.original_image_path)}))));
  }

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){router.replace("/");return;}
    try{const m=await currentMembership();setMembership(m);if(m)await loadAll(m)}
    catch(e){setMsg(e?.message||"Erro ao carregar o espaço.");setMembership(null)}
  })()},[router]);

  async function createOrg(e){
    e.preventDefault();setMsg("");
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return;
    const {data:org,error}=await supabase.from("organizations").insert({name:orgName,created_by:user.id}).select("id,name").single();
    if(error){setMsg(error.message);return;}
    const {error:memberError}=await supabase.from("organization_members").insert({organization_id:org.id,user_id:user.id,role:"owner"});
    if(memberError){setMsg(memberError.message);return;}
    const m=await currentMembership();setMembership(m);if(m)await loadAll(m);
  }

  async function addClient(e){
    e.preventDefault();setMsg("");
    const {data:{user}}=await supabase.auth.getUser();
    const {error}=await supabase.from("clients").insert({organization_id:membership.organization_id,name:clientForm.name,phone:clientForm.phone||null,email:clientForm.email||null,created_by:user.id});
    if(error){setMsg(error.message);return;}
    setClientForm({name:"",phone:"",email:""});await loadAll(membership);setMsg("Cliente salvo.");
  }

  async function addProject(e){
    e.preventDefault();setMsg("");
    const {data:{user}}=await supabase.auth.getUser();
    const {error}=await supabase.from("projects").insert({organization_id:membership.organization_id,name:projectForm.name,room_type:projectForm.room_type,client_id:projectForm.client_id||null,status:"active",created_by:user.id});
    if(error){setMsg(error.message);return;}
    setProjectForm({name:"",room_type:"Sala",client_id:""});await loadAll(membership);setMsg("Projeto criado.");
  }

  async function addProduct(e){
    e.preventDefault();setMsg("");
    if(!productFile){setMsg("Escolha uma foto do produto.");return;}
    const {data:{user}}=await supabase.auth.getUser();
    const safe=productFile.name.replace(/[^a-zA-Z0-9._-]/g,"_");
    const path=`${membership.organization_id}/${crypto.randomUUID()}-${safe}`;
    const upload=await supabase.storage.from("product-textures").upload(path,productFile,{upsert:false});
    if(upload.error){setMsg(upload.error.message);return;}
    const {error}=await supabase.from("products").insert({organization_id:membership.organization_id,name:productForm.name,brand:productForm.brand||null,category:productForm.category,piece_width_cm:Number(productForm.w)||null,piece_height_cm:Number(productForm.h)||null,price_per_sqm:Number(productForm.price)||null,texture_path:path,created_by:user.id});
    if(error){setMsg(error.message);return;}
    setProductForm({name:"",brand:"",category:"floor",w:"90",h:"90",price:""});setProductFile(null);await loadAll(membership);setMsg("Produto adicionado ao catálogo.");
  }

  async function addSimulation(e){
    e.preventDefault();setMsg("");
    if(!simFile){setMsg("Escolha a foto do ambiente.");return;}
    const {data:{user}}=await supabase.auth.getUser();
    const safe=simFile.name.replace(/[^a-zA-Z0-9._-]/g,"_");
    const path=`${membership.organization_id}/${crypto.randomUUID()}-${safe}`;
    const upload=await supabase.storage.from("environment-photos").upload(path,simFile,{upsert:false});
    if(upload.error){setMsg(upload.error.message);return;}
    const {error}=await supabase.from("simulations").insert({organization_id:membership.organization_id,project_id:simForm.project_id,product_id:simForm.product_id,surface:simForm.surface,original_image_path:path,status:"pending",created_by:user.id});
    if(error){setMsg(error.message);return;}
    await loadAll(membership);setMsg("Simulação criada. A foto já está no projeto; a IA entra na v0.3.");setTab("simulations");
  }

  async function logout(){await supabase.auth.signOut();router.replace("/")}

  if(membership===undefined)return <main className="login"><div className="loginbox">Carregando PREVIEW...</div></main>;
  if(!membership)return <main className="login"><div className="loginbox">
    <div className="brand"><div className="logo">P</div><div><h1>Crie seu espaço</h1><div className="muted">Loja ou escritório de arquitetura</div></div></div>
    <form className="form" onSubmit={createOrg}><div className="field"><label>Nome da empresa</label><input value={orgName} onChange={e=>setOrgName(e.target.value)} placeholder="Ex.: Casa Revest" required /></div><button className="primary">Criar espaço PREVIEW</button>{msg&&<div className="notice">{msg}</div>}</form>
  </div></main>;

  const org=membership.organizations?.name||"PREVIEW";
  const nav=[["home","⌂","Início"],["clients","♙","Clientes"],["projects","▣","Projetos"],["products","▧","Produtos"],["simulations","◫","Simulações"],["new","⊕","Nova Simulação"]];
  const go=k=>{setTab(k);setMsg("");window.scrollTo({top:0,behavior:"smooth"})};

  return <div className="shell">
    <aside className="side"><div className="brand"><div className="logo">P</div><div><h2>PREVIEW</h2><small style={{color:"#aeb1be"}}>visualize antes de decidir</small></div></div>
      {nav.map(([k,i,l])=><a href="#" key={k} className={tab===k?"active":""} onClick={e=>{e.preventDefault();go(k)}}>{i} &nbsp;{l}</a>)}
      <div className="store"><b>{org}</b><br/><small>{membership.role}</small><br/><button onClick={logout} style={{marginTop:8,border:0,background:"transparent",color:"#bfc2cf",padding:0}}>Sair</button></div>
    </aside>
    <main className="main">{msg&&<div className="notice" style={{marginBottom:15}}>{msg}</div>}
      {tab==="home"&&<><div className="top"><div><h1>Olá! 👋</h1><div className="muted">Seu espaço de venda visual está pronto.</div></div><button className="primary" onClick={()=>go("new")}>📷 Nova Simulação</button></div>
        <div className="metrics"><div className="card metric"><b>{projects.length}</b><span>Projetos</span></div><div className="card metric"><b>{sims.length}</b><span>Simulações</span></div><div className="card metric"><b>{clients.length}</b><span>Clientes</span></div><div className="card metric"><b>{products.length}</b><span>Produtos</span></div></div>
        <div className="panel"><h2>Fluxo do PREVIEW</h2><div className="grid" style={{marginTop:14}}><div className="card flowcard"><div className="flowicon">🧱</div><div><b>1. Cadastre o material</b><div className="muted">Foto, tamanho, marca e preço.</div></div></div><div className="card flowcard"><div className="flowicon">📷</div><div><b>2. Fotografe o ambiente</b><div className="muted">Use celular ou tablet na casa do cliente.</div></div></div><div className="card flowcard"><div className="flowicon">✨</div><div><b>3. Mostre a prévia</b><div className="muted">A v0.3 aplicará apenas a superfície escolhida.</div></div></div></div></div></>}

      {tab==="clients"&&<><div className="top"><div><h1>Clientes</h1><div className="muted">Cadastro separado por empresa.</div></div></div><div className="panel"><h2>Novo cliente</h2><form className="form" onSubmit={addClient} style={{marginTop:14}}><div className="row2"><div className="field"><label>Nome</label><input value={clientForm.name} onChange={e=>setClientForm({...clientForm,name:e.target.value})} required /></div><div className="field"><label>Telefone</label><input value={clientForm.phone} onChange={e=>setClientForm({...clientForm,phone:e.target.value})} /></div></div><div className="field"><label>E-mail</label><input type="email" value={clientForm.email} onChange={e=>setClientForm({...clientForm,email:e.target.value})} /></div><button className="primary">Salvar cliente</button></form></div><div className="panel">{clients.length?<table className="table"><thead><tr><th>Cliente</th><th>Telefone</th><th>E-mail</th></tr></thead><tbody>{clients.map(x=><tr key={x.id}><td><b>{x.name}</b></td><td>{x.phone||"—"}</td><td>{x.email||"—"}</td></tr>)}</tbody></table>:<div className="empty">Nenhum cliente ainda.</div>}</div></>}

      {tab==="projects"&&<><div className="top"><div><h1>Projetos</h1><div className="muted">Organize os ambientes de cada cliente.</div></div></div><div className="panel"><h2>Novo projeto</h2><form className="form" onSubmit={addProject} style={{marginTop:14}}><div className="row2"><div className="field"><label>Nome</label><input value={projectForm.name} onChange={e=>setProjectForm({...projectForm,name:e.target.value})} placeholder="Ex.: Sala apartamento João" required /></div><div className="field"><label>Ambiente</label><select value={projectForm.room_type} onChange={e=>setProjectForm({...projectForm,room_type:e.target.value})}><option>Sala</option><option>Cozinha</option><option>Banheiro</option><option>Quarto</option><option>Área gourmet</option><option>Outro</option></select></div></div><div className="field"><label>Cliente</label><select value={projectForm.client_id} onChange={e=>setProjectForm({...projectForm,client_id:e.target.value})}><option value="">Sem cliente</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><button className="primary">Criar projeto</button></form></div><div className="panel">{projects.length?<table className="table"><thead><tr><th>Projeto</th><th>Ambiente</th><th>Status</th></tr></thead><tbody>{projects.map(x=><tr key={x.id}><td><b>{x.name}</b></td><td>{x.room_type||"—"}</td><td><span className="badge">{x.status}</span></td></tr>)}</tbody></table>:<div className="empty">Nenhum projeto ainda.</div>}</div></>}

      {tab==="products"&&<><div className="top"><div><h1>Catálogo</h1><div className="muted">Pisos e revestimentos que você realmente vende ou especifica.</div></div></div><div className="panel"><h2>Novo produto</h2><form className="form" onSubmit={addProduct} style={{marginTop:14}}><div className="row2"><div className="field"><label>Produto</label><input value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required /></div><div className="field"><label>Marca</label><input value={productForm.brand} onChange={e=>setProductForm({...productForm,brand:e.target.value})} /></div></div><div className="row2"><div className="field"><label>Categoria</label><select value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}><option value="floor">Piso</option><option value="wall">Revestimento/Parede</option><option value="other">Outro</option></select></div><div className="field"><label>Preço por m²</label><input type="number" step="0.01" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} /></div></div><div className="row2"><div className="field"><label>Largura da peça (cm)</label><input type="number" value={productForm.w} onChange={e=>setProductForm({...productForm,w:e.target.value})} /></div><div className="field"><label>Altura da peça (cm)</label><input type="number" value={productForm.h} onChange={e=>setProductForm({...productForm,h:e.target.value})} /></div></div><div className="field"><label>Foto/textura</label><input type="file" accept="image/*" onChange={e=>setProductFile(e.target.files?.[0]||null)} required /></div><button className="primary">Adicionar ao catálogo</button></form></div><div className="grid" style={{marginTop:18}}>{products.length?products.map(x=><div className="card" key={x.id}><div className="productThumb">{x.url?<img src={x.url} alt={x.name}/>:"🧱"}</div><div style={{paddingTop:12}}><b>{x.name}</b><div className="muted">{x.brand||"Sem marca"} • {x.piece_width_cm||"?"}×{x.piece_height_cm||"?"} cm</div><div style={{marginTop:7,fontWeight:800}}>{x.price_per_sqm?`R$ ${Number(x.price_per_sqm).toFixed(2)}/m²`:"Preço não informado"}</div></div></div>):<div className="panel empty">Nenhum produto no catálogo.</div>}</div></>}

      {tab==="simulations"&&<><div className="top"><div><h1>Simulações</h1><div className="muted">Histórico de fotos e estudos por projeto.</div></div><button className="primary" onClick={()=>go("new")}>+ Nova</button></div><div className="grid">{sims.length?sims.map(x=><div className="card" key={x.id}><div className="productThumb">{x.url?<img src={x.url} alt="Ambiente"/>:"📷"}</div><div style={{paddingTop:12}}><b>Simulação</b><div className="muted">{x.surface} • <span className="badge">{x.status}</span></div></div></div>):<div className="panel empty">Nenhuma simulação ainda.</div>}</div></>}

      {tab==="new"&&<><div className="top"><div><h1>Nova Simulação</h1><div className="muted">Foto → superfície → produto → IA.</div></div></div><div className="newgrid"><div className="photo">{photoPreview?<img src={photoPreview} alt="Prévia do ambiente"/>:<div style={{textAlign:"center",fontSize:18}}>📷<br/>A foto do ambiente aparecerá aqui</div>}</div><div className="panel" style={{marginTop:0}}><form className="form" onSubmit={addSimulation}><div className="field"><label>Projeto</label><select value={simForm.project_id} onChange={e=>setSimForm({...simForm,project_id:e.target.value})} required><option value="">Selecione</option>{projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div><div className="field"><label>Foto do ambiente</label><input type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files?.[0]||null;setSimFile(f);if(f)setPhotoPreview(URL.createObjectURL(f))}} required /></div><div className="field"><label>Alterar</label><select value={simForm.surface} onChange={e=>setSimForm({...simForm,surface:e.target.value})}><option value="floor">Somente piso</option><option value="wall">Somente parede</option><option value="floor_wall">Piso + parede</option></select></div><div className="field"><label>Produto</label><select value={simForm.product_id} onChange={e=>setSimForm({...simForm,product_id:e.target.value})} required><option value="">Selecione</option>{products.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div><button className="primary">✨ Preparar simulação</button><div className="muted" style={{fontSize:13}}>Nesta v0.2, a foto e o material ficam salvos. A aplicação visual automática será conectada na v0.3.</div></form></div></div></>}
    </main>
    <div className="mobileNav">{[["home","⌂","Início"],["clients","♙","Clientes"],["new","⊕","Simular"],["projects","▣","Projetos"],["products","▧","Produtos"]].map(([k,i,l])=><button key={k} onClick={()=>go(k)}><b>{i}</b>{l}</button>)}</div>
  </div>;
}
