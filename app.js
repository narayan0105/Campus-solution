import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("issueForm");
const list = document.getElementById("issueList");
const loadingIndicator = document.getElementById("loadingIndicator");

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value?.trim();
  const description = document.getElementById("description").value?.trim();

  if (!title || !description) {
    alert("Title and description are required");
    return;
  }

  try {
    await addDoc(collection(db, "issues"), {
      title,
      description,
      status: "open",
      createdAt: new Date().toISOString()
    });
    form.reset();
    alert("Issue reported successfully!");
  } catch (error) {
    console.error("Error reporting issue:", error);
    alert("Failed to report issue. Please try again.");
  }
});

// Real-time issue updates
async function loadIssues() {
  const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
  
  onSnapshot(q, (snapshot) => {
    list.innerHTML = "";
    
    if (snapshot.empty) {
      list.innerHTML = "<li>No issues reported yet</li>";
      return;
    }
    
    snapshot.forEach(doc => {
      const { title, description, createdAt } = doc.data();
      const li = document.createElement("li");
      li.className = "issue-item";
      li.innerHTML = `
        <div class="issue-content">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
          <small>${new Date(createdAt).toLocaleDateString()}</small>
        </div>
      `;
      list.appendChild(li);
    });
  });
}

// Utility function to prevent XSS
function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, m => map[m]);
}

loadIssues();

// Initialize Google Map
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  new Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
    mapTypeControl: true,
    streetViewControl: false
  });
}

initMap().catch(console.error);
