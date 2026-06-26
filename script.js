// ----------------------------------------------------------------
// These two values are safe to expose client-side: the publishable
// anon key only has EXECUTE on the two narrow SECURITY DEFINER
// functions below — it cannot read any table directly.
// ----------------------------------------------------------------
const SUPABASE_URL = "https://qzaspntfiwidpnqlyczt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YXNwbnRmaXdpZHBucWx5Y3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTg5MzUsImV4cCI6MjA5NDI5NDkzNX0.9EiVT_2K2T9ZjJkye_Ktyl12565meAMnW-qmQZuIMVk";

// Maps a category name (returned by get_member_availments_current_year)
// to the id of the element that should display its count. Edit this
// if the category list in that Supabase function ever changes.
const CATEGORY_ELEMENT_IDS = {
  "OPD/IPD": "count-opd-ipd",
  "Dental": "count-dental",
  "Reimbursement": "count-reimbursement",
  "APE/ECU": "count-ape-ecu"
};

async function callRpc(fn, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error(`${fn} failed: ${res.status}`);
  return res.json();
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function showState(title, message) {
  setText("state-title", title);
  setText("state-message", message);
  document.getElementById("state-box").classList.remove("hidden");
  document.getElementById("card-content").classList.add("hidden");
}

function showCard() {
  document.getElementById("state-box").classList.add("hidden");
  document.getElementById("card-content").classList.remove("hidden");
}

async function loadMember(email) {
  const year = new Date().getFullYear();

  const [profileRows, availmentRows] = await Promise.all([
    callRpc("get_member_profile", { p_email: email }),
    callRpc("get_member_availments_current_year", { p_email: email })
  ]);

  const profile = profileRows[0] || null;

  if (!profile && availmentRows.length === 0) {
    showState("No record found", `We couldn't find any requests under ${email}.`);
    return;
  }

  const counts = {};
  let total = 0;
  availmentRows.forEach(row => {
    counts[row.category] = Number(row.ticket_count);
    total += Number(row.ticket_count);
  });

  setText("member-name", profile && profile.member_name ? profile.member_name : email);
  setText("member-subline", profile && profile.company ? `${email} · ${profile.company}` : email);
  setText("year", year);
  setText("total-number", total);

  Object.entries(CATEGORY_ELEMENT_IDS).forEach(([category, elementId]) => {
    setText(elementId, counts[category] || 0);
  });

  showCard();
}

function init() {
  const params = new URLSearchParams(window.location.search);
  const email = (params.get("email") || "").trim();

  if (!email) {
    showState(
      "We need your email to continue",
      "Open this page from the member portal so we can show your own records."
    );
    return;
  }

  loadMember(email).catch(() => {
    showState(
      "Something went wrong",
      "We couldn't load your availment history. Please try again in a moment."
    );
  });
}

init();
