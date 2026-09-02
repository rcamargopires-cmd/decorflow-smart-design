"use client";
import { usePathname } from "next/navigation";

export default function StudioLauncher(){
  const path=usePathname();
  if(path!=="/dashboard")return null;
  return <a className="studioFab" href="/studio">✨ Estúdio IA</a>;
}
