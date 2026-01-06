// ==========================================
// Fourward Website Main Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initContent();
  initGallery();
  initLightbox();
  initWaline();
  initScrollEffects();
});

// 根据配置填充内容
function initContent() {
  const { game, team, links, media, download, features, controls } = CONFIG;
  
  // Hero
  setText('heroDesc', game.description);
  setText('downloadBtnText', download.buttonText);
  
  // Links
  setLink('itchLink', links.itch);
  setLink('itchLink2', links.itch);
  
  if (links.bilibili) {
    const biliLink = document.getElementById('bilibiliLink');
    if (biliLink) {
      biliLink.href = links.bilibili;
      biliLink.style.display = 'inline-flex';
    }
  }
  
  // About
  setText('storyText', game.description);
  setText('infoGenre', game.genre);
  setText('infoPeriod', game.devPeriod);
  setText('infoEngine', game.engine);
  setText('infoJam', `${game.jamName} by ${game.jamBy}`);
  
  // Features
  const featuresContainer = document.getElementById('featuresContainer');
  if (featuresContainer && features) {
    featuresContainer.innerHTML = features.map(f => `
      <div class="feature-card">
        <div class="feature-title">${f.title}</div>
        <div class="feature-desc">${f.desc}</div>
      </div>
    `).join('');
  }
  
  // Controls
  const controlsGrid = document.getElementById('controlsGrid');
  if (controlsGrid && controls) {
    controlsGrid.innerHTML = controls.map(c => `
      <div class="control-item">
        <span class="control-key">${c.key}</span>
        <span class="control-action">${c.action}</span>
      </div>
    `).join('');
  }
  
  // Video
  const videoSource = document.getElementById('videoSource');
  if (videoSource && media.video) {
    videoSource.src = media.video;
    document.getElementById('gameVideo').load();
  }
  
  // Download
  setText('downloadPlatform', game.platform);
  setText('downloadSize', download.size);
  setText('downloadText', download.buttonText);
  setLink('downloadLink', download.file);
  
  // Team
  setText('teamName', team.name);
  setText('footerTeam', team.name);
  
  const teamGrid = document.getElementById('teamGrid');
  if (teamGrid && team.members) {
    teamGrid.innerHTML = team.members.map(m => `
      <div class="team-member">
        <div class="member-avatar">${m.name.charAt(0)}</div>
        <div class="member-name">${m.name}</div>
        <div class="member-role">${m.role}</div>
        ${m.email ? `
          <a href="mailto:${m.email}" class="member-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>联系</span>
          </a>
        ` : ''}
      </div>
    `).join('');
  }
}

// 初始化图库轮播
function initGallery() {
  const galleryTrack = document.getElementById('galleryTrack');
  const { screenshots } = CONFIG.media;
  
  if (galleryTrack && screenshots) {
    // 复制两份实现无缝滚动
    const items = [...screenshots, ...screenshots].map((src, i) => `
      <div class="gallery-item" data-index="${i % screenshots.length}">
        <img src="${src}" alt="游戏截图 ${(i % screenshots.length) + 1}" loading="lazy" 
             onerror="this.parentElement.style.display='none'">
      </div>
    `).join('');
    
    galleryTrack.innerHTML = items;
  }
}

// 初始化灯箱
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  
  const screenshots = CONFIG.media.screenshots;
  let currentIndex = 0;
  
  // 点击图片打开灯箱
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      currentIndex = parseInt(item.dataset.index);
      showImage(currentIndex);
      lightbox.classList.add('active');
    }
  });
  
  // 关闭
  closeBtn?.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
  
  // 上一张/下一张
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    showImage(currentIndex);
  });
  
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % screenshots.length;
    showImage(currentIndex);
  });
  
  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    } else if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
      showImage(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % screenshots.length;
      showImage(currentIndex);
    }
  });
  
  function showImage(index) {
    lightboxImg.src = screenshots[index];
  }
}

// 初始化 Waline 评论
function initWaline() {
  const { waline } = CONFIG;
  
  if (typeof Waline !== 'undefined' && waline.serverURL) {
    Waline.init({
      el: '#waline',
      serverURL: waline.serverURL,
      placeholder: waline.placeholder,
      avatar: waline.avatar,
      pageSize: waline.pageSize,
      lang: waline.lang,
      dark: true,
      meta: ['nick'],
      requiredMeta: ['nick'],
      login: 'disable',
      copyright: false
    });
  }
}

// 滚动效果
function initScrollEffects() {
  // 导航栏背景
  const nav = document.querySelector('.nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(31, 45, 45, 0.95)';
    } else {
      nav.style.background = 'linear-gradient(to bottom, rgba(31, 45, 45, 1), transparent)';
    }
  });
  
  // 元素进入视口动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// 工具函数
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setLink(id, href) {
  const el = document.getElementById(id);
  if (el && href) el.href = href;
}