// =============================================
// Nordic Air CMS — Admin Panel Logic
// =============================================
// Uses Supabase JS SDK v2 loaded from CDN
// All UI strings are in Russian
// =============================================

'use strict';

// ---- Content Schema ----
const SECTIONS = [
  {
    id: 'contacts',
    title: 'Контакты',
    subtitle: 'Телефоны, адрес, часы работы — обновляются на всех страницах сайта',
    fields: [
      { key: 'global.phone',      label: 'Телефон (отображение)',          type: 'text',     placeholder: '+7 (931) 634-00-87' },
      { key: 'global.phone_href', label: 'Телефон href (ссылка)',           type: 'text',     placeholder: 'tel:+79316340087' },
      { key: 'global.hours',      label: 'Часы работы (коротко)',           type: 'text',     placeholder: 'Пн–Вс: 9:00–21:00' },
      { key: 'global.hours_full', label: 'Часы работы (полные)',            type: 'text',     placeholder: 'Понедельник–Воскресенье: 9:00–21:00' },
      { key: 'global.address',    label: 'Адрес',                          type: 'text',     placeholder: 'Ропшинская ул., 1/32, Санкт-Петербург' },
      { key: 'global.email',      label: 'Email',                          type: 'text',     placeholder: 'ahdpuxe@mail.ru' },
    ]
  },
  {
    id: 'main',
    title: 'Главная',
    subtitle: 'Тексты главной страницы: уведомление, герой-блок и призыв к действию',
    fields: [
      { key: 'index.notice',       label: 'Строка-уведомление (шапка)',      type: 'text',     placeholder: 'Сезон начался! Цены растут каждые 3 дня — зафиксируйте свою цену прямо сейчас' },
      { key: 'index.hero.title',   label: 'Hero — заголовок (h1)',           type: 'textarea', placeholder: 'Климатический комфорт под ключ' },
      { key: 'index.hero.subtitle',label: 'Hero — подзаголовок',             type: 'textarea', placeholder: 'Продажа, монтаж и обслуживание кондиционеров...' },
      { key: 'index.hero.btn1',    label: 'Hero — кнопка «Рассчитать»',     type: 'text',     placeholder: 'Получить расчёт бесплатно' },
      { key: 'index.hero.btn2',    label: 'Hero — кнопка «Посмотреть»',     type: 'text',     placeholder: 'Наши работы' },
      { key: 'index.cta.title',    label: 'CTA-блок — заголовок',           type: 'text',     placeholder: 'Не откладывайте — акции ограничены' },
      { key: 'index.cta.desc',     label: 'CTA-блок — описание',            type: 'textarea', placeholder: 'Позвоните прямо сейчас и узнайте актуальную цену...' },
    ]
  },
  {
    id: 'promotions',
    title: 'Акции',
    subtitle: 'Управление акционными карточками: тексты, цены, сроки, изображения',
    promoGroups: [1, 2, 3, 4],
    fields: [
      { key: 'promo.1.badge',     label: 'Бейдж',           type: 'text',     placeholder: 'Хит сезона',             group: 1 },
      { key: 'promo.1.title',     label: 'Название акции',  type: 'text',     placeholder: 'Кондиционер под ключ',   group: 1 },
      { key: 'promo.1.desc',      label: 'Описание',        type: 'textarea', placeholder: 'Кондиционер Ballu...',   group: 1 },
      { key: 'promo.1.old_price', label: 'Старая цена',     type: 'text',     placeholder: 'от 22 500 ₽',            group: 1 },
      { key: 'promo.1.new_price', label: 'Новая цена',      type: 'text',     placeholder: 'от 18 000 ₽',            group: 1 },
      { key: 'promo.1.deadline',  label: 'Срок (ISO дата)', type: 'text',     placeholder: '2026-09-01T00:00:00',    group: 1, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс, например 2026-09-01T00:00:00' },
      { key: 'promo.1.image',     label: 'Изображение акции',type: 'image',   bucket: 'cms-images',                  group: 1 },

      { key: 'promo.2.badge',     label: 'Бейдж',           type: 'text',     placeholder: 'Рекомендуем',            group: 2 },
      { key: 'promo.2.title',     label: 'Название акции',  type: 'text',     placeholder: 'Мульти-сплит для квартиры', group: 2 },
      { key: 'promo.2.desc',      label: 'Описание',        type: 'textarea', placeholder: 'Одна внешняя...',        group: 2 },
      { key: 'promo.2.old_price', label: 'Старая цена',     type: 'text',     placeholder: 'от 58 000 ₽',            group: 2 },
      { key: 'promo.2.new_price', label: 'Новая цена',      type: 'text',     placeholder: 'от 49 000 ₽',            group: 2 },
      { key: 'promo.2.deadline',  label: 'Срок (ISO дата)', type: 'text',     placeholder: '2026-08-15T00:00:00',    group: 2, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс, например 2026-08-15T00:00:00' },
      { key: 'promo.2.image',     label: 'Изображение акции',type: 'image',   bucket: 'cms-images',                  group: 2 },

      { key: 'promo.3.badge',     label: 'Бейдж',           type: 'text',     placeholder: 'Сезонная',               group: 3 },
      { key: 'promo.3.title',     label: 'Название акции',  type: 'text',     placeholder: 'ТО кондиционера',        group: 3 },
      { key: 'promo.3.desc',      label: 'Описание',        type: 'textarea', placeholder: 'Полный сервис...',       group: 3 },
      { key: 'promo.3.old_price', label: 'Старая цена',     type: 'text',     placeholder: 'от 3 300 ₽',             group: 3 },
      { key: 'promo.3.new_price', label: 'Новая цена',      type: 'text',     placeholder: 'от 3 000 ₽',             group: 3 },
      { key: 'promo.3.deadline',  label: 'Срок (ISO дата)', type: 'text',     placeholder: '2026-10-01T00:00:00',    group: 3, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.3.image',     label: 'Изображение акции',type: 'image',   bucket: 'cms-images',                  group: 3 },

      { key: 'promo.4.badge',     label: 'Бейдж',           type: 'text',     placeholder: 'Комплекс',               group: 4 },
      { key: 'promo.4.title',     label: 'Название акции',  type: 'text',     placeholder: 'Вентиляция + кондиционер', group: 4 },
      { key: 'promo.4.desc',      label: 'Описание',        type: 'textarea', placeholder: 'Комплексный заказ...',   group: 4 },
      { key: 'promo.4.old_price', label: 'Старая цена',     type: 'text',     placeholder: 'от 79 000 ₽',            group: 4 },
      { key: 'promo.4.new_price', label: 'Новая цена',      type: 'text',     placeholder: 'от 69 500 ₽',            group: 4 },
      { key: 'promo.4.deadline',  label: 'Срок (ISO дата)', type: 'text',     placeholder: '2026-09-15T00:00:00',    group: 4, hint: 'Формат: ГГГГ-ММ-ДДTчч:мм:сс' },
      { key: 'promo.4.image',     label: 'Изображение акции',type: 'image',   bucket: 'cms-images',                  group: 4 },
    ]
  },
  {
    id: 'services',
    title: 'Услуги',
    subtitle: 'Заголовки и подзаголовки страниц услуг: кондиционеры, тепловые насосы, вентиляция',
    fields: [
      { key: 'services.ac.hero_title',   label: 'Кондиционеры — заголовок страницы',     type: 'text',     placeholder: 'Кондиционеры в Санкт-Петербурге' },
      { key: 'services.ac.hero_sub',     label: 'Кондиционеры — подзаголовок',           type: 'textarea', placeholder: 'Продажа, монтаж и обслуживание...' },
      { key: 'services.heat.hero_title', label: 'Тепловые насосы — заголовок страницы',  type: 'text',     placeholder: 'Тёплый дом — даже если нет газа' },
      { key: 'services.heat.hero_sub',   label: 'Тепловые насосы — подзаголовок',        type: 'textarea', placeholder: 'Тепловые насосы воздух-воздух...' },
      { key: 'services.vent.hero_title', label: 'Вентиляция — заголовок страницы',       type: 'text',     placeholder: 'Вентиляция под ключ в Санкт-Петербурге' },
      { key: 'services.vent.hero_sub',   label: 'Вентиляция — подзаголовок',             type: 'textarea', placeholder: 'Проектирование и монтаж...' },
    ]
  },
  {
    id: 'about',
    title: 'О компании',
    subtitle: 'Информация о компании, данные руководителя и его фото',
    fields: [
      { key: 'about.hero.title',      label: 'О компании — заголовок страницы',  type: 'text',     placeholder: 'О компании Nordic Air' },
      { key: 'about.hero.subtitle',   label: 'О компании — подзаголовок',        type: 'textarea', placeholder: 'С 2011 года устанавливаем климатические системы...' },
      { key: 'about.founder.name',    label: 'Имя руководителя',                 type: 'text',     placeholder: 'Андрей Утищев' },
      { key: 'about.founder.position',label: 'Должность руководителя',           type: 'text',     placeholder: 'Основатель и руководитель' },
      { key: 'about.founder.bio',     label: 'О руководителе (текст)',           type: 'textarea', placeholder: '"У нас нет менеджеров..."' },
      { key: 'about.founder.photo',   label: 'Фото руководителя',               type: 'image',    bucket: 'cms-images' },
    ]
  },
];

// ---- Tab metadata ----
const TAB_META = {
  contacts:   { title: 'Контакты',   subtitle: 'Редактирование контактной информации сайта' },
  main:       { title: 'Главная',    subtitle: 'Тексты главной страницы' },
  promotions: { title: 'Акции',      subtitle: 'Управление акционными карточками' },
  services:   { title: 'Услуги',     subtitle: 'Заголовки страниц услуг' },
  about:      { title: 'О компании', subtitle: 'Информация о компании и руководителе' },
};

// ---- State ----
let supabase = null;
let currentUser = null;
let contentCache = {}; // key → value (strings from DB)
let activeTab = 'contacts';

// ---- Init ----
document.addEventListener('DOMContentLoaded', function () {
  initSupabase();
});

function initSupabase() {
  if (!window.CMS_CONFIG ||
      window.CMS_CONFIG.supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL') {
    showConfigError();
    return;
  }

  try {
    supabase = window.supabase.createClient(
      window.CMS_CONFIG.supabaseUrl,
      window.CMS_CONFIG.supabaseKey
    );
  } catch (e) {
    showConfigError();
    return;
  }

  checkSession();
}

function showConfigError() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-error').textContent =
    'Ошибка: заполните js/cms-config.js — укажите supabaseUrl и supabaseKey.';
  document.getElementById('login-error').classList.add('visible');
  document.getElementById('login-btn').disabled = true;
}

async function checkSession() {
  showLoading(true);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      await enterApp();
    } else {
      showLoginScreen();
    }
  } catch (e) {
    showLoginScreen();
  } finally {
    showLoading(false);
  }
}

// ---- Login ----
async function handleLogin() {
  var email = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value;
  var btn = document.getElementById('login-btn');
  var errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = 'Введите email и пароль.';
    errorEl.classList.add('visible');
    return;
  }

  if (!supabase) {
    errorEl.textContent = 'Ошибка подключения к базе данных. Обновите страницу.';
    errorEl.classList.add('visible');
    return;
  }

  errorEl.classList.remove('visible');
  btn.disabled = true;
  btn.textContent = 'Вхожу...';

  try {
    var result = await supabase.auth.signInWithPassword({ email: email, password: password });

    if (result.error) {
      errorEl.textContent = 'Неверный email или пароль. Попробуйте снова.';
      errorEl.classList.add('visible');
      btn.disabled = false;
      btn.textContent = 'Войти в панель управления';
      return;
    }

    currentUser = result.data.user;
    await enterApp();

  } catch (err) {
    errorEl.textContent = 'Ошибка: ' + (err.message || 'проверьте интернет-соединение');
    errorEl.classList.add('visible');
    btn.disabled = false;
    btn.textContent = 'Войти в панель управления';
  }
}

// Also handle Enter key in password field
document.addEventListener('DOMContentLoaded', function() {
  var pwField = document.getElementById('login-password');
  if (pwField) {
    pwField.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLogin();
    });
  }
});

// ---- App Entry ----
async function enterApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');

  // Show user email in sidebar
  if (currentUser && currentUser.email) {
    document.getElementById('sidebar-email').textContent = currentUser.email;
  }

  // Load all content from DB
  showLoading(true);
  await loadAllContent();
  showLoading(false);

  // Render default tab
  renderTab(activeTab);
}

// ---- Logout ----
async function logout() {
  showLoading(true);
  try {
    await supabase.auth.signOut();
  } catch (e) {}
  currentUser = null;
  contentCache = {};
  document.getElementById('app').classList.remove('visible');
  showLoginScreen();
  showLoading(false);
}

function showLoginScreen() {
  document.getElementById('login-screen').style.display = 'flex';
  const btn = document.getElementById('login-btn');
  btn.disabled = false;
  btn.textContent = 'Войти в панель управления';
}

// ---- Load Content ----
async function loadAllContent() {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('key, value, type');

    if (error) {
      console.warn('[CMS Admin] Failed to load content:', error.message);
      return;
    }

    contentCache = {};
    (data || []).forEach(function (row) {
      contentCache[row.key] = row.value || '';
    });

  } catch (e) {
    console.warn('[CMS Admin] Network error loading content:', e);
  }
}

// ---- Tab Switching ----
function switchTab(tabId) {
  activeTab = tabId;

  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    link.classList.toggle('active', link.dataset.tab === tabId);
  });

  // Update topbar
  const meta = TAB_META[tabId];
  if (meta) {
    document.getElementById('topbar-title').textContent = meta.title;
    document.getElementById('topbar-subtitle').textContent = meta.subtitle;
  }

  renderTab(tabId);
}

// ---- Render Tab ----
function renderTab(tabId) {
  const section = SECTIONS.find(function (s) { return s.id === tabId; });
  if (!section) return;

  const contentArea = document.getElementById('content-area');

  if (tabId === 'promotions') {
    contentArea.innerHTML = renderPromotionsTab(section);
  } else {
    contentArea.innerHTML = renderStandardTab(section);
  }
}

// ---- Standard Tab Renderer ----
function renderStandardTab(section) {
  const fieldsHTML = section.fields.map(function (field) {
    return renderField(field);
  }).join('');

  return `
    <div class="section-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">${escHtml(section.title)}</div>
          <div class="text-muted mt-4">${escHtml(section.subtitle || '')}</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="field-group single">
          ${fieldsHTML}
        </div>
      </div>
      <div class="panel-footer">
        <span class="save-status" id="save-status-${section.id}"></span>
        <button class="btn btn-save" onclick="saveSection('${section.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Сохранить раздел
        </button>
      </div>
    </div>
  `;
}

// ---- Promotions Tab Renderer ----
function renderPromotionsTab(section) {
  const groups = section.promoGroups || [1, 2, 3, 4];

  const groupsHTML = groups.map(function (num) {
    const groupFields = section.fields.filter(function (f) { return f.group === num; });
    const fieldsHTML = groupFields.map(function (field) {
      return renderField(field);
    }).join('');

    return `
      <div class="promo-section-group">
        <div class="promo-group-header">
          <div class="promo-group-number">${num}</div>
          Акция № ${num}
        </div>
        <div class="promo-group-body">
          <div class="field-group single">
            ${fieldsHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="section-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">${escHtml(section.title)}</div>
          <div class="text-muted mt-4">${escHtml(section.subtitle || '')}</div>
        </div>
      </div>
      <div class="panel-body">
        ${groupsHTML}
      </div>
      <div class="panel-footer">
        <span class="save-status" id="save-status-${section.id}"></span>
        <button class="btn btn-save" onclick="saveSection('${section.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Сохранить все акции
        </button>
      </div>
    </div>
  `;
}

// ---- Field Renderer ----
function renderField(field) {
  const currentValue = contentCache[field.key] || '';
  const inputId = 'field-' + field.key.replace(/\./g, '_');

  if (field.type === 'image') {
    return renderImageField(field, currentValue, inputId);
  }

  if (field.type === 'textarea') {
    return `
      <div class="field-item">
        <label class="form-label" for="${inputId}">${escHtml(field.label)}</label>
        <textarea
          class="form-input"
          id="${inputId}"
          data-key="${escHtml(field.key)}"
          placeholder="${escHtml(field.placeholder || '')}"
          rows="3"
        >${escHtml(currentValue)}</textarea>
        ${field.hint ? `<div class="field-hint">${escHtml(field.hint)}</div>` : ''}
      </div>
    `;
  }

  // Default: text input
  return `
    <div class="field-item">
      <label class="form-label" for="${inputId}">${escHtml(field.label)}</label>
      <input
        class="form-input"
        type="text"
        id="${inputId}"
        data-key="${escHtml(field.key)}"
        value="${escHtml(currentValue)}"
        placeholder="${escHtml(field.placeholder || '')}"
      >
      ${field.hint ? `<div class="field-hint">${escHtml(field.hint)}</div>` : ''}
    </div>
  `;
}

// ---- Image Field Renderer ----
function renderImageField(field, currentValue, inputId) {
  const hasImage = currentValue && currentValue.startsWith('http');
  const previewId = inputId + '_preview';
  const progressId = inputId + '_progress';
  const fileInputId = inputId + '_file';

  return `
    <div class="field-item">
      <label class="form-label">${escHtml(field.label)}</label>
      <div class="image-upload-wrapper">
        <div class="image-preview" id="${previewId}_wrap">
          <img
            id="${previewId}"
            src="${hasImage ? escHtml(currentValue) : ''}"
            alt="Изображение"
            class="${hasImage ? 'loaded' : ''}"
            onerror="this.classList.remove('loaded')"
            onload="this.classList.add('loaded')"
          >
          ${!hasImage ? `
            <div class="image-preview-placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>Нет изображения</span>
            </div>
          ` : ''}
        </div>

        <div class="image-upload-actions">
          <label class="btn-upload" for="${fileInputId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Загрузить фото
          </label>
          <input
            type="file"
            id="${fileInputId}"
            accept="image/*"
            style="display:none"
            data-key="${escHtml(field.key)}"
            data-bucket="${escHtml(field.bucket || 'cms-images')}"
            data-preview="${previewId}"
            data-progress="${progressId}"
            onchange="handleImageUpload(this)"
          >

          <div class="upload-progress" id="${progressId}">
            <div class="spinner"></div>
            <span>Загружаю...</span>
          </div>
        </div>

        ${hasImage ? `
          <div class="image-url-input" id="${inputId}_url">${escHtml(currentValue)}</div>
        ` : `
          <div class="image-url-input" id="${inputId}_url" style="display:none"></div>
        `}

        <!-- Hidden input to hold the URL value for saving -->
        <input
          type="hidden"
          id="${inputId}"
          data-key="${escHtml(field.key)}"
          value="${escHtml(currentValue)}"
        >
      </div>
    </div>
  `;
}

// ---- Image Upload Handler ----
async function handleImageUpload(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const key = fileInput.dataset.key;
  const bucket = fileInput.dataset.bucket || 'cms-images';
  const previewId = fileInput.dataset.preview;
  const progressId = fileInput.dataset.progress;

  // Validate file
  if (!file.type.startsWith('image/')) {
    showToast('Ошибка: выберите файл изображения (JPG, PNG, WebP)', 'error');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('Ошибка: файл слишком большой (максимум 10 МБ)', 'error');
    return;
  }

  // Show progress
  const progressEl = document.getElementById(progressId);
  if (progressEl) progressEl.classList.add('visible');

  // Disable the label visually
  fileInput.disabled = true;

  try {
    // Generate unique filename
    const ext = file.name.split('.').pop().toLowerCase();
    const filename = key.replace(/\./g, '/') + '_' + Date.now() + '.' + ext;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Ошибка загрузки файла');
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    // Update hidden input value
    const fieldInputId = 'field-' + key.replace(/\./g, '_');
    const hiddenInput = document.getElementById(fieldInputId);
    if (hiddenInput) {
      hiddenInput.value = publicUrl;
    }

    // Update preview image
    const previewImg = document.getElementById(previewId);
    if (previewImg) {
      previewImg.src = publicUrl;
      previewImg.classList.add('loaded');
      // Hide placeholder if visible
      const wrap = previewImg.parentElement;
      const placeholder = wrap ? wrap.querySelector('.image-preview-placeholder') : null;
      if (placeholder) placeholder.remove();
    }

    // Update URL display
    const urlEl = document.getElementById(fieldInputId + '_url');
    if (urlEl) {
      urlEl.textContent = publicUrl;
      urlEl.style.display = '';
    }

    // Update cache
    contentCache[key] = publicUrl;

    // Auto-save this image field to DB immediately
    await upsertField(key, publicUrl, 'image');
    showToast('Фото загружено и сохранено!', 'success');

  } catch (err) {
    showToast('Ошибка загрузки: ' + (err.message || 'неизвестная ошибка'), 'error');
  } finally {
    if (progressEl) progressEl.classList.remove('visible');
    fileInput.disabled = false;
    fileInput.value = ''; // Reset file input
  }
}

// ---- Save Section ----
async function saveSection(sectionId) {
  const section = SECTIONS.find(function (s) { return s.id === sectionId; });
  if (!section) return;

  const saveBtn = document.querySelector(`[onclick="saveSection('${sectionId}')"]`);
  const statusEl = document.getElementById('save-status-' + sectionId);

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;width:14px;height:14px;border-width:2px;"></div> Сохраняю...`;
  }
  if (statusEl) statusEl.textContent = '';

  try {
    // Collect all non-image fields from this section's inputs
    const upsertRows = [];

    section.fields.forEach(function (field) {
      if (field.type === 'image') {
        // Image is saved immediately on upload; but also collect current hidden value
        const inputId = 'field-' + field.key.replace(/\./g, '_');
        const hiddenInput = document.getElementById(inputId);
        if (hiddenInput && hiddenInput.value) {
          upsertRows.push({
            key: field.key,
            value: hiddenInput.value,
            type: 'image'
          });
        }
        return;
      }

      const inputId = 'field-' + field.key.replace(/\./g, '_');
      const el = document.getElementById(inputId);
      if (!el) return;

      const value = el.value || '';
      upsertRows.push({
        key: field.key,
        value: value,
        type: field.type === 'textarea' ? 'text' : (field.type || 'text')
      });

      // Update cache
      contentCache[field.key] = value;
    });

    if (upsertRows.length === 0) {
      showToast('Нет данных для сохранения', 'error');
      return;
    }

    // Upsert all rows in one request
    const { error } = await supabase
      .from('content')
      .upsert(upsertRows, { onConflict: 'key' });

    if (error) {
      throw new Error(error.message || 'Ошибка базы данных');
    }

    showToast('Сохранено!', 'success');
    if (statusEl) {
      statusEl.textContent = 'Сохранено ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      statusEl.style.color = 'var(--green)';
    }

  } catch (err) {
    showToast('Ошибка: ' + (err.message || 'не удалось сохранить'), 'error');
    if (statusEl) {
      statusEl.textContent = 'Ошибка сохранения';
      statusEl.style.color = 'var(--red)';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        ${sectionId === 'promotions' ? 'Сохранить все акции' : 'Сохранить раздел'}
      `;
    }
  }
}

// ---- Upsert single field (used by image upload) ----
async function upsertField(key, value, type) {
  const { error } = await supabase
    .from('content')
    .upsert([{ key, value, type: type || 'text' }], { onConflict: 'key' });

  if (error) {
    throw new Error(error.message);
  }
}

// ---- Toast ----
let toastTimer = null;

function showToast(message, type) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');

  toast.classList.remove('success', 'error', 'visible');

  msgEl.textContent = message;

  if (type === 'success') {
    toast.classList.add('success');
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else {
    toast.classList.add('error');
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  // Force reflow for animation
  void toast.offsetWidth;
  toast.classList.add('visible');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('visible');
  }, 3500);
}

// ---- Loading Overlay ----
function showLoading(visible) {
  const overlay = document.getElementById('loading-overlay');
  if (visible) {
    overlay.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
  }
}

// ---- Utility: HTML escape ----
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Change Password ----
function showChangePassword() {
  document.getElementById('new-pw').value = '';
  document.getElementById('new-pw2').value = '';
  document.getElementById('pw-error').style.display = 'none';
  var modal = document.getElementById('pw-modal');
  modal.style.display = 'flex';
}

function closePwModal() {
  document.getElementById('pw-modal').style.display = 'none';
}

async function doChangePassword() {
  var pw1 = document.getElementById('new-pw').value;
  var pw2 = document.getElementById('new-pw2').value;
  var errEl = document.getElementById('pw-error');
  var btn = document.getElementById('pw-save-btn');

  errEl.style.display = 'none';

  if (pw1.length < 6) {
    errEl.textContent = 'Пароль должен быть не менее 6 символов';
    errEl.style.display = 'block';
    return;
  }
  if (pw1 !== pw2) {
    errEl.textContent = 'Пароли не совпадают';
    errEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Сохраняю...';

  try {
    var ref = await supabase.auth.updateUser({ password: pw1 });
    if (ref.error) throw new Error(ref.error.message);
    closePwModal();
    showToast('Пароль успешно изменён!', 'success');
  } catch (e) {
    errEl.textContent = 'Ошибка: ' + (e.message || 'не удалось изменить пароль');
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Сохранить';
  }
}

// ---- Expose globals for onclick handlers ----
window.switchTab = switchTab;
window.saveSection = saveSection;
window.handleImageUpload = handleImageUpload;
window.logout = logout;
window.handleLogin = handleLogin;
window.showChangePassword = showChangePassword;
window.closePwModal = closePwModal;
window.doChangePassword = doChangePassword;
