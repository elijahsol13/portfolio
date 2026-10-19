/** Standalone deterministic educational demonstration. No network requests. */
(() => {
  const sample = [
    { id: 'DEMO-001', source: 'Facebook', text: 'For rent: 2BR apartment in Toul Kork, Phnom Penh. $650/month, two bathrooms. Photos available.' },
    { id: 'DEMO-002', source: 'Khmer24', text: 'Phnom Penh / Toul Kork. Apartment with 2 beds / 2 baths. Monthly rent 650 USD. Ready to move in.' },
    { id: 'DEMO-003', source: 'Facebook', text: 'Siem Reap central area: 1BR apartment for $330/month. One bathroom. Long-term rental.' },
  ];
  const run = document.getElementById('run');
  const reset = document.getElementById('reset');
  const resultContent = document.getElementById('result-content');
  const cards = document.getElementById('cards');
  const counter = document.getElementById('counter');
  const city = document.getElementById('city');
  let unique = [];

  function normalize(record) {
    const t = record.text.toLowerCase();
    const bedrooms = /\b2br\b|\b2 beds\b|\b2 bedrooms\b/.test(t) ? 2 : (/\b1br\b|\b1 bed\b/.test(t) ? 1 : null);
    const price = t.match(/\$\s*(\d+)|\b(\d+)\s*usd\b/);
    const location = t.includes('toul kork') ? 'Toul Kork' : t.includes('central area') ? 'Центр' : 'Не указан';
    return {
      id: record.id, source: record.source,
      city: t.includes('phnom penh') ? 'Phnom Penh' : t.includes('siem reap') ? 'Siem Reap' : 'Не указан',
      district: location, bedrooms, usdPerMonth: price ? Number(price[1] || price[2]) : null,
      kind: t.includes('apartment') ? 'Квартира' : 'Не указан',
    };
  }
  const key = x => [x.city, x.district, x.bedrooms, x.usdPerMonth, x.kind].join('|');
  const escapeHtml = x => String(x).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  function showListings() {
    const filtered = unique.filter(x => city.value === 'all' || x.city === city.value);
    cards.innerHTML = filtered.length ? filtered.map(x => `<article class="listing"><div class="listing-head"><span>ВЫМЫШЛЕННЫЙ ОБЪЕКТ</span><b>$${x.usdPerMonth}</b></div><div class="listing-body"><h3>${escapeHtml(x.kind)} · ${x.bedrooms} спальн.</h3><p>${escapeHtml(x.city)} · ${escapeHtml(x.district)} · аренда / месяц</p><p class="origin">Источники: ${x.sources.map(escapeHtml).join(' + ')}</p></div></article>`).join('') : '<p class="placeholder">В выбранном городе нет объектов в этом демонстрационном наборе.</p>';
  }
  function process() {
    const normalized = sample.map(normalize);
    const seen = new Map();
    for (const record of normalized) {
      const fingerprint = key(record);
      if (seen.has(fingerprint)) seen.get(fingerprint).sources.push(record.source);
      else seen.set(fingerprint, { ...record, sources: [record.source] });
    }
    unique = [...seen.values()];
    const countDuplicates = normalized.length - unique.length;
    resultContent.innerHTML = `<div class="normalized">${normalized.map(x => `<div class="norm"><span class="name">${escapeHtml(x.id)} · ${escapeHtml(x.source)}</span><pre>${escapeHtml(JSON.stringify({city:x.city,district:x.district,bedrooms:x.bedrooms,usdPerMonth:x.usdPerMonth,kind:x.kind},null,2))}</pre></div>`).join('')}</div><div class="dedup"><strong>Обнаружен ${countDuplicates} повтор</strong>Объявления DEMO-001 и DEMO-002 совпадают по городу, району, спальням, цене и типу жилья. Из ${normalized.length} публикаций сформированы ${unique.length} карточки.</div>`;
    counter.textContent = `${normalized.length} исходных → ${unique.length} объекта`;
    city.disabled = false;
    run.disabled = true;
    showListings();
  }
  function clear() {
    unique = [];
    city.value = 'all';
    city.disabled = true;
    run.disabled = false;
    counter.textContent = 'Ожидает запуска';
    resultContent.innerHTML = '<p class="placeholder">Нажмите «Обработать объявления», чтобы увидеть структурированные поля, найденный дубль и итоговые карточки.</p>';
    cards.innerHTML = '<p class="placeholder">Карточки появятся после обработки.</p>';
  }
  run.addEventListener('click', process);
  reset.addEventListener('click', clear);
  city.addEventListener('change', showListings);
})();
