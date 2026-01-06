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
    teamGrid.innerHTML = team.members.map(m => {
      // 判断是否是图片路径
      const isImage = m.avatar && (m.avatar.includes('/') || m.avatar.includes('.'));
      const avatarContent = isImage 
        ? `<img src="${m.avatar}" alt="${m.name}" onerror="this.parentElement.innerHTML='${m.name.charAt(0)}'">`
        : (m.avatar || m.name.charAt(0));
      
      return `
        <div class="team-member">
          <div class="member-avatar">${avatarContent}</div>
          <div class="member-name">${m.name}</div>
          <div class="member-role">${m.role}</div>
          ${m.email ? `
            <div class="member-contact" data-email="${m.email}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span class="contact-tooltip">${m.email}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // 点击复制邮箱
    teamGrid.querySelectorAll('.member-contact').forEach(el => {
      el.addEventListener('click', () => {
        const email = el.dataset.email;
        navigator.clipboard.writeText(email).then(() => {
          const tooltip = el.querySelector('.contact-tooltip');
          const original = tooltip.textContent;
          tooltip.textContent = '已复制!';
          setTimeout(() => {
            tooltip.textContent = original;
          }, 1500);
        });
      });
    });
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

// 初始化弹幕留言墙
function initCommentWall() {
  const { waline } = CONFIG;
  const wall = document.getElementById('commentWall');
  const input = document.getElementById('commentInput');
  const submit = document.getElementById('commentSubmit');
  
  if (!wall || !waline.serverURL) return;
  
  let comments = [];
  let activeComments = new Set(); // 当前显示的弹幕内容
  
  // 加载评论
  async function loadComments() {
    try {
      const res = await fetch(`${waline.serverURL}/comment?path=/&pageSize=50`);
      const data = await res.json();
      const list = data.data || data;
      
      if (list && list.length > 0) {
        comments = list.map(c => {
          return (c.comment || c.content || '').replace(/<[^>]*>/g, '').substring(0, 50);
        }).filter(t => t.length > 0);
      }
      
      if (comments.length === 0) {
        comments = ['还没有留言，来说点什么吧~'];
      }
      
      // 开始生成弹幕
      startDanmaku();
    } catch (e) {
      comments = ['还没有留言，来说点什么吧~'];
      startDanmaku();
    }
  }
  
  // 生成单个弹幕
  function createDanmaku() {
    if (comments.length === 0) return;
    
    // 随机选一条不在当前显示中的
    let text;
    const available = comments.filter(c => !activeComments.has(c));
    if (available.length === 0) {
      // 所有弹幕都在显示中，等待
      return;
    }
    text = available[Math.floor(Math.random() * available.length)];
    activeComments.add(text);
    
    const el = document.createElement('div');
    el.className = 'comment-item';
    el.textContent = text;
    
    // 随机大小
    const size = 0.85 + Math.random() * 0.3; // 0.85 - 1.15
    el.style.fontSize = size + 'rem';
    
    // 随机垂直位置
    const wallHeight = wall.offsetHeight;
    const top = Math.random() * (wallHeight - 40);
    el.style.top = top + 'px';
    el.style.right = '-300px';
    
    // 随机速度 (8-15秒)
    const duration = 8 + Math.random() * 7;
    el.style.animationDuration = duration + 's';
    
    wall.appendChild(el);
    
    // 动画结束后移除
    el.addEventListener('animationend', () => {
      activeComments.delete(text);
      el.remove();
    });
  }
  
  // 持续生成弹幕
  function startDanmaku() {
    // 初始生成几条
    for (let i = 0; i < Math.min(3, comments.length); i++) {
      setTimeout(() => createDanmaku(), i * 800);
    }
    
    // 持续生成
    setInterval(() => {
      if (activeComments.size < Math.min(5, comments.length)) {
        createDanmaku();
      }
    }, 2000);
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
      
      // 立即显示新弹幕
      comments.push(content);
      createDanmaku();
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