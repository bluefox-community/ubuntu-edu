import type { CourseModule } from '../types';

export const m08: CourseModule = {
  id: 'm08',
  number: 8,
  title: 'Безопасность и надёжность',
  rank: 'Администратор',
  description:
    'Держим систему в безопасности и не теряем данные: файрвол ufw, автоматические обновления безопасности, резервные копии через tar и rsync, чтение журналов и защита SSH с помощью fail2ban.',
  lessons: [
    {
      id: 'm08-l01',
      title: 'Файрвол ufw: закрываем лишнее',
      minutes: 30,
      intro:
        'Научитесь управлять сетевым «домофоном» вашего компьютера: разрешать только нужные подключения и закрывать все остальные — одной простой командой.',
      blocks: [
        {
          type: 'paragraph',
          text: 'В прошлом модуле вы открыли на своей машине порт 22 для SSH — удобно, но каждая открытая «дверь» в сети — потенциальный вход для незваных гостей. Пора научиться запирать двери. В Ubuntu 22.04 для этого есть **ufw** (Uncomplicated Firewall, «несложный файрвол») — дружелюбная обёртка над мощным, но многословным механизмом netfilter.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Файрвол — это домофон в подъезде. Квартиры — это программы, двери — порты. Домофон решает, кого пустить: жильцов с ключами (разрешённые службы) — пожалуйста, а всех остальных — мимо, даже разговаривать не будем.',
        },
        {
          type: 'heading',
          text: 'Что такое файрвол и зачем он дома',
        },
        {
          type: 'paragraph',
          text: 'Вы помните из модуля 7: у компьютера 65 535 портов, и команда `ss -tuln` показывает, какие из них слушают программы. **Файрвол** — сторож, который стоит перед портами и проверяет каждый входящий пакет по списку правил: «порт 22 — можно, порт 23 — нельзя, всё прочее — молча отбросить». Золотой принцип безопасности: **всё, что не разрешено явно — запрещено**.',
        },
        {
          type: 'code',
          title: 'Смотрим, что у нас с файрволом сейчас',
          code: `$ sudo ufw status verbose
Status: inactive
# файрвол установлен, но выключен — все двери пока открыты`,
        },
        {
          type: 'heading',
          text: 'Первые правила: разрешаем нужное',
        },
        {
          type: 'paragraph',
          text: 'Правила в ufw пишутся почти по-русски: `allow` — разрешить, `deny` — запретить. Указать порт можно числом (`22/tcp`) или именем службы (`ssh`, `http`) — ufw сам знает стандартные порты. Правила создаются заранее, до включения файрвола, — и это спасает от неприятности, о которой ниже.',
        },
        {
          type: 'code',
          title: 'Создаём правила до включения файрвола',
          code: `$ sudo ufw allow ssh          # разрешить SSH (порт 22)
Rule added
$ sudo ufw allow 80/tcp       # разрешить веб-сайт (HTTP)
Rule added
$ sudo ufw deny 23            # запретить telnet — он старый и небезопасный
Rule added
$ sudo ufw status
Status: inactive              # правила записаны, но файрвол ещё спит`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Самое важное правило урока: **прежде чем включать ufw, разрешите SSH** (`sudo ufw allow ssh`). Если вы работаете на удалённом сервере и включите файрвол без этого правила, ваше же соединение разорвётся — и обратно вы уже не попадёте. На домашней виртуалке это не страшно, но привычку вырабатываем сразу.',
        },
        {
          type: 'heading',
          text: 'Включаем и проверяем',
        },
        {
          type: 'code',
          title: 'Будим сторожа и смотрим нумерованный список правил',
          code: `$ sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
$ sudo ufw status numbered
Status: active
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 23                         DENY IN    Anywhere
$ sudo ufw delete 3           # правило про telnet было для примера
Rule deleted`,
        },
        {
          type: 'paragraph',
          text: 'Обратите внимание на строку «enabled on system startup» — файрвол теперь сам включается при загрузке. Кстати, а что с исходящими соединениями? По умолчанию ufw **запрещает все входящие** и **разрешает все исходящие**: смотреть сайты можно, а вот зайти к вам снаружи — только через разрешённые порты. Проверить политику можно командой `sudo ufw status verbose`.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Схема работы с ufw: сначала правила (`allow` нужное), потом `enable`, затем проверка `status numbered`. Удаляются правила либо по номеру (`delete 3`), либо по тексту: `sudo ufw delete allow 80/tcp`.',
        },
        {
          type: 'heading',
          text: 'Типичные сценарии',
        },
        {
          type: 'table',
          headers: ['Задача', 'Команда'],
          rows: [
            ['Разрешить SSH', '`sudo ufw allow ssh`'],
            ['Разрешить веб-сервер (80 и 443)', '`sudo ufw allow http` + `sudo ufw allow https`'],
            ['Пустить только из домашней сети', '`sudo ufw allow from 192.168.1.0/24 to any port 22`'],
            ['Временно выключить', '`sudo ufw disable`'],
            ['Сбросить все правила', '`sudo ufw reset`'],
          ],
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: ufw включён, правил нет. Что произойдёт при попытке зайти по SSH? А при открытии сайта в браузере на этой же машине? Вспомните политику по умолчанию.',
        },
        {
          type: 'paragraph',
          text: 'Двери закрыты, сторож не спит. Но сторож не чинит замки: если в программе нашли дыру, её надо залатать обновлением. Об этом — следующий урок, включая автоматический режим, который ставит обновления безопасности, пока вы спите.',
        },
      ],
      tasks: [
        {
          title: 'Осмотрите файрвол',
          difficulty: 1,
          description:
            'Убедитесь, что ufw установлен (в Ubuntu 22.04 он есть из коробки), и посмотрите его состояние и политику по умолчанию: `sudo ufw status verbose`. Запишите, активен ли файрвол и каковы политики для входящих/исходящих.',
          hint: 'Если файрвол выключен, verbose покажет только `Status: inactive`. Политики видны, когда файрвол включён: `default: deny (incoming), allow (outgoing)`.',
          solution: `$ which ufw
/usr/sbin/ufw                  # установлен
$ sudo ufw status verbose
Status: inactive               # пока спит — это нормально для свежей системы
# после включения (sudo ufw enable) verbose покажет:
# Default: deny (incoming), allow (outgoing), disabled (routed)`,
        },
        {
          title: 'Напишите правила для веб-сервера',
          difficulty: 2,
          description:
            'Не включая файрвол, создайте правила: разрешить SSH, разрешить HTTP и HTTPS, запретить порт 23 (telnet). Проверьте список через `sudo ufw show added` — он показывает добавленные правила даже при выключенном файрволе.',
          hint: 'Имена служб `ssh`, `http`, `https` ufw понимает сам. Для просмотра «черновика» правил служит `sudo ufw show added`.',
          solution: `$ sudo ufw allow ssh
Rule added
$ sudo ufw allow http
Rule added
$ sudo ufw allow https
Rule added
$ sudo ufw deny 23
Rule added
$ sudo ufw show added
Added user rules (see 'ufw status' for running firewall):
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443
ufw deny 23`,
        },
        {
          title: 'Включите файрвол и проверьте',
          difficulty: 2,
          description:
            'Включите ufw на своей учебной машине (SSH там уже разрешён из прошлого задания), посмотрите `sudo ufw status numbered` и убедитесь, что правила на месте. Затем удалите правило про telnet по его номеру.',
          hint: 'Сначала `sudo ufw enable` (ответьте y), затем `status numbered`. Номер правила telnet подставьте в `sudo ufw delete N`.',
          solution: `$ sudo ufw enable
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
$ sudo ufw status numbered
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443                        ALLOW IN    Anywhere
[ 4] 23                         DENY IN     Anywhere
$ sudo ufw delete 4
Rule deleted
$ sudo ufw status             # финальная проверка: telnet-правила больше нет`,
        },
        {
          title: 'Правило только для своей сети',
          difficulty: 3,
          description:
            'Ужесточите SSH: удалите общее правило `allow ssh` и вместо него разрешите порт 22 только из вашей локальной подсети (узнайте её через `ip -brief address`, например `192.168.1.0/24`). Проверьте итоговый список правил.',
          hint: 'Формат: `sudo ufw allow from 192.168.1.0/24 to any port 22`. Сначала добавьте узкое правило, потом удаляйте широкое — иначе теоретически можно отрезать себе доступ.',
          solution: `$ ip -brief address show
eth0             UP             192.168.1.50/24    # наша подсеть: 192.168.1.0/24
$ sudo ufw allow from 192.168.1.0/24 to any port 22
Rule added
$ sudo ufw delete allow ssh    # убираем широкое правило
Rule deleted
$ sudo ufw status numbered
[ 1] 80/tcp                     ALLOW IN    Anywhere
[ 2] 443                        ALLOW IN    Anywhere
[ 3] 22                         ALLOW IN    192.168.1.0/24   # SSH — только своим`,
        },
      ],
      quiz: [
        {
          question: 'Какая политика ufw по умолчанию считается правильной?',
          options: [
            'Разрешить всё входящее, запретить всё исходящее',
            'Запретить входящие (кроме разрешённых явно), разрешить исходящие',
            'Запретить вообще всё, включая исходящие',
            'ufw не имеет политик, всё решают отдельные правила',
          ],
          correctIndex: 1,
          explanation:
            'Безопасная схема: входящие по умолчанию запрещены (deny incoming), разрешаем только нужные порты; исходящие разрешены (allow outgoing), чтобы не мешать обычной работе.',
        },
        {
          question: 'Почему перед `sudo ufw enable` обязательно выполняют `sudo ufw allow ssh`?',
          options: [
            'Чтобы SSH работал быстрее',
            'ufw не включится без хотя бы одного правила',
            'Иначе файрвол заблокирует входящие SSH-подключения — и к удалённому серверу не подключиться',
            'Это просто традиция, технической причины нет',
          ],
          correctIndex: 2,
          explanation:
            'После включения файрвола всё неразрешённое отбрасывается. Если SSH не разрешён, ваше подключение к удалённой машине разорвётся, и новое установить не получится.',
        },
        {
          question: 'Чем `sudo ufw status numbered` удобнее обычного `status`?',
          options: [
            'Показывает правила с номерами, по которым их легко удалить командой `ufw delete N`',
            'Показывает правила цветными цифрами',
            'Считает, сколько пакетов прошло через каждое правило',
            'Ничем, это одна и та же команда',
          ],
          correctIndex: 0,
          explanation:
            'Номера правил нужны для удаления: `sudo ufw delete 3` уберёт третье правило из списка. Альтернатива — удаление по тексту: `ufw delete allow 80/tcp`.',
        },
        {
          question: 'Что делает команда `sudo ufw allow from 192.168.1.0/24 to any port 22`?',
          options: [
            'Разрешает порт 22 вообще всем в интернете',
            'Блокирует подсеть 192.168.1.0/24',
            'Перенаправляет порт 22 на роутер',
            'Разрешает подключаться к SSH только компьютерам из локальной сети 192.168.1.0/24',
          ],
          correctIndex: 3,
          explanation:
            'Это узкое правило: источник ограничен локальной подсетью. Снаружи (из интернета) порт 22 останется закрытым — классический приём для домашних серверов.',
        },
      ],
    },
    {
      id: 'm08-l02',
      title: 'Обновления безопасности и unattended-upgrades',
      minutes: 25,
      intro:
        'Поймёте, почему обновления безопасности нельзя откладывать, и настроите систему так, чтобы она латала дыры сама — без вашего участия и без внезапных перезагрузок.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Файрвол закрывает лишние двери, но что если дыра найдена в самой двери, которую мы разрешили — например, в SSH? Такое случается регулярно: исследователи находят **уязвимости** — ошибки в программах, через которые можно проникнуть в систему. Лекарство одно: своевременные обновления.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Обновление безопасности — как замена замка, от которого нашли отмычку. Замок вроде работает, дверь открывается... но каждый день промедления — это день, когда отмычка есть у всех желающих, а нового замка ещё нет.',
        },
        {
          type: 'heading',
          text: 'Зачем обновляться и что обновляется',
        },
        {
          type: 'paragraph',
          text: 'Команды `apt update` и `apt upgrade` вам знакомы из модуля 5. Напомним разницу: `update` лишь обновляет **список** доступных версий (как заглянуть в свежий каталог), а `upgrade` — реально устанавливает новые версии пакетов. Для Ubuntu 22.04 обновления безопасности приходят из специального репозитория `jammy-security`, и команда поддержки Canonical выпускает их быстро — часто в тот же день, что стало известно об уязвимости.',
        },
        {
          type: 'code',
          title: 'Классическая пара: обновить список, посмотреть, что ждёт',
          code: `$ sudo apt update
...
All packages are up to date.   # или список репозиториев
$ apt list --upgradable 2>/dev/null | head -n 5
openssl/jammy-updates,jammy-security 3.0.2-0ubuntu1.19 amd64 [upgradable from: 3.0.2-0ubuntu1.18]
openssh-client/jammy-updates 1:8.9p1-3ubuntu0.13 amd64 [upgradable from: 1:8.9p1-3ubuntu0.11]
$ sudo apt upgrade -y
...
2 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`,
        },
        {
          type: 'heading',
          text: 'unattended-upgrades: сторож-автомат',
        },
        {
          type: 'paragraph',
          text: 'Запускать `apt upgrade` руками каждый день — забудете. Поэтому в Ubuntu 22.04 из коробки установлен пакет **unattended-upgrades** («обновления без присмотра»): служба, которая сама ставит обновления безопасности. Она уже работает на вашей системе — наша задача убедиться в этом и понять её настройки.',
        },
        {
          type: 'code',
          title: 'Убеждаемся, что сторож на месте и что ему разрешено',
          code: `$ dpkg -l unattended-upgrades | tail -n 1
ii  unattended-upgrades  2.8ubuntu1  all  automatic installation of security upgrades
$ grep -A3 "Allowed-Origins" /etc/apt/apt.conf.d/50unattended-upgrades | head -n 6
Unattended-Upgrade::Allowed-Origins {
        "\${distro_id}:\${distro_codename}";
        "\${distro_id}:\${distro_codename}-security";
        "\${distro_id}ESMApps:\${distro_codename}-apps";
# разрешены: основной репозиторий и, главное, jammy-security`,
        },
        {
          type: 'code',
          title: 'Включатель автоматики и расписание',
          code: `$ cat /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
# "1" = включено: списки обновляются, security-обновления ставятся сами
$ systemctl list-timers apt-daily* --no-pager
NEXT                         LEFT          LAST  PASSED  UNIT
Wed 2025-03-12 06:25:00 MSK  11h left      ...   ...     apt-daily.timer`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Два момента. Первый: не отключайте unattended-upgrades «для скорости» — сэкономленные секунды не стоят дыры в безопасности. Второй: после обновления **ядра** система попросит перезагрузку (файл `/var/run/reboot-required`). Ubuntu 22.04 не перезагружается сама без вашего ведома — но и откладывать перезагрузку на месяцы не стоит.',
        },
        {
          type: 'heading',
          text: 'Проверяем работу сторожа',
        },
        {
          type: 'paragraph',
          text: 'Доверяй, но проверяй. У unattended-upgrades есть режим «пробного запуска»: `--dry-run` показывает, что служба сделала бы, не трогая систему. А журнал её реальных действий пишется в `/var/log/unattended-upgrades/` — мы умеем читать логи и обязательно углубимся в них в конце модуля.',
        },
        {
          type: 'code',
          title: 'Пробный запуск и журнал сторожа',
          code: `$ sudo unattended-upgrade --dry-run 2>&1 | tail -n 3
Allowed origins are: o=Ubuntu,a=jammy-security, o=UbuntuESMApps,a=jammy-apps
No packages found that can be upgraded unattended and no pending auto-removals
$ ls /var/log/unattended-upgrades/
unattended-upgrades.log  unattended-upgrades-shutdown.log
$ tail -n 2 /var/log/unattended-upgrades/unattended-upgrades.log
2025-03-11 06:31:22,391 INFO Packages that will be upgraded: openssl
2025-03-11 06:31:45,022 INFO All upgrades installed`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Схема здоровой системы: `apt update` + `apt upgrade` — время от времени руками; unattended-upgrades — каждый день сам; после обновления ядра — перезагрузка в удобное время. Всё, никакой магии.',
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: чем `apt update` отличается от `apt upgrade`? Откуда Ubuntu 22.04 берёт обновления безопасности? Как узнать, требуется ли перезагрузка?',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Система защищена и латается сама. Следующий шаг заботливого администратора — резервные копии: файрвол и обновления не спасут от случайного `rm` в не той папке или умершего диска.',
        },
      ],
      tasks: [
        {
          title: 'Посмотрите, что ждёт обновления',
          difficulty: 1,
          description:
            'Выполните `sudo apt update`, затем `apt list --upgradable`. Сколько пакетов можно обновить на вашей системе? Найдите среди них те, что приходят из репозитория `jammy-security` — это и есть обновления безопасности.',
          hint: 'Команда `apt list --upgradable` сама подскажет про предупреждение — его можно скрыть через `2>/dev/null`. Репозиторий указан после имени пакета.',
          solution: `$ sudo apt update
...
$ apt list --upgradable 2>/dev/null
openssl/jammy-updates,jammy-security 3.0.2-0ubuntu1.19 amd64 [upgradable from: 3.0.2-0ubuntu1.18]
openssh-client/jammy-updates 1:8.9p1-3ubuntu0.13 amd64 [upgradable from: 1:8.9p1-3ubuntu0.11]
# пометка jammy-security = обновление безопасности,
# jammy-updates = обычное исправление ошибок`,
        },
        {
          title: 'Найдите настройки сторожа',
          difficulty: 2,
          description:
            'Не меняя ничего, изучите два файла: `/etc/apt/apt.conf.d/20auto-upgrades` (включатель) и `/etc/apt/apt.conf.d/50unattended-upgrades` (что именно обновлять). Ответьте письменно: включена ли автоматика и из каких источников разрешено обновление?',
          hint: 'Ищите строки с `"1"` (включено) в первом файле и секцию `Allowed-Origins` во втором. Строки с `//` в начале — комментарии.',
          solution: `$ cat /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";    # списки обновляются: да
APT::Periodic::Unattended-Upgrade "1";      # автообновление: включено
$ grep -m2 "distro_codename" /etc/apt/apt.conf.d/50unattended-upgrades
        "\${distro_id}:\${distro_codename}";
        "\${distro_id}:\${distro_codename}-security";
# автоматика включена, обновляются основной и security-репозитории`,
        },
        {
          title: 'Сделайте пробный запуск сторожа',
          difficulty: 2,
          description:
            'Запустите `sudo unattended-upgrade --dry-run` и прочитайте вывод: собирается ли служба что-то обновлять прямо сейчас? Затем посмотрите её настоящий журнал `/var/log/unattended-upgrades/unattended-upgrades.log` и найдите последнее установленное обновление.',
          hint: 'Флаг `--dry-run` ничего не меняет — это безопасная разведка. Если вывод длинный, прижмите его: `| tail -n 10`.',
          solution: `$ sudo unattended-upgrade --dry-run 2>&1 | tail -n 5
...
No packages found that can be upgraded unattended and no pending auto-removals
# система свежая — сторож проверил и отбой
$ sudo tail -n 5 /var/log/unattended-upgrades/unattended-upgrades.log
2025-03-11 06:31:22,391 INFO Packages that will be upgraded: openssl
2025-03-11 06:31:45,022 INFO All upgrades installed
# а в журнале видно, что вчера он реально поработал`,
        },
        {
          title: 'Проверьте, нужна ли перезагрузка',
          difficulty: 3,
          description:
            'Узнайте, просит ли ваша система перезагрузку после обновлений. Подсказка: об этом сигнализирует само существование файла `/var/run/reboot-required`. Если он есть — посмотрите его содержимое и список пакетов рядом, в файле с расширением `.pkgs`. Объясните, почему после обновления ядра перезагрузка неизбежна.',
          hint: 'Команды: `ls /var/run/reboot-required*` и `cat` на найденные файлы. Ядро — единственная программа, которую нельзя «перезапустить» без перезагрузки всей системы.',
          solution: `$ ls /var/run/reboot-required* 2>/dev/null
/var/run/reboot-required  /var/run/reboot-required.pkgs
$ cat /var/run/reboot-required
*** System restart required ***
$ cat /var/run/reboot-required.pkgs
linux-image-5.15.0-150-generic
# обновилось ядро (linux-image) — заменить его "на лету" нельзя,
# ведь оно и есть работающая система. Значит, планируем перезагрузку
# в удобное время: sudo reboot`,
        },
      ],
      quiz: [
        {
          question: 'Вы зашли на сервер после месяца простоя и хотите установить свежие обновления. Какие две команды и в каком порядке вы выполните?',
          options: [
            '`sudo apt update`, затем `sudo apt upgrade`: сначала обновить списки пакетов, потом установить новые версии',
            '`sudo apt upgrade`, затем `sudo apt update`: порядок не важен',
            '`sudo apt install security-updates` — для этого есть отдельный пакет',
            'Никакие: после месяца простоя проще переустановить систему',
          ],
          correctIndex: 0,
          explanation:
            '`update` обновляет списки доступных версий из репозиториев, а `upgrade` устанавливает новые версии по этим спискам. Если запустить `upgrade` до `update`, система просто не узнает о свежих пакетах, появившихся за месяц простоя.',
        },
        {
          question: 'Что делает пакет unattended-upgrades в Ubuntu 22.04?',
          options: [
            'Отключает все обновления, чтобы не мешали',
            'Автоматически устанавливает обновления безопасности из разрешённых репозиториев',
            'Удаляет старые версии программ',
            'Перезагружает сервер каждую ночь',
          ],
          correctIndex: 1,
          explanation:
            'unattended-upgrades — сторож, который сам ставит обновления из секции -security (и других разрешённых источников). Он установлен и включён в Ubuntu 22.04 по умолчанию.',
        },
        {
          question: 'Откуда Ubuntu 22.04 получает обновления безопасности?',
          options: [
            'Из репозитория jammy-security, который поддерживает команда Canonical',
            'С сайта linux.org вручную',
            'Из магазина snap-приложений',
            'Обновления безопасности не нужны — Linux неуязвим',
          ],
          correctIndex: 0,
          explanation:
            'Для каждого выпуска Ubuntu есть репозиторий с суффиксом -security: jammy-security для 22.04. Именно его unattended-upgrades и разрешает по умолчанию.',
        },
        {
          question: 'Система сообщает о файле `/var/run/reboot-required`. Что это значит?',
          options: [
            'Система сломана, нужна переустановка',
            'Это вирусное сообщение, файл надо удалить',
            'Обновлён пакет (обычно ядро), который нельзя заменить без перезагрузки — стоит её запланировать',
            'Просто напоминание, можно игнорировать вечно',
          ],
          correctIndex: 2,
          explanation:
            'Такой файл появляется после обновления ядра или ключевых библиотек. Работающую систему «подменить под собой» невозможно, поэтому нужна перезагрузка — но в удобное вам время, Ubuntu 22.04 не делает её сама.',
        },
      ],
    },
    {
      id: 'm08-l03',
      title: 'Резервные копии: tar, rsync, автоматизация бэкапов',
      minutes: 30,
      intro:
        'Научитесь делать резервные копии так, как это делают профессионалы: архивы tar, зеркала rsync и скрипт, который всё делает сам. И главное — проверять, что копии реально восстанавливаются.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Диски умирают, пальцы опечатываются, команды ошибаются. Администратора от любителя отличает одно: у администратора есть **резервная копия** (backup). Хорошая новость: инструменты вы уже знаете — `tar` из модуля 3 и `rsync` из прошлого модуля. Осталось собрать из них систему.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Золотое правило бэкапов — «3-2-1»: минимум **3** копии данных, на **2** разных носителях, **1** копия — в другом месте (другой диск, другой компьютер, облако). Одна копия на том же диске — это не копия, а иллюзия.',
        },
        {
          type: 'heading',
          text: 'Что копируем и куда',
        },
        {
          type: 'paragraph',
          text: 'Копировать весь диск не нужно: систему при беде можно переустановить за полчаса, а вот ваши документы, фотографии и конфигурации — невосстановимы. Поэтому копируют данные и настройки, а не программы.',
        },
        {
          type: 'list',
          items: [
            '**Копируем:** `/home` (документы и настройки пользователей), `/etc` (настройки системы), ваши проекты и базы данных',
            '**Не копируем:** `/proc`, `/sys`, `/dev` (виртуальные папки, их создаёт ядро), `/tmp` (временное), кэши',
            '**Куда:** внешний диск, другая машина по сети (привет, rsync по SSH!), облачное хранилище',
          ],
        },
        {
          type: 'heading',
          text: 'Архивы: tar с датой в имени',
        },
        {
          type: 'paragraph',
          text: 'Архив хорош для «снимков на дату»: упаковал папку в один сжатый файл и убрал на полку. Флаги tar вам знакомы: **c**reate, **z** — сжать gzip, **v**erbose, **f** — имя файла. Две хитрости профессионалов: подставлять дату в имя архива подстановкой `$(date +%F)`, чтобы копии не затирали друг друга, и флаг `-C ~` — «сначала перейди в домашнюю папку», тогда пути в архиве будут короткими и распаковать снимок можно куда угодно.',
        },
        {
          type: 'code',
          title: 'Снимок папки документов с датой в имени',
          code: `$ mkdir -p ~/backups
$ tar -czvf ~/backups/documents-$(date +%F).tar.gz -C ~ documents
documents/
documents/report.odt
documents/notes.txt
$ ls -lh ~/backups/
-rw-rw-r-- 1 student student 12K Mar 12 10:00 documents-2025-03-12.tar.gz
$ tar -tzvf ~/backups/documents-2025-03-12.tar.gz   # заглянули внутрь
drwxr-xr-x student/student   0 2025-03-12 09:58 documents/
-rw-r--r-- student/student 5120 2025-03-12 09:58 documents/report.odt`,
        },
        {
          type: 'code',
          title: 'Проверяем, что архив восстанавливается (ритуал, обязательный к исполнению)',
          code: `$ mkdir /tmp/proverka && cd /tmp/proverka
$ tar -xzvf ~/backups/documents-2025-03-12.tar.gz
documents/
documents/report.odt
$ ls documents/
notes.txt  report.odt        # файлы целы — архив рабочий`,
        },
        {
          type: 'heading',
          text: 'Зеркало: rsync для ежедневных копий',
        },
        {
          type: 'paragraph',
          text: 'Для ежедневных копий архивы расточительны — каждый раз упаковывать всё заново. `rsync` решает это: первый раз копирует всё, а дальше — только изменения. Флаг `--delete` делает приёмник точным **зеркалом**: то, что удалили в источнике, удалится и в копии. Удобно, но требует уважения.',
        },
        {
          type: 'code',
          title: 'Сначала репетиция (-n), потом настоящий запуск',
          code: `$ rsync -avn --delete ~/documents/ /media/student/usb/documents/
# -n (dry-run): только показывает, что БУДЕТ сделано
sending incremental file list
deleting old-draft.txt
report.odt
$ rsync -av --delete ~/documents/ /media/student/usb/documents/
sending incremental file list
deleting old-draft.txt
report.odt      5.12K 100%   12.34MB/s    0:00:00
sent 5.3K bytes  received 82 bytes  total size 5.1K`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: '`rsync --delete` зеркалит в обе стороны судьбы: если вы случайно удалили файл в источнике, зеркало честно удалит его и в копии. Поэтому: всегда репетируйте с флагом `-n` перед настоящим запуском и трижды проверяйте, **какая папка источник, а какая — приёмник**. Перепутать их местами — классическая катастрофа новичка.',
        },
        {
          type: 'paragraph',
          text: '**Автоматизируем.** Соберём наши команды в маленький скрипт — по сути, текстовый файл с командами. Расписание для него мы настроим в модуле 9 (там про cron), а пока научимся запускать его вручную. Скрипты лежат в `~/bin` — личной папке для личных инструментов.',
        },
        {
          type: 'code',
          title: 'backup.sh: одна команда — и копия готова',
          code: `$ mkdir -p ~/bin && nano ~/bin/backup.sh
# содержимое файла:
#!/bin/bash
# Резервная копия документов: архив со снимком + зеркало
tar -czf ~/backups/documents-$(date +%F).tar.gz -C ~ documents
rsync -a --delete ~/documents/ /media/student/usb/documents/
echo "Бэкап готов: $(date)"
$ chmod +x ~/bin/backup.sh      # делаем исполняемым
$ ~/bin/backup.sh
Бэкап готов: Wed Mar 12 10:15:30 MSK 2025`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Формула надёжного бэкапа: архивы tar — для истории («как было вчера»), зеркало rsync — для скорости («актуальная копия»), скрипт — чтобы не лениться. И раз в месяц — пробное восстановление в `/tmp`: непроверенная копия не считается копией.',
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя: чем архив tar отличается от зеркала rsync по назначению? Почему в имени архива полезна дата? Что проверяет флаг `-n` у rsync?',
        },
        {
          type: 'paragraph',
          text: 'Копии делаются, система защищена. Остался вопрос: как узнать, что кто-то пытался подобрать пароль к SSH или что служба падала ночью? Ответ — в журналах системы. Им посвящён финальный урок модуля.',
        },
      ],
      tasks: [
        {
          title: 'Сделайте первый архив-снимок',
          difficulty: 1,
          description:
            'Создайте папку `~/backups` и упакуйте любую свою папку (например, `~/documents` или созданную для теста `~/proekt`) в архив с датой в имени: `~/backups/proekt-$(date +%F).tar.gz`. Убедитесь, что архив появился и в имени — сегодняшняя дата.',
          hint: 'Полная команда: `tar -czf ~/backups/proekt-$(date +%F).tar.gz -C ~ proekt`. Подстановка `$(date +%F)` сама вставит дату вроде 2025-03-12.',
          solution: `$ mkdir -p ~/backups ~/proekt && touch ~/proekt/a.txt
$ tar -czf ~/backups/proekt-$(date +%F).tar.gz -C ~ proekt
$ ls -l ~/backups/
-rw-rw-r-- 1 student student 155 Mar 12 10:20 proekt-2025-03-12.tar.gz
# архив на месте, дата в имени — завтрашний снимок его не затрёт`,
        },
        {
          title: 'Проверьте восстановление',
          difficulty: 2,
          description:
            'Докажите, что архив из прошлого задания — рабочий: загляните внутрь (`tar -tzvf`), затем распакуйте его в отдельную папку `/tmp/restore-test` и сравните файлы с оригиналом через `diff -r`.',
          hint: '`diff -r папка1 папка2` сравнивает папки рекурсивно. Молчание diff = файлы идентичны. Не забудьте создать `/tmp/restore-test` и зайти в неё перед распаковкой.',
          solution: `$ tar -tzvf ~/backups/proekt-2025-03-12.tar.gz
proekt/
proekt/a.txt
$ mkdir /tmp/restore-test && cd /tmp/restore-test
$ tar -xzf ~/backups/proekt-2025-03-12.tar.gz
$ diff -r proekt ~/proekt
$                          # diff молчит = копия идентична оригиналу
$ cd ~ && rm -rf /tmp/restore-test   # убираем за собой (в /tmp это безопасно)`,
        },
        {
          title: 'Настройте зеркало с репетицией',
          difficulty: 2,
          description:
            'Создайте зеркало папки `~/proekt` в `~/backups/proekt-mirror/` командой rsync. Сначала обязательно выполните репетицию с флагами `-avn --delete`, прочитайте, что собирается делать rsync, и только потом запустите по-настоящему. Затем измените один файл и повторите — убедитесь, что скопировался только он.',
          hint: 'Формат: `rsync -avn --delete ~/proekt/ ~/backups/proekt-mirror/` — слеш в конце источника означает «содержимое папки». Репетиция и настоящий запуск отличаются только флагом `n`.',
          solution: `$ rsync -avn --delete ~/proekt/ ~/backups/proekt-mirror/
sending incremental file list
a.txt                            # репетиция: будет скопирован 1 файл
$ rsync -av --delete ~/proekt/ ~/backups/proekt-mirror/
sending incremental file list
a.txt            0 100%    0.00kB/s    # по-настоящему
$ echo "правка" >> ~/proekt/a.txt && touch ~/proekt/b.txt
$ rsync -av --delete ~/proekt/ ~/backups/proekt-mirror/
sending incremental file list
a.txt  b.txt                     # ушли только изменившийся и новый`,
        },
        {
          title: 'Напишите свой backup.sh',
          difficulty: 3,
          description:
            'Напишите скрипт `~/bin/backup.sh`, который: 1) создаёт архив `~/proekt` с датой в имени в `~/backups/`; 2) обновляет зеркало `~/backups/proekt-mirror/` через rsync; 3) печатает строку-отчёт с датой. Сделайте скрипт исполняемым, запустите и проверьте оба результата.',
          hint: 'Первая строка скрипта — `#!/bin/bash` (она говорит системе, чем выполнять файл). Команды внутри — те же, что вы уже выполняли руками. Не забудьте `chmod +x`.',
          solution: `$ mkdir -p ~/bin && nano ~/bin/backup.sh
# содержимое:
#!/bin/bash
tar -czf ~/backups/proekt-$(date +%F).tar.gz -C ~ proekt
rsync -a --delete ~/proekt/ ~/backups/proekt-mirror/
echo "Готово: $(date '+%F %T')"
$ chmod +x ~/bin/backup.sh
$ ~/bin/backup.sh
Готово: 2025-03-12 10:30:45
$ ls ~/backups/ && ls ~/backups/proekt-mirror/
proekt-2025-03-12.tar.gz  proekt-mirror
a.txt  b.txt              # и архив, и зеркало на месте`,
        },
      ],
      quiz: [
        {
          question: 'В чём суть правила «3-2-1» для резервных копий?',
          options: [
            'Копировать данные 3 раза в день, 2 раза в неделю, 1 раз в месяц',
            'Три копии данных, на двух разных носителях, одна — в другом месте',
            'Три папки, два диска, один пароль на архив',
            'Архивировать 3% данных, сжимать в 2 раза, хранить 1 год',
          ],
          correctIndex: 1,
          explanation:
            '3-2-1 — классика надёжности: минимум три копии, минимум два разных носителя (диск компьютера + внешний диск), минимум одна копия территориально в другом месте. Тогда ни пожар, ни умерший диск, ни опечатка не страшны.',
        },
        {
          question: 'Зачем в имени архива подстановка `$(date +%F)`?',
          options: [
            'Чтобы tar работал быстрее',
            'Чтобы каждый снимок имел уникальное имя с датой и не затирал вчерашний',
            'Это шифрует архив текущей датой',
            'Без этого tar не создаст архив',
          ],
          correctIndex: 1,
          explanation:
            'Подстановка вставляет в имя дату вроде 2025-03-12. Архивы за разные дни не перезаписывают друг друга — получается история снимков, из которой можно достать «как было вчера».',
        },
        {
          question: 'Что делает флаг `-n` у rsync и зачем он перед `--delete`?',
          options: [
            'Ускоряет копирование по сети',
            'Сжимает файлы перед отправкой',
            'Репетиция (dry-run): показывает, что rsync СДЕЛАЕТ, ничего не меняя — страховка перед опасным --delete',
            'Запрещает удаление файлов',
          ],
          correctIndex: 2,
          explanation:
            '`rsync -avn` только печатает план действий. С `--delete` это критично: вы заранее увидите строки `deleting ...` и успеете заметить, если перепутали источник с приёмником.',
        },
        {
          question: 'Чем по назначению отличаются архив tar и зеркало rsync?',
          options: [
            'Ничем, это два имени одного инструмента',
            'tar — снимок «на дату» для истории и долгого хранения; rsync — актуальная копия, быстрая для ежедневного обновления',
            'tar работает только локально, rsync — только по сети',
            'tar удаляет оригиналы, rsync — нет',
          ],
          correctIndex: 1,
          explanation:
            'Архив — это «фотография» папки на дату: компактно, хранится годами. Зеркало — живой двойник, который rsync быстро подравнивает под оригинал, передавая только изменения. Они дополняют друг друга.',
        },
      ],
    },
    {
      id: 'm08-l04',
      title: 'Логи и аудит: journalctl, /var/log, fail2ban',
      minutes: 30,
      intro:
        'Научитесь читать «бортовой самописец» системы: находить ошибки в journalctl, ориентироваться в /var/log и ставить fail2ban — автоматического вышибалу для любителей подбирать пароли.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Файрвол стоит, обновления ставятся, копии делаются. Но администратор должен знать, что происходит у него «за спиной»: кто пытался войти по SSH, почему служба перезапустилась ночью, не сыплет ли диск ошибками. Всё это записано в **журналах** (логах) — дневнике, который система ведёт непрерывно.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Логи — это бортовой самописец самолёта. Каждое событие — строка с отметкой времени: «служба запустилась», «попытка входа отклонена», «диск ответил с ошибкой». После любой «турбулентности» первым делом смотрят именно сюда.',
        },
        {
          type: 'heading',
          text: 'journalctl: журнал systemd',
        },
        {
          type: 'paragraph',
          text: 'В Ubuntu 22.04 службы пишут журнал через **journald**, а читаем мы его командой **journalctl**. Без параметров она вывалит всё с начала времён — поэтому журнал почти всегда «прижимают» фильтрами: `-b` — только текущая загрузка, `-u имя` — только одна служба, `-p err` — только ошибки, `--since` — за период, `-f` — следить в реальном времени.',
        },
        {
          type: 'code',
          title: 'Ошибки за текущую загрузку и журнал службы SSH',
          code: `$ journalctl -b -p err --no-pager
Mar 12 08:14:01 ubuntu systemd[1]: Failed to start Disk Manager.
Mar 12 08:14:02 ubuntu bluetoothd[712]: sap-server: Operation not permitted
$ journalctl -u ssh --since today --no-pager
Mar 12 09:40:15 ubuntu sshd[1201]: Accepted publickey for student from 127.0.0.1
Mar 12 09:41:03 ubuntu sshd[1201]: Disconnected from user student 127.0.0.1`,
        },
        {
          type: 'code',
          title: 'Следим за журналом в реальном времени',
          code: `$ journalctl -f -u ssh
Mar 12 10:02:11 ubuntu sshd[1350]: Failed password for invalid user admin from 203.0.113.7
Mar 12 10:02:14 ubuntu sshd[1350]: Failed password for invalid user admin from 203.0.113.7
# кто-то из интернета перебирает пароли! остановка просмотра: Ctrl+C`,
        },
        {
          type: 'heading',
          text: 'Классика: каталог /var/log',
        },
        {
          type: 'paragraph',
          text: 'Параллельно с journald живут и классические текстовые журналы в `/var/log/` — многие программы пишут туда напрямую. Чтобы логи не разрастались бесконечно, их архивирует служба **logrotate**: старые файлы сжимаются и получают суффиксы `.1`, `.2.gz` и так далее.',
        },
        {
          type: 'code',
          title: 'Карта /var/log и чтение журнала авторизаций',
          code: `$ ls /var/log/
auth.log  dpkg.log  kern.log  syslog  apt/  unattended-upgrades/  ...
$ sudo tail -n 4 /var/log/auth.log
Mar 12 10:02:11 ubuntu sshd[1350]: Failed password for invalid user admin from 203.0.113.7 port 51244 ssh2
Mar 12 10:02:14 ubuntu sshd[1350]: Failed password for invalid user admin from 203.0.113.7 port 51244 ssh2
Mar 12 10:05:00 ubuntu sudo:  student : TTY=pts/0 ; PWD=/home/student ; COMMAND=/usr/bin/tail`,
        },
        {
          type: 'paragraph',
          text: 'Заметьте: `auth.log` — это журнал «кто и как входил в систему», включая каждое использование `sudo`. А журналы `journalctl` и `/var/log/auth.log` показывают одни и те же события SSH — просто из двух разных записных книжек.',
        },
        {
          type: 'heading',
          text: 'fail2ban: автоматический вышибала',
        },
        {
          type: 'paragraph',
          text: 'Строки «Failed password» из интернета — это боты, перебирающие пароли. Вручную за ними не уследишь, поэтому ставят **fail2ban**: служба сама читает логи и после нескольких неудачных попыток **банит** адрес обидчика через файрвол — как вышибала, который запоминает лица дебоширов.',
        },
        {
          type: 'code',
          title: 'Ставим и настраиваем вышибалу для SSH',
          code: `$ sudo apt install -y fail2ban
...
$ sudo nano /etc/fail2ban/jail.local
# содержимое файла (свои настройки кладём в .local, не трогая .conf):
[sshd]
enabled = true
maxretry = 3
bantime = 1h
ignoreip = 127.0.0.1 192.168.1.0/24
$ sudo systemctl enable --now fail2ban
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Currently banned: 1
|  +- 203.0.113.7
+- Total banned: 1`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Обязательно впишите в `ignoreip` свой адрес или домашнюю подсеть — иначе три опечатки в пароле забанят вас самих. И помните: fail2ban — дополнение к ключам SSH из прошлого модуля, а не замена. Если вход по паролю отключён, боты бьются в закрытую дверь, а fail2ban просто убирает их шум из логов.',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Чек-лист «что-то не так» у администратора: 1) `journalctl -b -p err` — ошибки за загрузку; 2) `journalctl -u служба` — журнал конкретной службы; 3) `/var/log/auth.log` — кто входил; 4) `fail2ban-client status sshd` — кого вышибала уже выставил за дверь.',
        },
        {
          type: 'heading',
          text: 'Итог и что дальше',
        },
        {
          type: 'paragraph',
          text: 'Модуль «Безопасность и надёжность» пройден: файрвол закрывает лишнее, обновления латают дыры, бэкапы страхуют от потерь, логи и fail2ban держат вас в курсе событий. Вы полноценный Администратор! Впереди ранг «Профессионал»: модуль 9 научит писать bash-скрипты и запускать их по расписанию — в том числе наш backup.sh из этого модуля.',
        },
      ],
      tasks: [
        {
          title: 'Найдите ошибки текущей загрузки',
          difficulty: 1,
          description:
            'Выполните `journalctl -b -p err --no-pager` и разберите первые три строки: кто пожаловался (имя службы перед двоеточием) и на что. Даже если ошибок нет — это отличный результат, запишите его.',
          hint: 'Формат строки: дата, имя компьютера, служба[PID], текст. Флаг `--no-pager` выводит всё сразу, не открывая прокрутку less.',
          solution: `$ journalctl -b -p err --no-pager
Mar 12 08:14:01 ubuntu systemd[1]: Failed to start Disk Manager.
Mar 12 08:14:02 ubuntu bluetoothd[712]: sap-server: Operation not permitted
# читаем: systemd не смог запустить Disk Manager,
# bluetoothd не получил разрешение на sap-server.
# обе ошибки типичны для виртуалки и не критичны`,
        },
        {
          title: 'История входов по SSH',
          difficulty: 2,
          description:
            'Выведите журнал службы ssh за сегодня: `journalctl -u ssh --since today --no-pager`. Найдите свои успешные входы (строки `Accepted`) и проверьте, нет ли чужих попыток (строки `Failed password`). Если SSH-сервер у вас не установлен — установите его, как в модуле 7.',
          hint: 'Если журнал пуст — возможно, служба называется `ssh` неактивна: проверьте `systemctl is-active ssh`. Свои учебные подключения к 127.0.0.1 тоже оставляют следы.',
          solution: `$ systemctl is-active ssh
active
$ journalctl -u ssh --since today --no-pager
Mar 12 09:40:15 ubuntu sshd[1201]: Accepted publickey for student from 127.0.0.1
Mar 12 10:02:11 ubuntu sshd[1350]: Failed password for invalid user admin from 203.0.113.7
# Accepted — это мы сами по ключу, а Failed от "invalid user admin" —
# бот из интернета; хорошо, что у нас вход по ключам`,
        },
        {
          title: 'Расследование в auth.log',
          difficulty: 2,
          description:
            'Найдите в `/var/log/auth.log` все сегодняшние запуски `sudo` на вашей машине. Подсказка: понадобится связка `grep` с `sudo tail` или `sudo grep` — файл читается только суперпользователем.',
          hint: '`sudo grep sudo /var/log/auth.log | grep COMMAND` покажет строки вида «student : COMMAND=...». Добавьте `| tail`, если строк много.',
          solution: `$ sudo grep "COMMAND" /var/log/auth.log | tail -n 5
Mar 12 10:05:00 ubuntu sudo: student : TTY=pts/0 ; COMMAND=/usr/bin/tail /var/log/auth.log
Mar 12 10:20:33 ubuntu sudo: student : TTY=pts/0 ; COMMAND=/usr/bin/apt update
# видно: кто (student), откуда (pts/0) и что запускал через sudo.
# так администратор отвечает на вопрос "кто это сделал?"`,
        },
        {
          title: 'Поставьте вышибалу',
          difficulty: 3,
          description:
            'Установите fail2ban, создайте `/etc/fail2ban/jail.local` с секцией `[sshd]`: включите её, ограничьте до 3 попыток и обязательно впишите `ignoreip = 127.0.0.1`. Запустите службу и проверьте статус джейла sshd.',
          hint: 'Порядок: `apt install fail2ban` → `nano /etc/fail2ban/jail.local` → `systemctl enable --now fail2ban` → `fail2ban-client status sshd`. Не редактируйте jail.conf — свои настройки кладут в jail.local.',
          solution: `$ sudo apt install -y fail2ban
$ sudo nano /etc/fail2ban/jail.local
# содержимое:
[sshd]
enabled = true
maxretry = 3
bantime = 1h
ignoreip = 127.0.0.1
$ sudo systemctl enable --now fail2ban
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Currently banned: 0      # пока никого нет — и хорошо
+- Total banned: 0
# вышибала на посту: три неверных пароля — и адрес в бане на час`,
        },
      ],
      quiz: [
        {
          question: 'Как посмотреть только ошибки службы ssh за сегодня?',
          options: [
            'journalctl -u ssh -p err --since today',
            'cat /etc/ssh/errors.log',
            'journalctl --delete ssh',
            'ss -tuln | grep ssh',
          ],
          correctIndex: 0,
          explanation:
            'Фильтры journalctl комбинируются: `-u ssh` — только служба ssh, `-p err` — только приоритет «ошибка», `--since today` — за сегодня. Отдельного файла errors.log для SSH не существует.',
        },
        {
          question: 'Что записывается в `/var/log/auth.log`?',
          options: [
            'Ошибки ядра Linux',
            'События авторизации: входы по SSH, запуски sudo, смена пользователей',
            'История установленных пакетов',
            'Список открытых портов',
          ],
          correctIndex: 1,
          explanation:
            'auth.log — журнал «кто и как входил»: попытки SSH, каждый запуск sudo с указанием команды. История пакетов — в /var/log/dpkg.log, ошибки ядра — в kern.log.',
        },
        {
          question: 'Как работает fail2ban?',
          options: [
            'Шифрует пароли пользователей',
            'Меняет порт SSH каждый час',
            'Читает логи и после нескольких неудачных попыток входа блокирует адрес обидчика через файрвол',
            'Удаляет пользователей со слабыми паролями',
          ],
          correctIndex: 2,
          explanation:
            'fail2ban следит за журналами (например, auth.log) и при maxretry неудачных попыток добавляет IP-адрес в бан на время bantime. Это «вышибала», а не замена ключам SSH.',
        },
        {
          question: 'Зачем в jail.local пишут `ignoreip = 127.0.0.1` и свою подсеть?',
          options: [
            'Чтобы fail2ban не проверял эти адреса и случайно не забанил самого администратора',
            'Чтобы ускорить работу службы',
            'Это адреса, которые нужно забанить первыми',
            'Без ignoreip fail2ban не запустится',
          ],
          correctIndex: 0,
          explanation:
            'ignoreip — «белый список»: с этих адресов ошибки входа не приводят к бану. Иначе три опечатки в собственном пароле заблокируют вас на время bantime.',
        },
      ],
    },
  ],
};
