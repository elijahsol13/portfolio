# Портфолио Ильи

Статический сайт-портфолио с двумя кейсами: Homeasy и сайт с CRM для автосервиса. В `dist/` находятся готовые HTML/CSS/JS страницы, локальные изображения и два автономных демонстрационных интерфейса с вымышленными данными. Сайт не требует сервера, сборки и внешних API.

## Cloudflare Pages — Git integration

Подключить этот отдельный репозиторий через **Workers & Pages → Create application → Pages → Connect to Git**.

- GitHub repository: `elijahsol13/portfolio`.
- Production branch: `main`.
- Framework preset: `None`.
- Build command: оставить пустой.
- Build output directory: `dist`.
- Root directory: корень репозитория.

После успешной первой публикации в настройках Pages добавить Custom domain `portfolio.rustycat.cc` и проверить HTTPS. Ссылки на обе опубликованные showcase-витрины уже добавлены в страницы кейсов.

Этот репозиторий содержит исключительно статические публичные файлы. Локальная конфигурация `.openai/` игнорируется Git и не включается в сайт.
