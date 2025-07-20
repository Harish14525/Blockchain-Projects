let contract;
let signer;

const contractAddress = '0xadCBf4AA99E4162484A3cc8BbF09a28655A165Da';

async function init() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  
  document.getElementById("wallet").innerText = `🟢 Connected: ${await signer.getAddress()}`;

  const abi = await fetch('abi.json').then(res => res.json());
  contract = new ethers.Contract(contractAddress, abi, signer);

  loadCandidates();
}

async function loadCandidates() {
  const candidates = await contract.getAllCandidates();
  const container = document.getElementById("candidates");
  container.innerHTML = '';

  for (let name of candidates) {
    const votes = await contract.totalVotesFor(name);
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
     <strong>${name}</strong> - Votes: ${votes}
     <button onclick="vote('${name}')">Vote</button>
    `;

    container.appendChild(div);
  }

  const hasVoted = await contract.hasVoted(await signer.getAddress());
  document.getElementById("status").innerText = hasVoted
    ? "✅ You have already voted."
    : "❗ You have not voted yet.";
}

async function vote(name) {
  try {
    const tx = await contract.vote(name);
    document.getElementById("status").innerText = "⏳ Voting in progress...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Vote cast!";
    loadCandidates();
  } catch (err) {
    if (err.code === 4001 || err.code === "ACTION_REJECTED") {
      document.getElementById("status").innerText = "❌ Transaction rejected by user.";
    } else {
      document.getElementById("status").innerText = `❌ Unexpected error: ${err.message}`;
    }
    console.error("Vote error:", err);
  }
}


window.onload = init;
