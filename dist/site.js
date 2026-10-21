'use strict';

// The screenshot gallery only reads approved local demo assets.
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const preview = lightbox.querySelector('img');
  const close = lightbox.querySelector('.lightbox-close');
  let trigger = null;

  document.querySelectorAll('[data-full]').forEach((button) => {
    button.addEventListener('click', () => {
      trigger = button;
      const src = button.getAttribute('data-full');
      if (!/^(?:\.\.\/)?assets\/(?:homeasy-0[1-3]-(?:feed|filters|detail)\.svg|crm-demo-0[1-3]-(?:board|order|calendar)\.png)$/.test(src)) return;
      preview.src = src;
      preview.alt = button.getAttribute('data-alt') || 'Demo screenshot';
      lightbox.showModal();
      close.focus();
    });
  });

  function dismiss() {
    lightbox.close();
    trigger?.focus();
  }

  close.addEventListener('click', dismiss);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) dismiss();
  });
  lightbox.addEventListener('close', () => trigger?.focus());
}

// Interactive architecture maps. The diagram describes logical project boundaries,
// and intentionally omits private infrastructure details.
const architectureRoot = document.querySelector('[data-architecture]');
if (architectureRoot) {
  const language = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ru';
  const copy = {
    ru: {
      labels: { autoservice: 'СИСТЕМА ЗАКАЗОВ', homeasy: 'ОБРАБОТКА HOMEASY' },
      components: {
        website: { title: 'Публичный сайт', description: 'Посетитель заполняет форму, а сайт передаёт заявку в систему.', input: 'Действие посетителя', output: 'Структурированная заявка' },
        'orders-api': { title: 'Система заказов', description: 'Проверяет входящие данные, применяет бизнес-правила и связывает заказ с рабочими процессами команды.', input: 'Заявка с сайта', output: 'Заказ, изменения статуса и события' },
        'orders-db': { title: 'База данных заказов', description: 'Хранит заказы и связанные с ними данные, чтобы команда могла продолжить работу и посмотреть историю.', input: 'Проверенные изменения', output: 'Сохранённые записи и история' },
        'team-workspace': { title: 'Рабочий интерфейс', description: 'Директор, менеджер и механик работают с заказами в рамках своих ролей и прав доступа.', input: 'Заказы и назначенные роли', output: 'Обновлённые статусы и расписание' },
        'telegram-alert': { title: 'Уведомления Telegram', description: 'Событие по заявке может сформировать уведомление для команды, чтобы важный шаг не потерялся.', input: 'Событие по заказу', output: 'Сообщение для команды' },
        'listing-sources': { title: 'Источники объявлений', description: 'Входной слой, где появляются публикации о доступной недвижимости.', input: 'Публикации из источников', output: 'Исходные данные объявлений' },
        collector: { title: 'Сбор данных', description: 'Получает текст и характеристики публикаций для дальнейшей обработки.', input: 'Исходная публикация', output: 'Черновая запись объявления' },
        normalizer: { title: 'Обработка и поиск повторов', description: 'Приводит данные к единому формату и помогает находить разные публикации об одном объекте.', input: 'Несогласованные поля и текст', output: 'Запись в едином формате и результат проверки на повтор' },
        'homeasy-db': { title: 'Хранилище SQLite', description: 'Сохраняет структурированные объекты, с которыми работает прототип.', input: 'Нормализованные объявления', output: 'Сохранённые записи для чтения' },
        'homeasy-api': { title: 'Серверная часть и API', description: 'Предоставляет интерфейсам единый доступ к данным и функциям поиска.', input: 'Запрос интерфейса', output: 'Подходящие объявления' },
        'homeasy-client': { title: 'Бот и мини-приложение', description: 'Позволяет искать и просматривать объявления в Telegram.', input: 'Запрос и фильтры пользователя', output: 'Подходящие объявления и карточки' },
      },
    },
    en: {
      labels: { autoservice: 'BUSINESS SYSTEM', homeasy: 'HOMEASY PIPELINE' },
      components: {
        website: { title: 'Public website', description: 'A visitor submits a form and the website passes the enquiry into the system.', input: 'Visitor action', output: 'Structured enquiry' },
        'orders-api': { title: 'Order system', description: 'Validates incoming data, applies business rules and connects each job to the team workflow.', input: 'Website enquiry', output: 'Job, status changes and events' },
        'orders-db': { title: 'Order database', description: 'Stores jobs and related data so the team can continue work and review history.', input: 'Validated changes', output: 'Persisted records and history' },
        'team-workspace': { title: 'Team workspace', description: 'Director, manager and mechanic work with jobs according to their roles and access permissions.', input: 'Jobs and assigned roles', output: 'Updated statuses and schedule' },
        'telegram-alert': { title: 'Telegram notifications', description: 'An order event can prepare a notification for the team so an important step is not missed.', input: 'Order event', output: 'Team notification' },
        'listing-sources': { title: 'Listing sources', description: 'The input layer where rental property posts become available.', input: 'Published listings', output: 'Raw listing data' },
        collector: { title: 'Data collection', description: 'Collects available text and fields from posts for further processing.', input: 'Source post', output: 'Raw listing record' },
        normalizer: { title: 'Normalization and deduplication', description: 'Converts fields to a consistent format and helps identify posts about the same property.', input: 'Inconsistent fields and text', output: 'Normalized record and duplicate result' },
        'homeasy-db': { title: 'SQLite storage', description: 'Stores structured listing records used by the prototype.', input: 'Normalized listings', output: 'Persisted records for retrieval' },
        'homeasy-api': { title: 'Backend and API', description: 'Gives client interfaces consistent access to data and search operations.', input: 'Interface query', output: 'Matching listings' },
        'homeasy-client': { title: 'Bot and Mini App', description: 'Lets users search and browse listings through a Telegram interface.', input: 'User search and filters', output: 'Matching results and listing cards' },
      },
    },
  }[language];

  const projectButtons = [...architectureRoot.querySelectorAll('[data-arch-project]')];
  const flows = [...architectureRoot.querySelectorAll('[data-arch-flow]')];
  const label = architectureRoot.querySelector('[data-arch-label]');
  const inspector = {
    title: architectureRoot.querySelector('[data-arch-title]'),
    description: architectureRoot.querySelector('[data-arch-description]'),
    input: architectureRoot.querySelector('[data-arch-input]'),
    output: architectureRoot.querySelector('[data-arch-output]'),
  };
  const defaults = { autoservice: 'website', homeasy: 'normalizer' };
  let activeProject = 'autoservice';

  function selectComponent(id) {
    const component = copy.components[id];
    if (!component) return;
    const activeFlow = flows.find((flow) => flow.dataset.archFlow === activeProject);
    activeFlow?.querySelectorAll('[data-arch-node]').forEach((node) => {
      const selected = node.dataset.archNode === id;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-pressed', String(selected));
    });
    inspector.title.textContent = component.title;
    inspector.description.textContent = component.description;
    inspector.input.textContent = component.input;
    inspector.output.textContent = component.output;
  }

  function selectProject(project) {
    if (!copy.labels[project]) return;
    activeProject = project;
    projectButtons.forEach((button) => {
      const selected = button.dataset.archProject === project;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    flows.forEach((flow) => { flow.hidden = flow.dataset.archFlow !== project; });
    label.textContent = copy.labels[project];
    selectComponent(defaults[project]);
  }

  projectButtons.forEach((button) => button.addEventListener('click', () => selectProject(button.dataset.archProject)));
  architectureRoot.querySelectorAll('[data-arch-node]').forEach((node) => {
    node.addEventListener('click', () => {
      if (node.closest('[data-arch-flow]')?.dataset.archFlow === activeProject) selectComponent(node.dataset.archNode);
    });
  });
  selectProject(activeProject);
}

// A deterministic, fictional-data simulation. It never calls a real API,
// n8n instance, database or Telegram bot.
const automationRoot = document.querySelector('[data-automation-demo]');
if (automationRoot) {
  const language = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ru';
  const copy = {
    ru: {
      waiting: 'Ожидает', running: 'Выполняется', done: 'Готово', matchFound: 'Совпадение найдено', skipped: 'Пропущено', prepared: 'Подготовлено · не отправлено',
      readyStatus: 'ОЖИДАНИЕ', runningStatus: 'ВЫПОЛНЯЕТСЯ', completeStatus: 'ЗАВЕРШЕНО', duplicateStatus: 'ПОВТОР',
      readyTitle: 'Готов к запуску', readyDescription: 'Все записи вымышлены. Запустите пример, чтобы увидеть последовательность действий в локальной симуляции.',
      runningTitle: 'Выполняется этап', completeTitle: 'Сценарий завершён', newComplete: 'Заявка прошла проверку и подготовлена к созданию записи. Уведомление показано только для примера.',
      duplicateComplete: 'Найдена существующая запись, поэтому повтор пропущен. Подготовлено демонстрационное уведомление, но сообщение не отправлено.',
      stages: [
        { title: 'Получить заявку', description: 'Принимаем вымышленную заявку через форму или вебхук.', state: 'Получено' },
        { title: 'Привести данные к формату', description: 'Убираем лишние пробелы и приводим номер телефона к единому формату.', state: 'Данные обработаны' },
        { title: 'Проверить на повторы', description: 'Сравниваем обработанные данные с записями в демонстрационном хранилище.', state: 'Проверено' },
        { title: 'Обратиться к API', description: 'В локальном сценарии создаём запись или пропускаем найденный повтор.', state: 'Готово' },
        { title: 'Подготовить уведомление', description: 'Формируем пример сообщения для Telegram, но не отправляем его.', state: 'Подготовлено' },
      ],
      sampleNew: {
        received: { name: 'Алексей Орлов', phone: ' +855 12 345 678 ', request: 'Квартира до $450', source: 'portfolio-demo' },
        normalized: { name: 'Алексей Орлов', phone: '+85512345678', request: 'Квартира до $450' },
        duplicate: { found: false, match: null }, api: { action: 'create_demo_record', result: 'created', record_id: 'DEMO-1042' },
        telegram: { action: 'prepare_notification', sent: false, preview: 'Новая заявка DEMO-1042 — Алексей Орлов' },
      },
      sampleDuplicate: {
        received: { name: 'Алексей Орлов', phone: '+855 (12) 345-678', request: 'Квартира до $450', source: 'portfolio-demo' },
        normalized: { name: 'Алексей Орлов', phone: '+85512345678', request: 'Квартира до $450' },
        duplicate: { found: true, match: 'DEMO-1042' }, api: { action: 'skip_duplicate', result: 'skipped', matched_record_id: 'DEMO-1042' },
        telegram: { action: 'prepare_duplicate_note', sent: false, preview: 'Повторная заявка пропущена: DEMO-1042' },
      },
      outputIdle: { status: 'idle', external_requests: false, data: 'fictional' },
      run: 'Запустить сценарий',
    },
    en: {
      waiting: 'Waiting', running: 'Running', done: 'Complete', matchFound: 'Match found', skipped: 'Skipped', prepared: 'Prepared · not sent',
      readyStatus: 'READY / WAITING', runningStatus: 'RUNNING / PROCESSING', completeStatus: 'COMPLETE / DONE', duplicateStatus: 'DUPLICATE / SKIPPED',
      readyTitle: 'Ready to run', readyDescription: 'All records are fictional. Run the demo to see a local simulation of the sequence.',
      runningTitle: 'Processing step', completeTitle: 'Scenario complete', newComplete: 'The enquiry passed validation and is ready for record creation. The notification is shown as a preview only.',
      duplicateComplete: 'An existing record was found, so the duplicate was skipped. A demo note was prepared without sending a message.',
      stages: [
        { title: 'Receive enquiry', description: 'Accept a fictional enquiry through a form or webhook.', state: 'Received' },
        { title: 'Normalize data', description: 'Trim whitespace and convert the phone number to a consistent format.', state: 'Normalized' },
        { title: 'Check duplicates', description: 'Compare the normalized key with the demo data store.', state: 'Checked' },
        { title: 'Call the API', description: 'Create a record in the local scenario or skip a detected duplicate.', state: 'Complete' },
        { title: 'Prepare Telegram', description: 'Build a notification preview without sending it.', state: 'prepared' },
      ],
      sampleNew: {
        received: { name: 'Alex Orlov', phone: ' +855 12 345 678 ', request: 'Apartment under $450', source: 'portfolio-demo' },
        normalized: { name: 'Alex Orlov', phone: '+85512345678', request: 'Apartment under $450' },
        duplicate: { found: false, match: null }, api: { action: 'create_demo_record', result: 'created', record_id: 'DEMO-1042' },
        telegram: { action: 'prepare_notification', sent: false, preview: 'New enquiry DEMO-1042 — Alex Orlov' },
      },
      sampleDuplicate: {
        received: { name: 'Alex Orlov', phone: '+855 (12) 345-678', request: 'Apartment under $450', source: 'portfolio-demo' },
        normalized: { name: 'Alex Orlov', phone: '+85512345678', request: 'Apartment under $450' },
        duplicate: { found: true, match: 'DEMO-1042' }, api: { action: 'skip_duplicate', result: 'skipped', matched_record_id: 'DEMO-1042' },
        telegram: { action: 'prepare_duplicate_note', sent: false, preview: 'Duplicate enquiry skipped: DEMO-1042' },
      },
      outputIdle: { status: 'idle', external_requests: false, data: 'fictional' },
      run: 'Run demo',
    },
  }[language];

  const runButton = automationRoot.querySelector('[data-automation-run]');
  const resetButton = automationRoot.querySelector('[data-automation-reset]');
  const scenarioButtons = [...automationRoot.querySelectorAll('[data-automation-scenario]')];
  const steps = [...automationRoot.querySelectorAll('[data-automation-step]')];
  const status = automationRoot.querySelector('[data-automation-status]');
  const title = automationRoot.querySelector('[data-automation-title]');
  const description = automationRoot.querySelector('[data-automation-description]');
  const output = automationRoot.querySelector('[data-automation-output]');
  let selectedScenario = 'new';
  let runToken = 0;
  let timers = new Map();

  function clearTimers() {
    timers.forEach((resolve, timer) => {
      window.clearTimeout(timer);
      resolve(false);
    });
    timers.clear();
  }

  function stopRun() {
    runToken += 1;
    clearTimers();
    runButton.disabled = false;
    automationRoot.dataset.state = 'idle';
  }

  function resetDisplay() {
    steps.forEach((step) => {
      step.classList.remove('is-running', 'is-complete');
      step.querySelector('.automation-step-state').textContent = copy.waiting;
    });
    status.textContent = copy.readyStatus;
    title.textContent = copy.readyTitle;
    description.textContent = copy.readyDescription;
    output.textContent = JSON.stringify(copy.outputIdle, null, 2);
  }

  function setScenario(scenario) {
    if (scenario !== 'new' && scenario !== 'duplicate') return;
    stopRun();
    selectedScenario = scenario;
    scenarioButtons.forEach((button) => {
      const selected = button.dataset.automationScenario === scenario;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    resetDisplay();
  }

  function snapshotFor(scenario, index) {
    const sample = scenario === 'duplicate' ? copy.sampleDuplicate : copy.sampleNew;
    const payload = { status: 'processing', scenario, external_requests: false, fictional_data: true };
    if (index >= 0) payload.received = sample.received;
    if (index >= 1) payload.normalized = sample.normalized;
    if (index >= 2) payload.duplicate_check = sample.duplicate;
    if (index >= 3) payload.api = sample.api;
    if (index >= 4) payload.telegram = sample.telegram;
    if (index >= 4) payload.status = scenario === 'duplicate' ? 'duplicate_skipped' : 'ready_for_creation';
    return payload;
  }

  function stageState(index, scenario) {
    if (index === 2 && scenario === 'duplicate') return copy.matchFound;
    if (index === 3 && scenario === 'duplicate') return copy.skipped;
    if (index === 4) return copy.prepared;
    return copy.stages[index].state;
  }

  function delay(ms, token) {
    return new Promise((resolve) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        resolve(token === runToken);
      }, ms);
      timers.set(timer, resolve);
    });
  }

  async function runScenario() {
    if (automationRoot.dataset.state === 'running') return;
    clearTimers();
    const token = ++runToken;
    const scenario = selectedScenario;
    automationRoot.dataset.state = 'running';
    runButton.disabled = true;
    status.textContent = copy.runningStatus;
    steps.forEach((step) => {
      step.classList.remove('is-running', 'is-complete');
      step.querySelector('.automation-step-state').textContent = copy.waiting;
    });

    for (let index = 0; index < steps.length; index += 1) {
      if (token !== runToken) return;
      const step = steps[index];
      step.classList.add('is-running');
      step.querySelector('.automation-step-state').textContent = copy.running;
      title.textContent = copy.runningTitle;
      description.textContent = copy.stages[index].description;
      output.textContent = JSON.stringify(snapshotFor(scenario, index), null, 2);
      if (!await delay(560, token) || token !== runToken) return;
      step.classList.remove('is-running');
      step.classList.add('is-complete');
      step.querySelector('.automation-step-state').textContent = stageState(index, scenario);
    }

    if (token !== runToken) return;
    automationRoot.dataset.state = scenario === 'duplicate' ? 'duplicate' : 'complete';
    runButton.disabled = false;
    status.textContent = scenario === 'duplicate' ? copy.duplicateStatus : copy.completeStatus;
    title.textContent = copy.completeTitle;
    description.textContent = scenario === 'duplicate' ? copy.duplicateComplete : copy.newComplete;
    output.textContent = JSON.stringify({ ...snapshotFor(scenario, steps.length - 1), status: scenario === 'duplicate' ? 'duplicate_skipped' : 'complete' }, null, 2);
  }

  scenarioButtons.forEach((button) => button.addEventListener('click', () => setScenario(button.dataset.automationScenario)));
  runButton.addEventListener('click', runScenario);
  resetButton.addEventListener('click', () => {
    stopRun();
    resetDisplay();
  });
  setScenario(selectedScenario);
}
