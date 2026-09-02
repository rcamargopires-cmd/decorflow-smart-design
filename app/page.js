"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setMsg(""); setLoading(true);
    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) router.replace("/dashboard");
        else setMsg("Conta criada. Se o Supabase pedir confirmação, abra o e-mail e depois entre.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/dashboard");
      }
    } catch (err) {
      setMsg(err?.message || "Não foi possível continuar.");
    } finally { setLoading(false); }
  }

  return <main className="login"><div className="loginbox">
    <div className="brand"><div className="logo">P</div><div><h1>PREVIEW</h1><div className="muted">visualize antes de decidir</div></div></div>
    <p className="muted">SaaS para arquitetos e lojas mostrarem pisos e revestimentos no ambiente real do cliente.</p>
    <form className="form" onSubmit={submit}>
      <div className="field"><label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
      <div className="field"><label>Senha</label><input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></div>
      <button className="primary" disabled={loading}>{loading ? "Aguarde..." : signup ? "Criar conta" : "Entrar"}</button>
      <button type="button" className="secondary" onClick={()=>{setSignup(!signup);setMsg("")}}>{signup ? "Já tenho conta" : "Quero criar uma conta"}</button>
      {msg && <div className="notice">{msg}</div>}
    </form>
  </div></main>;
}
