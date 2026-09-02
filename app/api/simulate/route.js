export async function POST(){
  return Response.json({ok:false,code:"AI_NOT_CONNECTED",message:"Pipeline visual entra na v0.3."},{status:501});
}
