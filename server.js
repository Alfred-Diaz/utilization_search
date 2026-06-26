exports = {
  getMember: async function(args) {
    const url = `${iparams.supabase_url}/functions/v1/member-search`;
    const res = await $request.get(url,{
      headers:{
        Authorization:`Bearer ${iparams.supabase_service_key}`,
        "Content-Type":"application/json"
      },
      query:{ member: args.member }
    });
    return res;
  }
};