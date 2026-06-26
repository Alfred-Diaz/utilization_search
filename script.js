document.getElementById("member-search-form")?.addEventListener("submit",async(e)=>{
e.preventDefault();
const member=document.getElementById("member-search").value;
const res=await client.request.invoke("getMember",{member});
console.log(res);
});