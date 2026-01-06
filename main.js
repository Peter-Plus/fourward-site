// ==========================================
// Fourward Website Main Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initContent();
  initGallery();
  initLightbox();
  initCommentWall();
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
  const carousel = document.querySelector('.gallery-carousel');
  const { screenshots } = CONFIG.media;
  
  if (galleryTrack && screenshots) {
    // 生成图片（不复制）
    const items = screenshots.map((src, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${src}" alt="游戏截图 ${i + 1}" loading="lazy" 
             onerror="this.parentElement.style.display='none'">
      </div>
    `).join('');
    
    galleryTrack.innerHTML = items;
    
    const itemWidth = 320 + 12; // 图片宽度 + gap
    let currentOffset = 0;
    let direction = 1; // 1向右，-1向左
    let isPaused = false;
    let maxOffset = 0;
    
    // 计算最大偏移
    setTimeout(() => {
      maxOffset = Math.max(0, galleryTrack.scrollWidth - carousel.offsetWidth);
    }, 100);
    
    // 自动滚动（来回）
    function autoScroll() {
      if (!isPaused && maxOffset > 0) {
        currentOffset += 0.5 * direction;
        
        // 到达边界，反向
        if (currentOffset >= maxOffset) {
          currentOffset = maxOffset;
          direction = -1;
        } else if (currentOffset <= 0) {
          currentOffset = 0;
          direction = 1;
        }
        
        galleryTrack.style.transform = `translateX(-${currentOffset}px)`;
      }
      requestAnimationFrame(autoScroll);
    }
    autoScroll();
    
    // 悬浮暂停
    carousel?.addEventListener('mouseenter', () => { isPaused = true; });
    carousel?.addEventListener('mouseleave', () => { isPaused = false; });
    
    // 左右按钮
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    prevBtn?.addEventListener('click', () => {
      isPaused = true;
      currentOffset = Math.max(0, currentOffset - itemWidth);
      galleryTrack.style.transition = 'transform 0.4s ease';
      galleryTrack.style.transform = `translateX(-${currentOffset}px)`;
      setTimeout(() => {
        galleryTrack.style.transition = 'none';
        isPaused = false;
      }, 450);
    });
    
    nextBtn?.addEventListener('click', () => {
      isPaused = true;
      currentOffset = Math.min(maxOffset, currentOffset + itemWidth);
      galleryTrack.style.transition = 'transform 0.4s ease';
      galleryTrack.style.transform = `translateX(-${currentOffset}px)`;
      setTimeout(() => {
        galleryTrack.style.transition = 'none';
        isPaused = false;
      }, 450);
    });
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

// 初始化留言墙
function initCommentWall() {
  const { waline } = CONFIG;
  const track = document.getElementById('commentTrack');
  const input = document.getElementById('commentInput');
  const submit = document.getElementById('commentSubmit');
  
  if (!track || !waline.serverURL) return;
  
  // 加载评论
  async function loadComments() {
    try {
      const res = await fetch(`${waline.serverURL}/comment?path=/&pageSize=50`);
      const data = await res.json();
      console.log('API response:', data); // 调试用
      
      // 兼容不同格式
      const comments = data.data || data;
      
      if (comments && comments.length > 0) {
        const html = comments.map(c => {
          const text = (c.comment || c.content || '').replace(/<[^>]*>/g, '').substring(0, 50);
          const time = c.insertedAt || c.createdAt || c.time;
          return `
            <div class="comment-item">
              ${text}
              <span class="comment-time">${formatTime(time)}</span>
            </div>
          `;
        }).join('');
        // 复制一份实现无缝滚动
        track.innerHTML = html + html;
      } else {
        track.innerHTML = '<div class="comment-item">还没有留言，来说点什么吧~</div>';
      }
    } catch (e) {
      console.error('Load comments error:', e);
      track.innerHTML = '<div class="comment-item">还没有留言，来说点什么吧~</div>';
    }
  }
  
  // 格式化时间
  function formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    return Math.floor(diff / 86400000) + '天前';
  }
  
  // 发送评论
  async function postComment() {
    const content = input.value.trim();
    if (!content) return;
    
    submit.disabled = true;
    submit.textContent = '发送中...';
    
    try {
      await fetch(`${waline.serverURL}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: content,
          nick: '旅人',
          url: '/',
          ua: navigator.userAgent
        })
      });
      input.value = '';
      setTimeout(loadComments, 500);
    } catch (e) {
      alert('发送失败，请重试');
    }
    
    submit.disabled = false;
    submit.textContent = '发送';
  }
  
  submit?.addEventListener('click', postComment);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') postComment();
  });
  
  loadComments();
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
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 延迟添加，产生错落效果
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);
  
  // 为各个区块添加动画类
  document.querySelectorAll('.section, .feature-card, .info-card, .team-member').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
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