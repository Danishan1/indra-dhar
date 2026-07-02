export const renderRoutesHTML = (routes) => {
  const jsonRoutes = JSON.stringify(routes);

  return `
<!DOCTYPE html>
<html>
<head>
  <title>API Explorer</title>

  <style>
    body {
      font-family: Arial;
      background: #0f172a;
      color: #e2e8f0;
      margin: 0;
      padding: 20px;
    }

    h1 { margin-bottom: 10px; }

    .topbar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 15px;
      align-items: center;
    }

    input, select {
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #334155;
      background: #1e293b;
      color: white;
    }

    .stats {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }

    .badge {
      background: #2a476f;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
    }

    .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 10px;
    }

    .card {
      background: #363e4b;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #293a53;
    }

    .method {
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
      margin-right: 8px;
      display: inline-block;
    }

    .GET { background: #6cb486; }
    .POST { background: #5470ae; }
    .PATCH { background: #d5aa61; }
    .DELETE { background: #b35d5d; }

    .path {
      font-family: monospace;
      font-size: 13px;
    }

    .hidden {
      display: none;
    }
  </style>
</head>

<body>

<h1>API Explorer</h1>

<div class="topbar">

  <input id="search" placeholder="Search route (e.g. auth, roles, /v1)" />

  <select id="methodFilter">
    <option value="ALL">All Methods</option>
    <option value="GET">GET</option>
    <option value="POST">POST</option>
    <option value="PATCH">PATCH</option>
    <option value="DELETE">DELETE</option>
  </select>

  <div class="stats">
    <div class="badge" id="total"></div>
    <div class="badge" id="getCount"></div>
    <div class="badge" id="postCount"></div>
    <div class="badge" id="patchCount"></div>
    <div class="badge" id="deleteCount"></div>
  </div>

</div>

<div class="container" id="list"></div>

<script>
const routes = ${jsonRoutes};

const list = document.getElementById("list");
const search = document.getElementById("search");
const methodFilter = document.getElementById("methodFilter");

function render(data) {
  list.innerHTML = data.map(r => \`
    <div class="card">
      <span class="method \${r.method}">\${r.method}</span>
      <span class="path">\${r.path}</span>
    </div>
  \`).join("");

  // stats
  document.getElementById("total").innerText = "Total: " + data.length;
  document.getElementById("getCount").innerText = "GET: " + data.filter(r => r.method==="GET").length;
  document.getElementById("postCount").innerText = "POST: " + data.filter(r => r.method==="POST").length;
  document.getElementById("patchCount").innerText = "PATCH: " + data.filter(r => r.method==="PATCH").length;
  document.getElementById("deleteCount").innerText = "DELETE: " + data.filter(r => r.method==="DELETE").length;
}

function filter() {
  const text = search.value.toLowerCase();
  const method = methodFilter.value;

  const filtered = routes.filter(r => {
    const matchText = r.path.toLowerCase().includes(text);
    const matchMethod = method === "ALL" || r.method === method;
    return matchText && matchMethod;
  });

  render(filtered);
}

search.addEventListener("input", filter);
methodFilter.addEventListener("change", filter);

// initial render
render(routes);
</script>

</body>
</html>
  `;
};
