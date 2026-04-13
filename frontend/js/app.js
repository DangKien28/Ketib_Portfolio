// ===== CẤU HÌNH API =====
const API_GATEWAY = "http://localhost:8080/api";

// ===== QUẢN LÝ TRẠNG THÁI (ROUTER) =====
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item[data-view], .btn-deploy[data-view]");
    const routerView = document.getElementById("router-view");

    function loadView(viewName) {
        // 1. Cập nhật Sidebar UI
        navItems.forEach(item => item.classList.remove("active"));
        const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
        if (activeNav) activeNav.classList.add("active");

        // 2. Load Template vào Main
        const template = document.getElementById(`tpl-${viewName}`);
        if (template) {
            routerView.innerHTML = template.innerHTML;
            
            // 3. Execute View Logic
            if (viewName === "collabs") {
                fetchCollabs();
            } else if (viewName === "deploy") {
                setupDeployForm();
            }
        } else {
            // Màn hình ảo My Projects (Trong demo này sẽ skip chưa làm template)
            routerView.innerHTML = `<h2>MODULE_NOT_INITIALIZED</h2><p class="text-muted">The ${viewName} module is offline.</p>`;
        }
    }

    // Gắn Event cho Navigation
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const viewName = item.getAttribute("data-view");
            loadView(viewName);
        });
    });

    // Mặc định load Overview
    loadView("overview");
});


// ===== LOGIC NGHIỆP VỤ =====

// Format dữ liệu thời gian
function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// Map Trạng thái -> CSS Classes
function getStatusBadge(status) {
    status = status ? status.toUpperCase() : "UNKNOWN";
    if (status === "PENDING" || status === "REQUESTED") return `<span class="badge badge-pending">${status}</span>`;
    if (status === "ACCEPTED" || status === "APPROVED") return `<span class="badge badge-approved">${status}</span>`;
    if (status === "COMPLETED") return `<span class="badge badge-completed">${status}</span>`;
    return `<span class="badge badge-tech">${status}</span>`;
}

// 1. Lấy dữ liệu Collab
async function fetchCollabs() {
    const tbody = document.getElementById("collab-table-body");
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center">Loading synchronization events...</td></tr>`;

    try {
        const response = await fetch(`${API_GATEWAY}/collab`);
        if (!response.ok) throw new Error("API ERROR");
        const data = await response.json();
        
        tbody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="text-accent font-mono" style="font-size:0.8rem">#COL-${item.id.substring(0,4).toUpperCase()}</td>
                <td><strong style="color:var(--text-main)">${item.project_name}</strong></td>
                <td>${item.user_id.substring(0,8)}...</td> <!-- Demo: Lấy UUID rút gọn làm Tên -->
                <td class="text-muted">${item.client_email}</td>
                <td>${getStatusBadge(item.status)}</td>
                <td>
                    <div style="display:flex; gap: 10px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-muted tooltip" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-accent tooltip" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-pink">Failed to sync: ${err.message}. Node might be offline.</td></tr>`;
    }
}

// 2. Add New Project Form & WASM logic
function setupDeployForm() {
    const form = document.getElementById("deploy-form");
    const dropZone = document.getElementById("image-drop-zone");
    const fileInput = document.getElementById("file-input");
    const wasmStatus = document.getElementById("wasm-status");

    let processedImageBuffer = null;

    // Kéo thả files
    dropZone.addEventListener("click", () => fileInput.click());
    
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    
    dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });
    
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
            handleImageProcessing(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
            handleImageProcessing(e.target.files[0]);
        }
    });

    // Dummy WASM function for now (Phase 4.1)
    async function handleImageProcessing(file) {
        dropZone.querySelector("h4").innerText = file.name;
        dropZone.querySelector("p").innerText = `Kích thước gốc: ${(file.size / 1024).toFixed(2)} KB`;
        wasmStatus.innerHTML = `[WASM-PROCESSOR] Initializing memory array...<br>[WASM-PROCESSOR] Watermarking image...`;
        
        // Cần compile mã C++ ra file .wasm. Trong khi chờ, giả lập call WASM
        setTimeout(() => {
            wasmStatus.innerHTML += `<br><span style="color:#22c55e">[WASM-PROCESSOR] Compression complete. Kích thước mới: ${(file.size / 1024 * 0.4).toFixed(2)} KB</span>`;
        }, 1500);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById("prj-title").value,
            description: document.getElementById("prj-desc").value,
            githubUrl: document.getElementById("prj-github").value,
            liveUrl: document.getElementById("prj-live").value
        };

        try {
            // Header X-User-Role do Admin cấp (Giả lập admin)
            const response = await fetch(`${API_GATEWAY}/projects`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-User-Role": "ADMIN" 
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert("SYONCHRONIZED: Project Deployed!");
                form.reset();
                dropZone.querySelector("h4").innerText = "DRAG AND DROP VISUALS";
                wasmStatus.innerHTML = "";
            } else {
                alert("Lỗi triển khai. Code: " + response.status);
            }
        } catch (error) {
            alert("Lỗi kết nối tới Node API Gateway: " + error.message);
        }
    });
}
