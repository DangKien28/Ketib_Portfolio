class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Lấy các props (attributes) tương tự React
        const title = this.getAttribute('title') || 'Project Title';
        const description = this.getAttribute('description') || 'Mô tả ngắn gọn về dự án.';
        const imageUrl = this.getAttribute('image') || 'images/default-project.jpg';
        const repoLink = this.getAttribute('repo-link') || '#';
        const prodLink = this.getAttribute('prod-link') || '#';
        const tagLabel = this.getAttribute('tag-label') || 'Feature';
        
        const likes = this.getAttribute('likes') || '0';
        const rating = this.getAttribute('rating') || '0.0';
        const comments = this.getAttribute('comments') || '0';

        // Cấu trúc HTML sử dụng Semantic Class đã được trích xuất CSS ra style.css
        this.innerHTML = `
            <div class="project-card-wrapper">
                <div class="project-card-image-box">
                    <img src="${imageUrl}" alt="${title}" class="project-card-img">
                    <div class="project-card-badge">
                        <span>${tagLabel}</span>
                    </div>
                </div>
                <div class="project-card-content">
                    <div class="project-card-header">
                        <h3 class="project-card-title">${title}</h3>
                        <p class="project-card-desc">${description}</p>
                    </div>
                    <div class="project-card-footer">
                        <div class="project-card-stats">
                            <span><span class="material-symbols-outlined">favorite</span> ${likes}</span>
                            <span><span class="material-symbols-outlined">star</span> ${rating}</span>
                            <span><span class="material-symbols-outlined">chat_bubble</span> ${comments}</span>
                        </div>
                        <div class="project-card-actions">
                            <a href="${prodLink}" class="project-btn" target="_blank" onclick="event.stopPropagation()">PROD_URL</a>
                            <a href="${repoLink}" class="project-btn" target="_blank" onclick="event.stopPropagation()">REPOS_GIT</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Đăng ký component với trình duyệt để sử dụng thẻ <project-card>
if (!customElements.get('project-card')) {
    customElements.define('project-card', ProjectCard);
}