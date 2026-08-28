import type { CourseModule } from '../types';

export const m10: CourseModule = {
  id: 'm10',
  number: 10,
  title: 'Профессиональное администрирование',
  rank: 'Профессионал',
  description:
    'Финальный рывок: управляем службами через systemd и пишем свой сервис, поднимаем веб-сервер nginx с настоящим HTTPS, работаем с дисками как профи (LVM, swap, квоты) и знакомимся с Docker. В конце — финальный проект всего курса.',
  lessons: [
    {
      id: 'm10-l01',
      title: 'Systemd: юниты, systemctl, пишем свой сервис',
      minutes: 30,
      intro:
        'Базу systemctl (start, stop, restart, status, enable) вы освоили ещё в модуле 7. Теперь заглянем под капот systemd: юнит-файлы, target’ы — и напишете собственный сервис с автозапуском и автоперезапуском.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Вы уже знакомы с systemctl из модуля 7 (start, stop, restart, status, enable/disable), а в модуле 9 встречали таймеры и `daemon-reload`. Пришло время заглянуть под капот. **systemd** — процесс номер один (PID 1), первый, кого запускает ядро при старте системы, и «директор оркестра»: он поднимает все службы, следит, чтобы они не падали, и ведёт журнал.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Представьте большой отель. systemd — управляющий: у него есть карточка на каждую службу (юнит): кем является, когда открывается, что делать, если «сотрудник» не вышел на смену (упал). А journalctl — его журнал учёта, где записано всё, что говорили службы.',
        },
        {
          type: 'heading',
          text: 'Юниты: карточки служб',
        },
        {
          type: 'paragraph',
          text: 'Всё, чем управляет systemd, описано **юнитами** — текстовыми файлами с расширением по типу. Системные лежат в `/lib/systemd/system`, а свои и переопределённые администратором — в `/etc/systemd/system`.',
        },
        {
          type: 'table',
          headers: ['Тип юнита', 'Что описывает', 'Пример'],
          rows: [
            ['.service', 'службу — долгоживущий процесс', 'ssh.service, nginx.service'],
            ['.timer', 'расписание запуска', 'apt-daily.timer'],
            ['.socket', 'сокет — «розетку» для сети или IPC', 'docker.socket'],
            ['.mount', 'точку монтирования', 'home.mount'],
            ['.target', 'группу юнитов — «этап загрузки»', 'multi-user.target'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Отдельно объясним **сокет**: это точка связи, как розетка в стене. Сетевой сокет — это «IP-адрес + порт», куда подключаются программы (ваш браузер подключается к сокету сервера на порт 443). systemd умеет слушать сокет заранее и запускать службу только когда кто-то подключился — экономия ресурсов.',
        },
        {
          type: 'heading',
          text: 'systemctl: пульт управления',
        },
        {
          type: 'code',
          title: 'К знакомым start/stop/status добавляем приёмы профессионала',
          code: `$ systemctl status ssh --no-pager
● ssh.service - OpenBSD Secure Shell server
     Active: active (running) since Fri 2025-03-14 08:12:03 UTC; 3h ago
   Main PID: 812 (sshd)
$ sudo systemctl enable --now ssh   # enable + start одной командой
$ systemctl is-enabled ssh
enabled
$ systemctl list-units --type=service --state=running --no-pager | head -5
UNIT          LOAD   ACTIVE SUB     DESCRIPTION
cron.service  loaded active running Regular background program processing daemon
ssh.service   loaded active running OpenBSD Secure Shell server
...`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: '`enable` ≠ `start`. enable — лишь создаёт ссылку в автозагрузку (сработает после перезагрузки), start — запускает прямо сейчас. Пара `enable --now` делает и то, и другое. Проверка: `is-active` и `is-enabled`.',
        },
        {
          type: 'paragraph',
          text: 'Логи любой службы — в журнале systemd (модуль 8): `journalctl -u имя.service`, а в реальном времени — `journalctl -u имя -f`. Это первое место, куда смотрят, когда служба не поднялась.',
        },
        {
          type: 'heading',
          text: 'Пишем свой сервис',
        },
        {
          type: 'paragraph',
          text: 'Превратим скрипт из модуля 9 в настоящую службу. Юнит-файл состоит из секций: `[Unit]` — описание и зависимости (After=network.target — «после сети»), `[Service]` — как запускать и что делать при падении, `[Install]` — в какой target включать при enable.',
        },
        {
          type: 'code',
          title: 'Скрипт-демон и юнит для него',
          code: `$ nano ~/watcher.sh
# #!/bin/bash
# while true; do
#   echo "$(date +"%F %T") система жива, нагрузка: $(cat /proc/loadavg)"
#   sleep 60
# done
$ chmod +x ~/watcher.sh
$ sudo nano /etc/systemd/system/watcher.service
# [Unit]
# Description=Heartbeat watcher (учебная служба)
# After=network.target
#
# [Service]
# ExecStart=/home/student/watcher.sh
# Restart=on-failure
# RestartSec=5
# User=student
#
# [Install]
# WantedBy=multi-user.target`,
        },
        {
          type: 'code',
          title: 'Запускаем и наблюдаем',
          code: `$ sudo systemctl daemon-reload      # systemd перечитывает юниты
$ sudo systemctl enable --now watcher.service
Created symlink /etc/systemd/system/multi-user.target.wants/watcher.service ...
$ systemctl status watcher --no-pager
● watcher.service - Heartbeat watcher (учебная служба)
     Active: active (running) since Fri 2025-03-14 12:00:11 UTC; 8s ago
$ journalctl -u watcher -n 2 --no-pager
Mar 14 12:00:11 ubuntu watcher.sh[2501]: 2025-03-14 12:00:11 система жива, нагрузка: 0.02 0.05 0.01`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'После ЛЮБОГО изменения юнит-файла нужен `sudo systemctl daemon-reload` — иначе systemd продолжит работать со старой версией из памяти. Это ошибка номер один у новичков: «я поменял файл, а ничего не изменилось».',
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: в какой секции пишут команду запуска (ExecStart)? Что делает `Restart=on-failure` в паре с `RestartSec=5`? Ответы: [Service]; при падении процесса systemd сам поднимет его через 5 секунд — так серверы переживают сбои без администратора.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Вы управляете службами как системный администратор. В следующем уроке применим это на практике: установим веб-сервер nginx, настроим виртуальные хосты и выпустим настоящий HTTPS-сертификат.',
        },
      ],
      tasks: [
        {
          title: 'Разведка по службам',
          difficulty: 1,
          description:
            'Найдите в системе пять запущенных служб (`systemctl list-units --type=service --state=running`). Для службы `cron` выясните: активна ли она, включена ли в автозагрузку и когда стартовала. Используйте `status`, `is-active`, `is-enabled`.',
          hint: 'Сокращайте вывод флагом --no-pager. Вся информация есть в третьей строке вывода status.',
          solution: `$ systemctl list-units --type=service --state=running --no-pager | head -8
UNIT                  LOAD   ACTIVE SUB     DESCRIPTION
cron.service          loaded active running Regular background program processing daemon
dbus.service          loaded active running D-Bus System Message Bus
ssh.service           loaded active running OpenBSD Secure Shell server
systemd-journald.service loaded active running Journal Service
...
$ systemctl is-active cron
active
$ systemctl is-enabled cron
enabled
$ systemctl status cron --no-pager | head -3
● cron.service - Regular background program processing daemon
     Active: active (running) since Fri 2025-03-14 08:10:02 UTC; 4h ago`,
        },
        {
          title: 'Служба-заметка',
          difficulty: 2,
          description:
            'Создайте скрипт `~/heartbeat.sh`, который раз в 30 секунд дописывает дату в файл `~/heartbeat-service.log` (цикл while + sleep 30), и оформите его как службу `heartbeat.service`. Запустите, убедитесь, что лог растёт, затем остановите службу и удалите юнит.',
          hint: 'В юните: [Service] ExecStart=/home/student/heartbeat.sh, User=student. Не забудьте daemon-reload. Остановка: stop, disable, удалить файл и снова daemon-reload.',
          solution: `$ nano ~/heartbeat.sh
# #!/bin/bash
# while true; do date >> /home/student/heartbeat-service.log; sleep 30; done
$ chmod +x ~/heartbeat.sh
$ sudo nano /etc/systemd/system/heartbeat.service
# [Unit]
# Description=Heartbeat test service
# [Service]
# ExecStart=/home/student/heartbeat.sh
# User=student
# [Install]
# WantedBy=multi-user.target
$ sudo systemctl daemon-reload
$ sudo systemctl enable --now heartbeat.service
$ sleep 65 && tail -n 3 ~/heartbeat-service.log
Fri Mar 14 12:10:01 UTC 2025
Fri Mar 14 12:10:31 UTC 2025
Fri Mar 14 12:11:01 UTC 2025
$ sudo systemctl stop heartbeat.service
$ sudo systemctl disable heartbeat.service
$ sudo rm /etc/systemd/system/heartbeat.service
$ sudo systemctl daemon-reload`,
        },
        {
          title: 'Непробиваемая служба',
          difficulty: 3,
          description:
            'Добавьте к службе watcher.service из урока автоперезапуск: `Restart=always` и `RestartSec=3`. Затем «убейте» процесс скрипта вручную через `kill` (найдите PID в `systemctl status`) и докажите по `systemctl status` и журналу, что systemd поднял службу заново. Объясните себе, почему PID изменился.',
          hint: 'kill по PID шлёт SIGTERM (модуль 6). После перезапуска у процесса будет новый PID — проверьте в выводе status строку Main PID.',
          solution: `$ sudo systemctl edit --full watcher.service
# меняем: Restart=always, RestartSec=3
$ sudo systemctl daemon-reload
$ sudo systemctl restart watcher.service
$ systemctl status watcher --no-pager | grep "Main PID"
   Main PID: 3105 (watcher.sh)
$ kill 3105          # «авария»: завершаем процесс
$ sleep 5            # даём systemd 3 секунды на перезапуск
$ systemctl status watcher --no-pager | grep -E "Active|Main PID"
     Active: active (running) since Fri 2025-03-14 12:20:47 UTC; 2s ago
   Main PID: 3188 (watcher.sh)
# PID новый (3188 вместо 3105), служба снова active — systemd спас её сам`,
        },
      ],
      quiz: [
        {
          question: 'Что такое юнит в systemd?',
          options: [
            'Текстовый файл-описание объекта: службы, таймера, сокета и т.д.',
            'Процесс с PID 1',
            'Лог-файл службы',
            'Сетевой порт сервера',
          ],
          correctIndex: 0,
          explanation:
            'Юнит — это «карточка» объекта в виде ini-файла: ssh.service, apt-daily.timer, multi-user.target. Сам systemd — процесс №1, который читает эти карточки и управляет объектами.',
        },
        {
          question: 'Чем systemctl enable отличается от systemctl start?',
          options: [
            'Ничем, это синонимы',
            'enable добавляет службу в автозагрузку, start запускает её прямо сейчас',
            'enable работает только от root, а start — от любого пользователя',
            'start включает логирование, enable — нет',
          ],
          correctIndex: 1,
          explanation:
            'enable создаёт симлинк в wants-каталоге target (сработает при следующей загрузке), start поднимает службу немедленно. Команда enable --now совмещает оба действия.',
        },
        {
          question: 'Вы отредактировали файл /etc/systemd/system/my.service, но поведение службы не изменилось. Что забыли?',
          options: [
            'Перезагрузить сервер',
            'sudo systemctl daemon-reload — systemd должен перечитать юниты',
            'Удалить /etc/passwd',
            'Сменить права файла на 777',
          ],
          correctIndex: 1,
          explanation:
            'systemd кэширует юниты в памяти. После правки обязателен daemon-reload (и restart самой службы, если она уже работает).',
        },
        {
          question: 'Что делает директива Restart=on-failure в секции [Service]?',
          options: [
            'Запрещает службе падать',
            'Перезапускает процесс, если он завершился с ошибкой',
            'Перезагружает сервер при сбое',
            'Пишет ошибку в /var/log/failures',
          ],
          correctIndex: 1,
          explanation:
            'При аварийном завершении процесса systemd автоматически поднимет его заново (с паузой RestartSec). Это базовый механизм самовосстановления служб на продакшен-серверах.',
        },
      ],
    },
    {
      id: 'm10-l02',
      title: 'Веб-сервер nginx: виртуальные хосты и HTTPS (certbot)',
      minutes: 32,
      intro:
        'Поднимете веб-сервер nginx, настроите виртуальный хост для своего сайта и защитите его настоящим бесплатным HTTPS-сертификатом от Let’s Encrypt.',
      blocks: [
        {
          type: 'paragraph',
          text: 'В модуле 5 вы ставили пакеты через apt, в модуле 7 разбирались с IP и портами, а в прошлом уроке — управляли службами. Сегодня всё сложится вместе: поднимем **веб-сервер** — программу, которая отвечает браузерам по протоколу HTTP и отдаёт им страницы. Наш выбор — **nginx**: он обслуживает огромную долю сайтов в мире и в Ubuntu 22.04 ставится одним пакетом.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Веб-сервер — как стойка ресепшн. Браузер приходит по адресу (IP + порт 80 или 443) и просит: «дай страницу /». nginx смотрит в свои настройки, какой сайт за этот адрес отвечает, находит файлы на диске и отдаёт их гостю.',
        },
        {
          type: 'heading',
          text: 'Установка и первая страница',
        },
        {
          type: 'code',
          title: 'Ставим nginx и открываем файрвол',
          code: `$ sudo apt update && sudo apt install -y nginx
...
$ systemctl status nginx --no-pager | head -3
● nginx.service - A high performance web server and a reverse proxy server
     Active: active (running) since Fri 2025-03-14 13:00:05 UTC; 10s ago
$ sudo ufw allow "Nginx Full"     # порты 80 и 443 в файрволе (модуль 8)
Rules updated
$ curl -I http://localhost        # заголовки ответа (модуль 7)
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)`,
        },
        {
          type: 'paragraph',
          text: 'Откройте в браузере `http://localhost` (или IP виртуальной машины) — увидите страницу «Welcome to nginx!». Её файл лежит в `/var/www/html/index.nginx-debian.html`. Главный конфиг — `/etc/nginx/nginx.conf`, но сайты настраиваются отдельно, в двух каталогах.',
        },
        {
          type: 'heading',
          text: 'Виртуальные хосты: много сайтов на одном сервере',
        },
        {
          type: 'paragraph',
          text: '**Виртуальный хост** (server block) позволяет одному nginx обслуживать несколько сайтов: сервер смотрит, какое имя запросил браузер (`mysite.local` или `shop.local`), и отдаёт файлы соответствующего сайта. Конфиги лежат в `/etc/nginx/sites-available/` («доступные»), а включаются симлинком в `/etc/nginx/sites-enabled/` («включённые»). Помните символические ссылки `ln -s` из урока m02-l03?',
        },
        {
          type: 'code',
          title: 'Сайт mysite.local своими руками',
          code: `$ sudo mkdir -p /var/www/mysite/html
$ echo "<h1>Мой сайт работает!</h1>" | sudo tee /var/www/mysite/html/index.html
$ sudo nano /etc/nginx/sites-available/mysite
# server {
#     listen 80;
#     server_name mysite.local;
#     root /var/www/mysite/html;
#     index index.html;
# }
$ sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/mysite
$ sudo nginx -t        # проверка конфига БЕЗ перезапуска
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ sudo systemctl reload nginx    # применить без обрыва соединений`,
        },
        {
          type: 'paragraph',
          text: 'Домен `mysite.local` придуманный, DNS о нём не знает. Для локального теста подмените запись в файле `/etc/hosts` — мы разбирали его в уроке m07-l01: добавьте строку `127.0.0.1 mysite.local` — и браузер пойдёт на ваш nginx.',
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Никогда не делайте restart «вслепую»: сначала `sudo nginx -t`. Одна пропущенная точка с запятой — и nginx при перезапуске не поднимется вообще, обрушив все сайты. `nginx -t` ловит синтаксис заранее, а `reload` применяет конфиг без разрыва соединений.',
        },
        {
          type: 'heading',
          text: 'HTTPS: замок в адресной строке',
        },
        {
          type: 'paragraph',
          text: 'Обычный HTTP передаёт данные открытым текстом — пароли по пути можно подсмотреть. **HTTPS** шифрует трафик, а подтверждает «этот сервер — настоящий владелец домена» **TLS-сертификат**. Бесплатные сертификаты выдаёт центр **Let’s Encrypt**, а получает и продлевает их программа **certbot**. Важно: для настоящего сертификата нужен реальный домен, указывающий на ваш сервер (A-запись в DNS), и открытый порт 80 — Let’s Encrypt проверит домен по HTTP.',
        },
        {
          type: 'code',
          title: 'Certbot делает всё за нас (нужен реальный домен!)',
          code: `$ sudo apt install -y certbot python3-certbot-nginx
$ sudo certbot --nginx -d mysite.example.com
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for mysite.example.com
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/mysite.example.com/fullchain.pem
Key      is saved at: /etc/letsencrypt/live/mysite.example.com/privkey.pem
This certificate expires on 2025-06-12.
Deploying certificate
Successfully deployed certificate for mysite.example.com
Congratulations! You have successfully enabled HTTPS on https://mysite.example.com
$ sudo systemctl list-timers | grep certbot    # автопродление уже настроено
certbot.timer
# в snap-варианте certbot вместо этого увидите snap.certbot.renew.timer`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Сертификат Let’s Encrypt живёт 90 дней, но продлевать его вручную не нужно: пакет certbot сам ставит таймер автообновления (вы уже умеете читать `systemctl list-timers`). Проверка продления «насухую»: `sudo certbot renew --dry-run`.',
        },
        {
          type: 'paragraph',
          text: 'certbot не только получил сертификат — он сам переписал ваш server block: добавил `listen 443 ssl`, пути к сертификату и редирект с HTTP на HTTPS. Откройте `/etc/nginx/sites-available/mysite` и посмотрите, что изменилось — это лучший урок nginx-конфигурации.',
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: зачем нужны два каталога sites-available и sites-enabled вместо одного? Ответ: можно держать заготовки сайтов (available) и включать/выключать их симлинком (enabled) одной командой, не удаляя конфиги.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Ваш сервер отдаёт сайты по HTTPS — это уже уровень джуниор-админа. В следующем уроке спустимся ниже, к железу: LVM, подкачка и дисковые квоты.',
        },
      ],
      tasks: [
        {
          title: 'Замените стартовую страницу',
          difficulty: 1,
          description:
            'Установите nginx, убедитесь, что служба работает, и замените приветственную страницу `/var/www/html/index.nginx-debian.html` на свою — с заголовком «Сервер студента». Проверьте результат командой `curl http://localhost`.',
          hint: 'Файл принадлежит root, поэтому запись — через sudo: `echo "..." | sudo tee путь`. Проверка без браузера: curl покажет HTML прямо в терминале.',
          solution: `$ sudo apt update && sudo apt install -y nginx
$ systemctl is-active nginx
active
$ echo "<h1>Сервер студента</h1>" | sudo tee /var/www/html/index.nginx-debian.html
<h1>Сервер студента</h1>
$ curl http://localhost
<h1>Сервер студента</h1>`,
        },
        {
          title: 'Второй сайт на том же сервере',
          difficulty: 2,
          description:
            'Создайте виртуальный хост `blog.local`: папка `/var/www/blog/html` с index.html, конфиг в sites-available, симлинк в sites-enabled, запись в /etc/hosts. Проверьте `nginx -t`, сделайте reload и убедитесь, что `curl http://blog.local` отдаёт вашу страницу, а `curl http://mysite.local` (из урока) по-прежнему работает.',
          hint: 'Порядок: mkdir → index.html → конфиг → ln -s → /etc/hosts → nginx -t → reload. server_name в конфиге: blog.local.',
          solution: `$ sudo mkdir -p /var/www/blog/html
$ echo "<h1>Блог студента</h1>" | sudo tee /var/www/blog/html/index.html
$ sudo nano /etc/nginx/sites-available/blog
# server {
#     listen 80;
#     server_name blog.local;
#     root /var/www/blog/html;
#     index index.html;
# }
$ sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
$ echo "127.0.0.1 blog.local" | sudo tee -a /etc/hosts
$ sudo nginx -t && sudo systemctl reload nginx
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ curl http://blog.local
<h1>Блог студента</h1>
$ curl http://mysite.local
<h1>Мой сайт работает!</h1>`,
        },
        {
          title: 'Разберитесь в сертификате',
          difficulty: 3,
          description:
            'Даже без своего домена изучите механику HTTPS: (1) найдите в выводе `apt show certbot`, какие таймеры продления ставит пакет; (2) выполните `sudo certbot certificates` и объясните вывод; (3) найдите в интернете или man странице certbot описание команды `certbot renew --dry-run` и объясните, зачем она. Бонус: на реальном сервере с доменом выполните выпуск сертификата по инструкции урока.',
          hint: 'Пока сертификатов нет, команда certbot certificates честно скажет «No certificates found» — это нормально и само по себе полезный вывод.',
          solution: `$ sudo apt install -y certbot python3-certbot-nginx
$ sudo certbot certificates
Saving debug log to /var/log/letsencrypt/letsencrypt.log
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
No certificates found.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
$ systemctl list-timers --all | grep -i certbot
# таймер certbot.timer (или snap.certbot.renew.timer) — автообновление
# certbot renew --dry-run — ТЕСТ продления без реального перевыпуска:
# проверяет, что домен доступен и продление пройдёт, когда срок подойдёт`,
        },
      ],
      quiz: [
        {
          question: 'Что делает команда sudo nginx -t?',
          options: [
            'Перезапускает nginx',
            'Показывает открытые порты nginx',
            'Проверяет синтаксис конфигурации без перезапуска',
            'Создаёт тестовый виртуальный хост',
          ],
          correctIndex: 2,
          explanation:
            'nginx -t разбирает все конфиги и сообщает об ошибках, не трогая работающий сервер. Золотое правило: сначала nginx -t, и только потом systemctl reload nginx.',
        },
        {
          question: 'Зачем в Ubuntu конфиги сайтов nginx разнесены по sites-available и sites-enabled?',
          options: [
            'available — для HTTP-сайтов, enabled — для HTTPS',
            'Чтобы включать и выключать сайты симлинком, не удаляя сам конфиг',
            'Это резервная копия на случай сбоя',
            'Так требует стандарт HTTPS',
          ],
          correctIndex: 1,
          explanation:
            'Сайт лежит в sites-available, а «включается» симлинком в sites-enabled — nginx читает только второй каталог. Выключить сайт = удалить симлинк, конфиг останется нетронутым.',
        },
        {
          question: 'Что нужно для выпуска настоящего сертификата Let’s Encrypt?',
          options: [
            'Платная подписка и паспорт владельца',
            'Только установленный nginx, больше ничего',
            'Реальный домен с DNS-записью на сервер и открытый порт 80 для проверки',
            'Сертификат от другого центра сертификации',
          ],
          correctIndex: 2,
          explanation:
            'Let’s Encrypt бесплатен, но проверяет, что вы управляете доменом: делает HTTP-запрос на ваш сервер по доменному имени. Поэтому домен должен указывать на сервер, а порт 80 — быть открыт.',
        },
        {
          question: 'Как продлевается 90-дневный сертификат certbot?',
          options: [
            'Вручную каждые 90 дней по напоминанию в календаре',
            'Автоматически таймером, который ставит пакет certbot',
            'Сертификат продлевается вечно и не истекает',
            'Продлением занимается nginx сам по себе',
          ],
          correctIndex: 1,
          explanation:
            'Пакет certbot устанавливает systemd-таймер, который дважды в день проверяет сроки и продлевает сертификаты за 30 дней до истечения. Проверить процесс можно заранее: sudo certbot renew --dry-run.',
        },
      ],
    },
    {
      id: 'm10-l03',
      title: 'Диски профессионально: LVM, swap, квоты',
      minutes: 30,
      intro:
        'Перейдёте от «один диск — один раздел» к профессиональному управлению хранилищем: гибкие тома LVM, файл подкачки swap и дисковые квоты для пользователей.',
      blocks: [
        {
          type: 'paragraph',
          text: 'В модуле 6 вы смотрели диски через `df`, `du` и `lsblk`, монтировали разделы и прописывали их в `/etc/fstab`. Но у классических разделов есть фатальный недостаток: размер задан при разметке. Закончилось место на `/home`, а на соседнем разделе свободны 100 ГБ? Увы, подвинуть границу «на горячую» почти нельзя. Эту боль решает **LVM**.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'LVM — это матрёшка из трёх слоёв. Диски и разделы становятся «физическими томами» (PV) — кирпичиками. Кирпичики складываются в «группу томов» (VG) — общий котёл пространства. А из котла вы отрезают «логические тома» (LV) любого размера — и при необходимости увеличивают их без размонтирования, пока в котле есть место.',
        },
        {
          type: 'heading',
          text: 'LVM на практике',
        },
        {
          type: 'paragraph',
          text: 'Три слоя — три команды: `pvcreate` готовит физический том, `vgcreate` собирает группу, `lvcreate` нарезает логический том. Дальше LV форматируют и монтируют как обычный раздел — но с суперсилой: `lvextend` увеличивает его на лету.',
        },
        {
          type: 'code',
          title: 'Создаём LVM на втором диске /dev/sdb',
          code: `$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   25G  0 disk
├─sda1   8:1    0    1M  0 part
└─sda2   8:2    0   24G  0 part /
sdb      8:16   0   10G  0 disk              # свободный второй диск
$ sudo pvcreate /dev/sdb
  Physical volume "/dev/sdb" successfully created.
$ sudo vgcreate data-vg /dev/sdb
  Volume group "data-vg" successfully created
$ sudo lvcreate -n files-lv -L 2G data-vg
  Logical volume "files-lv" created.
$ sudo mkfs.ext4 /dev/data-vg/files-lv
$ sudo mkdir /srv/files && sudo mount /dev/data-vg/files-lv /srv/files
$ df -h /srv/files
Filesystem                    Size  Used Avail Use% Mounted on
/dev/mapper/data--vg-files--lv 2.0G   24K  1.9G   1% /srv/files`,
        },
        {
          type: 'code',
          title: 'Расширяем том на лету: было 2G, станет 4G',
          code: `$ sudo lvextend -L +2G /dev/data-vg/files-lv
  Size of logical volume data-vg/files-lv changed from 2.00 GiB to 4.00 GiB.
  Logical volume data-vg/files-lv successfully resized.
$ sudo resize2fs /dev/data-vg/files-lv   # растягиваем файловую систему
$ df -h /srv/files
Filesystem                    Size  Used Avail Use% Mounted on
/dev/mapper/data--vg-files--lv 3.9G   24K  3.7G   1% /srv/files`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Две команды — две ступени: `lvextend` растит «контейнер» (том), `resize2fs` растит файловую систему внутри него. Забудете вторую — df будет показывать старый размер. Ничего не размонтировали, данные на месте!',
        },
        {
          type: 'heading',
          text: 'Swap: запасная память на диске',
        },
        {
          type: 'paragraph',
          text: '**Swap** (подкачка) — область на диске, куда система выгружает редко используемые данные из оперативной памяти, когда её не хватает. Это медленнее RAM (помните `free -h` из модуля 6?), но спасает от падения программ. Вместо отдельного раздела удобно использовать **swap-файл**: размер меняется в любой момент.',
        },
        {
          type: 'code',
          title: 'Swap-файл на 1 ГБ за четыре команды',
          code: `$ free -h
               total        used        free
Mem:           3.8Gi       1.1Gi       2.2Gi
Swap:             0B          0B          0B    # подкачки нет
$ sudo fallocate -l 1G /swapfile
$ sudo chmod 600 /swapfile        # только root: в swap могут быть пароли!
$ sudo mkswap /swapfile
Setting up swapspace version 1, size = 1024 MiB
$ sudo swapon /swapfile
$ free -h | grep Swap
Swap:          1.0Gi          0B       1.0Gi
$ echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab   # после перезагрузки`,
        },
        {
          type: 'heading',
          text: 'Квоты: честное делёжка диска',
        },
        {
          type: 'paragraph',
          text: 'На сервере с несколькими пользователями один жадный коллега может забить диск под завязку. **Дисковые квоты** ограничивают, сколько места (и файлов) может занять каждый пользователь. Механизм: включаем учёт квот на файловой системе (опция `usrquota` в `/etc/fstab`), создаём индекс `quotacheck`, задаём лимит `edquota`, смотрим отчёт `repquota`.',
        },
        {
          type: 'code',
          title: 'Включаем квоты и ограничиваем пользователя',
          code: `$ sudo apt install -y quota
$ sudo nano /etc/fstab
# в строке корневой ФС добавляем опцию: defaults,usrquota — затем remount
$ sudo mount -o remount /
$ sudo quotacheck -um /
$ sudo quotaon /
$ sudo edquota ivan
# в редакторе ставим: soft=4000000  hard=5000000 (блоки ≈ 4 и 5 ГБ)
$ sudo repquota /
*** Report for user quotas on device /dev/sda2
User    used     soft     hard
ivan    12004    4000000  5000000`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Soft-лимит можно превышать ограниченное время (обычно неделю) — система лишь ругается. Hard-лимит — стена: запись просто откажет с ошибкой «Disk quota exceeded». Ставьте soft чуть ниже hard — пользователь успеет заметить проблему.',
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: назовите три слоя LVM по порядку. Ответ: физический том (PV) → группа томов (VG) → логический том (LV). PV — диски, VG — котёл пространства, LV — то, что форматируют и монтируют.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Диски теперь под вашим полным контролем. Впереди последний урок курса: Docker и финальный проект, где всё изученное соберётся в один работающий сервер.',
        },
      ],
      tasks: [
        {
          title: 'Изучите свою разметку',
          difficulty: 1,
          description:
            'Выполните `lsblk`, `df -h` и `sudo pvs; sudo vgs; sudo lvs`. Определите: сколько дисков в системе, какой раздел смонтирован в `/`, использует ли ваша установка Ubuntu LVM (при установке с настройками по умолчанию Ubuntu 22.04 Server как раз создаёт LVM — ищите тома вида ubuntu-vg/ubuntu-lv).',
          hint: 'Если pvs/vgs ничего не показывают — LVM нет, это тоже ответ. Посмотрите вывод lsblk: LVM-тома видны как устройства типа lvm.',
          solution: `$ lsblk
NAME                      MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda                         8:0    0   25G  0 disk
├─sda1                      8:1    0    1M  0 part
├─sda2                      8:2    0    2G  0 part /boot
└─sda3                      8:3    0   23G  0 part
  └─ubuntu--vg-ubuntu--lv 253:0    0 11.5G  0 lvm  /
$ sudo pvs
  PV         VG        Fmt  Attr PSize   PFree
  /dev/sda3  ubuntu-vg lvm2 a--  23.00g  11.50g
$ sudo vgs && sudo lvs
  VG        #PV #LV #SN Attr   VSize   VFree
  ubuntu-vg   1   1   0 wz--n- 23.00g  11.50g
  LV        VG        Attr       LSize
  ubuntu-lv ubuntu-vg -wi-ao---- 11.50g`,
        },
        {
          title: 'Swap-файл на 512 МБ',
          difficulty: 2,
          description:
            'Создайте swap-файл размером 512 МБ, включите его, убедитесь по `free -h` и `swapon --show`, что подкачка появилась. Затем добавьте запись в `/etc/fstab`, чтобы swap переживал перезагрузку.',
          hint: 'Четыре шага: fallocate → chmod 600 → mkswap → swapon. Проверка: `swapon --show` покажет имя файла и размер.',
          solution: `$ sudo fallocate -l 512M /swapfile
$ sudo chmod 600 /swapfile
$ sudo mkswap /swapfile
Setting up swapspace version 1, size = 512 MiB
$ sudo swapon /swapfile
$ swapon --show
NAME       TYPE  SIZE USED PRIO
/swapfile  file  512M   0B   -2
$ free -h | grep Swap
Swap:          512Mi          0B       512Mi
$ echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab`,
        },
        {
          title: 'LVM-полигон на файле-«диске»',
          difficulty: 3,
          description:
            'Нет второго диска? Создайте его из файла прямо в домашней папке: `fallocate -l 1G ~/disk0.img` и подключите как loop-устройство `sudo losetup -f --show ~/disk0.img`. На этом «диске» постройте полный стек: pvcreate → vgcreate test-vg → lvcreate на 512 МБ → mkfs.ext4 → смонтируйте в /mnt/test. Затем уберите за собой: umount, lvremove, vgremove, pvremove, losetup -d, удалите файл. **Не бойтесь: мы тренируемся на обычном файле (loop-устройстве), а не на реальном диске — это полностью безопасно, и `mkfs` здесь не страшен**: хуже всего, что случится, — «испортится» файлик, который мы всё равно удалим.',
          hint: 'losetup с флагом --show выведет имя устройства, например /dev/loop0 — дальше работайте с ним как с обычным диском. Файл создаётся в домашней папке без sudo, а вот losetup и LVM-команды требуют sudo. Удаление строго в обратном порядке создания.',
          solution: `$ fallocate -l 1G ~/disk0.img
$ sudo losetup -f --show ~/disk0.img
/dev/loop0
$ sudo pvcreate /dev/loop0
  Physical volume "/dev/loop0" successfully created.
$ sudo vgcreate test-vg /dev/loop0
  Volume group "test-vg" successfully created
$ sudo lvcreate -n test-lv -L 512M test-vg
  Logical volume "test-lv" created.
$ sudo mkfs.ext4 /dev/test-vg/test-lv
$ sudo mkdir -p /mnt/test && sudo mount /dev/test-vg/test-lv /mnt/test
$ df -h /mnt/test
Filesystem                 Size  Used Avail Use% Mounted on
/dev/mapper/test--vg-test--lv 488M  24K  452M   1% /mnt/test
# убираем за собой, в обратном порядке:
$ sudo umount /mnt/test
$ sudo lvremove -y /dev/test-vg/test-lv
$ sudo vgremove test-vg
$ sudo pvremove /dev/loop0
$ sudo losetup -d /dev/loop0
$ rm ~/disk0.img`,
        },
      ],
      quiz: [
        {
          question: 'В каком порядке создаются объекты LVM?',
          options: [
            'LV → VG → PV',
            'PV → VG → LV',
            'VG → PV → LV',
            'Порядок не важен',
          ],
          correctIndex: 1,
          explanation:
            'Снизу вверх: сначала диск помечают физическим томом (pvcreate), из PV собирают группу (vgcreate), и только из группы нарезают логические тома (lvcreate). Удаляют в обратном порядке.',
        },
        {
          question: 'Вы выполнили lvextend -L +2G, но df -h показывает прежний размер. Что забыли?',
          options: [
            'Перезагрузить сервер',
            'resize2fs — растянуть файловую систему внутри увеличенного тома',
            'Отформатировать том заново',
            'Команду vgextend',
          ],
          correctIndex: 1,
          explanation:
            'lvextend увеличивает сам том, а файловая система внутри остаётся старого размера, пока её не растянут resize2fs. Размонтировать при этом ничего не нужно.',
        },
        {
          question: 'Зачем swap-файлу права 600 (только root)?',
          options: [
            'Чтобы swap работал быстрее',
            'В swap могут попадать данные из памяти программ, включая пароли — чужие глаза недопустимы',
            'Так требует mkswap, иначе откажется работать',
            'Права ни на что не влияют, это традиция',
          ],
          correctIndex: 1,
          explanation:
            'В подкачку выгружаются страницы памяти любых процессов — там могут оказаться пароли и ключи. Чтение такого файла посторонним пользователем — дыра в безопасности, поэтому chmod 600 обязателен.',
        },
        {
          question: 'Чем hard-лимит квоты отличается от soft-лимита?',
          options: [
            'Hard считает байты, soft — количество файлов',
            'Soft можно превышать ограниченное время, hard — абсолютная стена',
            'Hard действует на root, soft — на остальных',
            'Ничем, это устаревшие синонимы',
          ],
          correctIndex: 1,
          explanation:
            'Soft — «мягкое» предупреждение: превысил — есть льготный период, чтобы почистить место. Hard — жёсткий потолок: запись сверх него просто отклоняется с ошибкой.',
        },
      ],
    },
    {
      id: 'm10-l04',
      title: 'Docker-база и финальный проект: свой настроенный сервер',
      minutes: 35,
      intro:
        'Познакомитесь с контейнерами и Docker — стандартом современного развёртывания, а затем соберёте финальный проект курса: полностью настроенный сервер с сайтом, бэкапами и автоматикой.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Финальный урок! Вы прошли путь от «что такое Linux» до собственных служб и HTTPS. Остался один инструмент, без которого сегодня не обходится ни одна вакансия администратора и DevOps — **Docker** и **контейнеры**.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Контейнер — это как контейнер в порту: внутри у каждого свой груз (программа + все её зависимости), снаружи стандартные стенки. Программа внутри думает, что она одна на компьютере: свои файлы, свои процессы. При этом контейнеры делят одно ядро Linux и потому стартуют за секунду — в отличие от тяжёлой виртуальной машины со своей ОС.',
        },
        {
          type: 'paragraph',
          text: 'Два ключевых понятия: **образ** (image) — это застывший «слепок» системы с программой, как установочный диск; **контейнер** (container) — запущенный экземпляр образа, живая программа. Из одного образа можно поднять хоть десять контейнеров.',
        },
        {
          type: 'heading',
          text: 'Установка Docker и первый контейнер',
        },
        {
          type: 'paragraph',
          text: 'Мы последовательно ставим всё из штатных репозиториев Ubuntu 22.04 (как учили в модуле 5) — Docker не исключение: пакет называется `docker.io`. Чтобы не писать sudo перед каждой командой, добавим себя в группу `docker` (помните группы из модуля 4?).',
        },
        {
          type: 'code',
          title: 'Ставим docker.io и проверяем',
          code: `$ sudo apt update && sudo apt install -y docker.io
$ sudo systemctl enable --now docker
$ sudo usermod -aG docker $USER   # себя — в группу docker
# ПЕРЕЗАЙДИТЕ в систему (или выполните: newgrp docker)
$ docker version | head -4
Client:
 Version:           20.10.21
$ docker run hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.
# Docker скачал образ из публичного реестра Docker Hub,
# создал из него контейнер и выполнил — три действия одной командой`,
        },
        {
          type: 'heading',
          text: 'Управляем контейнерами',
        },
        {
          type: 'code',
          title: 'Веб-сервер в контейнере за одну команду',
          code: `# флаги run: -d — в фоне, --name web — своё имя,
# -p 8080:80 — проброс порта: порт 8080 хоста ведёт на порт 80 контейнера
$ docker images                 # какие образы скачаны
REPOSITORY    TAG       SIZE
hello-world   latest    13.3kB
$ docker run -d --name web -p 8080:80 nginx
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
...
$ docker ps                       # запущенные контейнеры
CONTAINER ID   IMAGE    PORTS                  NAMES
a1b2c3d4e5f6   nginx    0.0.0.0:8080->80/tcp   web
$ curl -I http://localhost:8080   # наш старый знакомый nginx, но в контейнере!
HTTP/1.1 200 OK
Server: nginx/1.23.4
$ docker logs --tail 2 web     # логи — пока контейнер жив!
172.17.0.1 - - [14/Mar/2025:12:01:03 +0000] "HEAD / HTTP/1.1" 200 612 "-" "curl/7.81.0" "-"
# docker exec -it web bash — так можно зайти внутрь контейнера
$ docker stop web && docker rm web    # и только теперь останавливаем и удаляем
web
web`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Контейнер временный: удалите его — и всё, что было записано внутри, исчезнет. Данные, которые жалко терять, хранят снаружи и подключают в контейнер через **тома** (флаг `-v /данные/на/хосте:/данные/в/контейнере`).',
        },
        {
          type: 'heading',
          text: 'Dockerfile: собираем свой образ',
        },
        {
          type: 'paragraph',
          text: 'Готовый образ — хорошо, а свой — лучше. Рецепт сборки описывается в файле **Dockerfile**: FROM (базовый образ), COPY (что положить), EXPOSE (какой порт). Собираем `docker build`, запускаем `docker run`. Это и есть «упаковать приложение»: образ можно перенести на любой сервер с Docker — и он заработает одинаково.',
        },
        {
          type: 'code',
          title: 'Свой сайт в своём образе',
          code: `$ mkdir myimage && cd myimage
$ echo "<h1>Сайт из моего образа!</h1>" > index.html
$ nano Dockerfile
# FROM nginx
# COPY index.html /usr/share/nginx/html/index.html
# EXPOSE 80
$ docker build -t mysite:1.0 .
[+] Building 4.2s (7/7) FINISHED
 => => naming to docker.io/library/mysite:1.0
$ docker run -d --name mysite -p 8081:80 mysite:1.0
$ curl http://localhost:8081
<h1>Сайт из моего образа!</h1>`,
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: чем образ отличается от контейнера? Ответ: образ — неизменный шаблон (как класс в программировании или установочный диск), контейнер — запущенный экземпляр этого шаблона (как объект или установленная система).',
        },
        {
          type: 'heading',
          text: 'Финал курса: что вы теперь умеете',
        },
        {
          type: 'paragraph',
          text: 'Оглянитесь. Десять модулей назад вы впервые увидели терминал, а сегодня в вашем арсенале: установка и настройка Ubuntu 22.04, свободная работа с файлами и потоками, пользователи и права, пакеты и репозитории, процессы и ресурсы, сеть и SSH, файрвол и бэкапы, логи и аудит, bash-скрипты с расписаниями, службы systemd, веб-сервер с HTTPS, LVM и контейнеры. Это полный фундамент системного администратора Linux.',
        },
        {
          type: 'list',
          items: [
            '**LPIC-1 / Linux+** — сертификаты, которые подтвердят ваши знания для работодателя; программа LPIC-1 покрывает почти всё, что вы уже прошли',
            '**DevOps-путь**: Ansible (автоматизация настройки), Kubernetes (оркестрация контейнеров — Docker вы уже знаете), CI/CD',
            '**Облака**: AWS, Google Cloud, Yandex Cloud — внутри виртуальных машин там та же Ubuntu, которую вы теперь знаете',
            '**Практика**: арендуйте самый дешёвый VPS и держите на нём свой сайт, бота или Nextcloud — лучший учитель',
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Главный секрет администратора не в зубрёжке команд, а в подходе: читайте ошибку внимательно, смотрите логи (journalctl!), проверяйте гипотезы по одной и делайте бэкап ДО изменений. Всё остальное находится через man и поисковик.',
        },
        {
          type: 'paragraph',
          text: 'Спасибо, что прошли этот путь до конца. Ниже — финальный проект: соберите всё изученное в один живой сервер. Удачи — и до встречи в профессии!',
        },
      ],
      tasks: [
        {
          title: 'Три жизни одного контейнера',
          difficulty: 1,
          description:
            'Установите Docker и проделайте полный цикл: запустите контейнер `web` из образа nginx с пробросом порта 8080, проверьте страницу через curl, загляните внутрь контейнера (`docker exec -it web bash`, выход — `exit`), посмотрите логи, затем остановите и удалите контейнер. Убедитесь командой `docker ps -a`, что следов не осталось.',
          hint: 'После `sudo usermod -aG docker $USER` не забудьте перезайти в систему или выполнить `newgrp docker` — иначе группа не применится.',
          solution: `$ sudo apt install -y docker.io
$ sudo usermod -aG docker $USER && newgrp docker
$ docker run -d --name web -p 8080:80 nginx
$ curl -s http://localhost:8080 | grep -o "<title>.*</title>"
<title>Welcome to nginx!</title>
$ docker exec -it web bash
root@a1b2c3d4e5f6:/# hostname
a1b2c3d4e5f6
root@a1b2c3d4e5f6:/# exit
$ docker logs --tail 2 web
$ docker stop web && docker rm web
web
web
$ docker ps -a
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES`,
        },
        {
          title: 'Образ со своей страницей',
          difficulty: 2,
          description:
            'Соберите собственный образ: Dockerfile на базе nginx, в который COPY-ется ваша index.html с текстом «Финал курса!». Соберите образ с тегом `final:1.0`, запустите контейнер на порту 8082, проверьте curl. Затем выведите список образов и найдите свой.',
          hint: 'Структура: папка с двумя файлами (index.html и Dockerfile), внутри папки — docker build -t final:1.0 .  (точка в конце обязательна — это «собирать из текущей папки»).',
          solution: `$ mkdir final && cd final
$ echo "<h1>Финал курса!</h1>" > index.html
$ nano Dockerfile
# FROM nginx
# COPY index.html /usr/share/nginx/html/index.html
$ docker build -t final:1.0 .
[+] Building 3.8s (6/6) FINISHED
 => => naming to docker.io/library/final:1.0
$ docker run -d --name final -p 8082:80 final:1.0
$ curl http://localhost:8082
<h1>Финал курса!</h1>
$ docker images
REPOSITORY   TAG    SIZE
final        1.0    142MB
nginx        latest 142MB`,
        },
        {
          title: 'ФИНАЛЬНЫЙ ПРОЕКТ: сервер «Всё в одном»',
          difficulty: 3,
          description:
            'Соберите в одной системе всё, чему научились за курс. Чек-лист: (1) сайт в Docker-контейнере на порту 8080 (из задания 2); (2) bash-скрипт `~/daily-report.sh`, который пишет в общий каталог `/srv/reports/report-$(date +%F).txt` дату, uptime, свободное место (df -h /) и список запущенных контейнеров (docker ps); (3) скрипт запускается cron-задачей ежедневно в 08:00; (4) отдельный пользователь `viewer` с доступом только к чтению отчётов из `/srv/reports`; (5) файрвол ufw пропускает только SSH и порт 8080. Проверьте каждый пункт командами и запишите, как именно проверяли.',
          hint: 'Идите по списку сверху вниз — каждый пункт опирается на один модуль: 1→модуль 10, 2→модуль 9, 3→модуль 9, 4→модуль 4, 5→модуль 8. Для п.4: создавать пользователей через adduser и добавлять их в группы через usermod -aG вы уже умеете из урока m04-l01. Отчёты кладите в общий `/srv/reports`, а не в домашнюю папку: у /home/student права 750, и viewer туда просто не попадёт.',
          solution: `# ── Шаг 1: сайт в контейнере (модуль 10, docker) ──
$ cd ~/final && docker run -d --name site -p 8080:80 --restart unless-stopped final:1.0
$ curl -s http://localhost:8080          # проверка
<h1>Финал курса!</h1>
# ── Шаг 2: скрипт отчёта (модуль 9, bash) ──
# отчёты складываем в общий каталог /srv/reports, а не в домашнюю
# папку: у /home/student права 750, и viewer туда не попадёт
$ sudo mkdir -p /srv/reports && sudo chown student /srv/reports
$ nano ~/daily-report.sh
# #!/bin/bash
# set -euo pipefail
# out=/srv/reports/report-$(date +%F).txt
# {
#   echo "=== Отчёт за $(date) ==="
#   uptime
#   df -h /
#   docker ps
# } > "$out"
$ chmod +x ~/daily-report.sh && ~/daily-report.sh
$ cat /srv/reports/report-2025-03-14.txt     # проверка: отчёт создан
# ── Шаг 3: расписание (модуль 9, cron) ──
$ crontab -e
# 0 8 * * * /home/student/daily-report.sh >> /home/student/report.log 2>&1
$ crontab -l                             # проверка: строка на месте
# ── Шаг 4: пользователь только для чтения ──
# adduser и usermod -aG вы уже умеете из урока m04-l01
$ sudo adduser viewer                    # задаём пароль, на вопросы жмём Enter
$ sudo groupadd reports 2>/dev/null; sudo usermod -aG reports viewer
$ sudo chgrp reports /srv/reports && sudo chmod 750 /srv/reports
$ sudo chgrp reports /srv/reports/report-*.txt && sudo chmod 640 /srv/reports/report-*.txt
$ sudo -u viewer cat /srv/reports/report-2025-03-14.txt    # читает
$ sudo -u viewer nano /srv/reports/report-2025-03-14.txt   # записать не сможет: read-only
# ── Шаг 5: файрвол (модуль 8, ufw) ──
$ sudo ufw allow OpenSSH
$ sudo ufw allow 8080/tcp
$ sudo ufw enable
$ sudo ufw status                        # проверка: только два правила
Status: active
To                         Action      From
22/tcp (OpenSSH)           ALLOW       Anywhere
8080/tcp                   ALLOW       Anywhere
# ГОТОВО: сайт работает, отчёты пишутся по расписанию,
# viewer читает их без права изменения, файрвол закрывает лишнее`,
        },
      ],
      quiz: [
        {
          question: 'Чем контейнер отличается от виртуальной машины?',
          options: [
            'Ничем, это разные названия одного',
            'Контейнеры делят ядро Linux хоста и стартуют за секунды; ВМ эмулирует целый компьютер со своей ОС',
            'Контейнер всегда медленнее виртуальной машины',
            'ВМ можно удалять, а контейнер нельзя',
          ],
          correctIndex: 1,
          explanation:
            'Контейнер — изолированный процесс, использующий ядро хоста: легковесен и запускается мгновенно. Виртуальная машина — полноценный виртуальный компьютер со своим ядром: изоляция сильнее, но цена — гигабайты памяти и минуты загрузки.',
        },
        {
          question: 'Что означает флаг -p 8080:80 в команде docker run?',
          options: [
            'Ограничить контейнер портами с 80 по 8080',
            'Запросы на порт 8080 хоста перенаправлять на порт 80 внутри контейнера',
            'Открыть порты 8080 и 80 в файрволе',
            'Запустить 8080 копий контейнера',
          ],
          correctIndex: 1,
          explanation:
            'Формат -p ПОРТ_ХОСТА:ПОРТ_КОНТЕЙНЕРА. У контейнера своя изолированная сеть; проброс порта — единственный способ достучаться до сервиса внутри с хоста.',
        },
        {
          question: 'Что произойдёт с файлами, записанными внутри контейнера, при его удалении (docker rm)?',
          options: [
            'Они автоматически скопируются на хост',
            'Они безвозвратно удалятся; для важных данных используют тома (-v)',
            'Они останутся в образе',
            'Docker спросит, сохранить ли их',
          ],
          correctIndex: 1,
          explanation:
            'Файловая система контейнера временная: rm стирает её вместе с контейнером. Поэтому базы данных и файлы пользователей монтируют в контейнер томами (-v /host/dir:/container/dir) — данные живут на хосте.',
        },
        {
          question: 'Из чего состоит Dockerfile и что с ним делает docker build?',
          options: [
            'Это скрипт bash, который build запускает в терминале',
            'Это рецепт: FROM — базовый образ, COPY — какие файлы положить; build собирает по нему новый образ',
            'Это лог-файл сборки, build его только читает',
            'Это архив с готовой программой',
          ],
          correctIndex: 1,
          explanation:
            'Dockerfile — текстовый рецепт образа: базовый слой (FROM), файлы (COPY), команды установки (RUN), порт (EXPOSE). docker build -t имя . выполняет рецепт и создаёт готовый образ, который можно запускать где угодно.',
        },
      ],
    },
  ],
};
