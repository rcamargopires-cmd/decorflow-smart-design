import { generateImage } from "ai";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 180;

const SUPABASE_URL = "https://wcojyjcsfcaguvyhvtio.supabase.co";
const SUPABASE_KEY = "sb_publishable_ScR84lw4eJ5aLghKh-2_WA_CR0_9M3o";

function labelSurface(value){
  if(value === "wall") return "wall/revestimento de parede";
  if(value === "floor_wall") return "piso e parede selecionados";
  return "piso";
}

function isImageFile(value){
  return value instanceof File && value.type?.startsWith("image/");
}

function detectOutputSize(bytes){
  try{
    // O Estúdio envia a fotografia como PNG. No PNG, largura e altura ficam no IHDR.
    if(bytes.length >= 24 && bytes[0]===137 && bytes[1]===80 && bytes[2]===78 && bytes[3]===71){
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const width = view.getUint32(16, false);
      const height = view.getUint32(20, false);
      const ratio = width / Math.max(1, height);
      if(ratio > 1.12) return "1536x1024";
      if(ratio < 0.89) return "1024x1536";
    }
  }catch{}
  return "1024x1024";
}

export async function POST(request){
  try{
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if(!token) return Response.json({ok:false,message:"Sessão necessária."},{status:401});

    const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global:{headers:{Authorization:`Bearer ${token}`}},
      auth:{persistSession:false,autoRefreshToken:false}
    });

    const {data:{user},error:userError} = await db.auth.getUser(token);
    if(userError || !user) return Response.json({ok:false,message:"Sessão inválida."},{status:401});

    const form = await request.formData();
    const simulationId = String(form.get("simulation_id") || "");
    const original = form.get("original");
    const texture = form.get("texture");
    const mask = form.get("mask");

    if(!simulationId || !isImageFile(original) || !isImageFile(texture) || !isImageFile(mask)){
      return Response.json({ok:false,message:"Foto, textura e seleção são obrigatórias."},{status:400});
    }

    const {data:simulation,error:simError} = await db
      .from("simulations")
      .select("id,surface,organization_id,product_id,products(name,brand,piece_width_cm,piece_height_cm,finish)")
      .eq("id",simulationId)
      .single();

    if(simError || !simulation){
      return Response.json({ok:false,message:"Simulação não encontrada para esta conta."},{status:404});
    }

    const product = simulation.products || {};
    const dimensions = product.piece_width_cm && product.piece_height_cm
      ? `${product.piece_width_cm} x ${product.piece_height_cm} cm`
      : "escala realista conforme a referência";

    const prompt = `
Você é um motor profissional de visualização arquitetônica de materiais.
A PRIMEIRA imagem é a fotografia original do ambiente do cliente.
A SEGUNDA imagem é a referência EXATA do piso ou revestimento a ser aplicado.

Edite SOMENTE a superfície indicada pela máscara da primeira imagem. A superfície é: ${labelSurface(simulation.surface)}.
Produto: ${product.brand ? `${product.brand} ` : ""}${product.name || "material cadastrado"}.
Dimensão nominal da peça: ${dimensions}.
${product.finish ? `Acabamento: ${product.finish}.` : ""}

Regras obrigatórias:
- preserve exatamente câmera, enquadramento, geometria do ambiente, móveis, portas, janelas, objetos e decoração;
- não adicione, remova, mova ou redesenhe nenhum móvel ou objeto;
- use a segunda imagem como referência fiel de cor, desenho, veios, manchas e aparência do material;
- aplique o material com escala coerente com a dimensão da peça, perspectiva correta do plano e juntas discretas e realistas;
- preserve sombras, reflexos, iluminação e oclusões naturais;
- não transforme o ambiente em uma nova decoração, apenas troque o acabamento selecionado;
- mantenha bordas junto a móveis e objetos o mais fiéis possível à fotografia original.

O resultado deve parecer uma fotografia real do MESMO ambiente após a troca do acabamento.
`.trim();

    const originalBytes = new Uint8Array(await original.arrayBuffer());
    const textureBytes = new Uint8Array(await texture.arrayBuffer());
    const maskBytes = new Uint8Array(await mask.arrayBuffer());
    const outputSize = detectOutputSize(originalBytes);

    const result = await generateImage({
      model:"openai/gpt-image-2",
      prompt:{
        text:prompt,
        images:[originalBytes,textureBytes],
        mask:maskBytes
      },
      size:outputSize,
      n:1,
      providerOptions:{openai:{quality:"medium"}},
      abortSignal:AbortSignal.timeout(170000)
    });

    const image = result.image || result.images?.[0];
    if(!image?.base64) throw new Error("A IA não retornou uma imagem.");

    return Response.json({
      ok:true,
      image:`data:${image.mediaType || "image/png"};base64,${image.base64}`,
      model:"openai/gpt-image-2",
      size:outputSize
    });
  }catch(error){
    console.error("PREVIEW_SIMULATE_ERROR",error);
    const message = error?.message || "Não foi possível gerar a simulação.";
    return Response.json({ok:false,message},{status:500});
  }
}
