import type { CourseModule } from '../types';

export const m05: CourseModule = {
  id: 'm05',
  number: 5,
  title: 'Управление программами',
  rank: 'Уверенный',
  description:
    'Откуда берутся программы в Linux и как ими управлять: пакетный менеджер APT, репозитории и PPA, форматы .deb, snap и flatpak, и даже сборка программы из исходников. После этого модуля вы сможете установить в Ubuntu всё, что угодно, — и понимать, как это работает.',
  lessons: [
    {
      id: 'm05-l01',
      title: 'APT: устанавливаем, обновляем, удаляем',
      minutes: 25,
      intro:
        'Освоите главный инструмент установки программ в Ubuntu — пакетный менеджер APT. Научитесь искать, ставить, обновлять и удалять программы одной командой — быстрее, чем в любом «магазине приложений».',
      blocks: [
        {
          type: 'paragraph',
          text: 'В прошлом модуле вы разобрались с пользователями и правами — теперь `sudo` для вас не заклинание, а понятный инструмент. Он нам сегодня пригодится: установка программ меняет системные папки, поэтому требует прав администратора. А сами программы мы будем ставить через **APT** (Advanced Packaging Tool) — пакетный менеджер Ubuntu.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Пакетный менеджер — это как App Store или Google Play, только старше и умнее. **Пакет** — аккуратно упакованная программа со всеми её файлами и списком «ингредиентов» (зависимостей). APT сам скачивает пакет, доустанавливает всё, что ему нужно, и расставляет файлы по правильным папкам.',
        },
        {
          type: 'heading',
          text: 'Святая святых: apt update и apt upgrade',
        },
        {
          type: 'paragraph',
          text: 'APT хранит на вашем компьютере **каталог пакетов** — список всех программ, доступных в репозиториях Ubuntu, с номерами версий. Прежде чем что-то ставить или обновлять, каталог нужно освежить командой `sudo apt update`. Она ничего не устанавливает — только скачивает свежие списки.',
        },
        {
          type: 'code',
          title: 'Обновляем каталог пакетов',
          code: `$ sudo apt update
[sudo] password for student:
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
Get:3 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 229 kB in 1s (315 kB/s)
Reading package lists... Done
12 packages can be upgraded. Run 'apt list --upgradable' to see them.`,
        },
        {
          type: 'paragraph',
          text: 'Видите последнюю строку? APT честно говорит: «12 packages can be upgraded» — «12 пакетов можно обновить». (Вывод команд на английском — это норма: так проще искать ответы в интернете, и все примеры курса совпадут с вашими один-в-один.) Обновляют сами программы командой `sudo apt upgrade`. Запомните пару: `update` — обновить **списки** пакетов, `upgrade` — обновить **сами** пакеты. Сначала всегда `update`, иначе система может не знать о свежих версиях. Часто эти две команды записывают вместе через `&&`: вторая выполнится, только если первая прошла успешно.',
        },
        {
          type: 'code',
          title: 'Классическая связка: освежить каталог и обновить систему',
          code: `$ sudo apt update && sudo apt upgrade
...
The following packages will be upgraded:
  firefox libssl3 openssl snapd
4 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 84.2 MB of archives.
After this operation, 1024 kB of additional disk space will be used.
Do you want to continue? [Y/n] y      # нажимаем Enter — согласны`,
        },
        {
          type: 'heading',
          text: 'Ищем и устанавливаем программы',
        },
        {
          type: 'paragraph',
          text: 'Не знаете точного имени пакета? Поищите по описанию: `apt search ключевое_слово`. А когда имя известно, ставьте: `sudo apt install имя`. Давайте установим `htop` — красивый монитор процессов, он понадобится нам в следующем модуле.',
        },
        {
          type: 'code',
          title: 'Ищем, смотрим информацию и ставим',
          code: `$ apt search htop
Sorting... Done
Full Text Search... Done
htop/jammy 3.0.5-7build2 amd64
  interactive processes viewer
$ apt show htop        # подробности: версия, размер, описание
Package: htop
Version: 3.0.5-7build2
Installed-Size: 399 kB
$ sudo apt install htop
...
The following NEW packages will be installed:
  htop
Do you want to continue? [Y/n] y
Setting up htop (3.0.5-7build2) ...`,
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Заметьте: вы не ходили на сайт, не качали установщик и не жали «Далее, далее, готово». Одна команда — и программа на месте. Более того, APT сам скачал бы и **зависимости** — библиотеки, без которых программа не заработает.',
        },
        {
          type: 'heading',
          text: 'Удаляем: два уровня чистоты',
        },
        {
          type: 'paragraph',
          text: 'Удалить программу — `sudo apt remove имя`. Но у программы часто остаются конфигурационные файлы в `/etc` — вдруг вы её вернёте? Если хотите вычистить всё включая настройки, добавьте флаг `--purge`. А команда `sudo apt autoremove` убирает «сирот» — зависимости, которые больше никому не нужны.',
        },
        {
          type: 'code',
          title: 'Три уровня удаления на примере git',
          code: `$ sudo apt install git         # git потянул за собой вспомогательные пакеты
...
The following additional packages will be installed:
  git-man liberror-perl
$ sudo apt remove git         # удалить программу, настройки оставить
The following packages will be REMOVED:
  git
$ sudo apt remove --purge git # удалить вместе с настройками
$ sudo apt autoremove         # подмести зависимости, оставшиеся «сиротами»
The following packages will be REMOVED:
  git-man liberror-perl
0 upgraded, 0 newly installed, 2 to remove and 0 not upgraded.`,
        },
        {
          type: 'table',
          headers: ['Команда', 'Что делает'],
          rows: [
            ['sudo apt update', 'Обновляет каталог пакетов (списки)'],
            ['sudo apt upgrade', 'Обновляет установленные программы'],
            ['apt search слово', 'Ищет пакет по имени и описанию'],
            ['apt show имя', 'Показывает подробности о пакете'],
            ['sudo apt install имя', 'Устанавливает пакет и его зависимости'],
            ['sudo apt remove имя', 'Удаляет программу, оставляя настройки'],
            ['sudo apt autoremove', 'Удаляет ненужные зависимости-«сироты»'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Будьте осторожны с `remove` для системных пакетов. Если APT предлагает удалить пару сотен пакетов со словами `ubuntu-desktop` или `linux-image` — нажмите `n` и перечитайте список. Удалить браузер безболезненно, удалить графическое окружение — нет.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Вы умеете ставить, обновлять и удалять программы — ежедневный минимум администратора готов. Но откуда APT вообще знает, где лежат эти пакеты? В следующем уроке откроем капот: репозитории, их компоненты и PPA — личные архивы пакетов для самых свежих версий.',
        },
      ],
      tasks: [
        {
          title: 'Освежите каталог пакетов',
          difficulty: 1,
          description:
            'Выполните `sudo apt update` и найдите в выводе строку про пакеты, которые можно обновить. Затем командой `apt list --upgradable` посмотрите их список. Ничего устанавливать пока не нужно.',
          hint: 'Флаг `--upgradable` покажет только те пакеты, для которых есть новая версия. Помните: `apt list` не требует `sudo`.',
          solution: `$ sudo apt update
...
12 packages can be upgraded.
$ apt list --upgradable
Listing... Done
firefox/jammy-updates 124.0.1-0ubuntu0.22.04.1 amd64 [upgradable from: 123.0...]
openssl/jammy-updates 3.0.2-0ubuntu1.15 amd64 [upgradable from: 3.0.2-0ubuntu1.14]`,
        },
        {
          title: 'Установите и найдите программу',
          difficulty: 2,
          description:
            'Найдите в репозиториях терминальный «древовидный» просмотрщик каталогов `tree` (подсказка: поищите `apt search tree`). Установите его и проверьте работу: выполните `tree /etc/apt | head`. После этого удалите пакет вместе с конфигурацией.',
          hint: 'Последовательность: search → install → проверка → remove с флагом полной очистки. Вспомните, какой флаг удаляет и настройки тоже.',
          solution: `$ apt search "^tree$"     # точное имя
Sorting... Done
tree/jammy 2.0.2-1 amd64
  displays directory tree, in color
$ sudo apt install tree
$ tree /etc/apt | head
/etc/apt
├── apt.conf.d
│   ├── 01autoremove
$ sudo apt remove --purge tree
The following packages will be REMOVED:
  tree*`,
        },
        {
          title: 'Узнайте, кому принадлежит файл',
          difficulty: 2,
          description:
            'Команда `apt-file` в базовой системе отсутствует, но узнать, какой пакет установил файл, можно и без неё. Установите `curl`, а затем выясните, какие пакеты установили файлы `/usr/bin/curl` и `/usr/bin/ls` — используйте `dpkg -S` (это «подпольный» помощник APT, детально про него — в уроке m05-l03).',
          hint: 'Синтаксис: `dpkg -S /полный/путь/к/файлу`. Он ищет по базе установленных пакетов.',
          solution: `$ sudo apt install curl
$ dpkg -S /usr/bin/curl
curl: /usr/bin/curl          # пакет: файл
$ dpkg -S /usr/bin/ls
coreutils: /usr/bin/ls       # даже ls — часть пакета!`,
        },
        {
          title: 'Мини-аудит системы',
          difficulty: 3,
          description:
            'Проведите «ревизию»: 1) узнайте, сколько всего пакетов установлено в системе (`apt list --installed | wc -l`); 2) обновите систему через связку `update && upgrade`; 3) после обновления выполните `sudo apt autoremove` и сравните, изменилось ли количество установленных пакетов. Кратко запишите результаты в файл `~/audit.txt` через `echo` и `>>`.',
          hint: 'Перенаправление `>>` дописывает в конец файла, не затирая его — это было в модуле m03. Каждый этап добавляйте отдельной строкой.',
          solution: `$ apt list --installed 2>/dev/null | wc -l
2143
$ echo "Пакетов до обновления: 2143" > ~/audit.txt
$ sudo apt update && sudo apt upgrade -y
...
$ sudo apt autoremove -y
...
$ apt list --installed 2>/dev/null | wc -l
2139
$ echo "Пакетов после чистки: 2139" >> ~/audit.txt
$ cat ~/audit.txt
Пакетов до обновления: 2143
Пакетов после чистки: 2139`,
        },
      ],
      quiz: [
        {
          question: 'Вы только что установили Ubuntu и хотите поставить программу `gimp`. Что сделать сначала?',
          options: [
            'Сразу sudo apt install gimp',
            'Сначала sudo apt update, чтобы освежить каталог пакетов',
            'Сначала скачать установщик с сайта программы',
            'Сначала sudo apt upgrade, чтобы обновить всю систему',
          ],
          correctIndex: 1,
          explanation:
            'На свежей системе локальный каталог пакетов может быть устаревшим или пустым — install может не найти пакет или поставить старую версию. Правильная привычка: сначала `sudo apt update`, потом install.',
        },
        {
          question: 'Чем отличается `apt update` от `apt upgrade`?',
          options: [
            'Ничем, это синонимы',
            'update обновляет списки пакетов, upgrade — сами установленные программы',
            'update работает без sudo, а upgrade требует sudo',
            'upgrade обновляет только ядро Linux',
          ],
          correctIndex: 1,
          explanation:
            '`update` скачивает свежие каталоги из репозиториев (кто есть и каких версий), а `upgrade` по этим каталогам обновляет установленные программы. Поэтому update всегда идёт первым.',
        },
        {
          question: 'Вы удалили программу через `sudo apt remove`, а через месяц установили снова — и все её настройки сохранились. Почему?',
          options: [
            'Программа восстановила настройки из интернета',
            'remove без флага --purge оставляет конфигурационные файлы в системе',
            'Это ошибка: настройки должны были удалиться',
            'Настройки хранились в корзине',
          ],
          correctIndex: 1,
          explanation:
            'По умолчанию `apt remove` удаляет только файлы программы, но бережёт конфигурацию — вдруг пакет вернут. Полная зачистка: `sudo apt remove --purge имя`.',
        },
        {
          question: 'Для чего нужна команда `sudo apt autoremove`?',
          options: [
            'Удаляет все программы, которые вы не запускали месяц',
            'Автоматически обновляет систему каждый день',
            'Удаляет зависимости-«сироты», которые больше никому не нужны',
            'Чистит кэш скачанных .deb-файлов',
          ],
          correctIndex: 2,
          explanation:
            'Когда вы удаляете программу, библиотеки-зависимости, поставленные ради неё, остаются. `autoremove` находит такие «сироты» и удаляет их, освобождая место.',
        },
        {
          question: 'APT предлагает удалить 250 пакетов, среди которых `ubuntu-desktop`. Ваши действия?',
          options: [
            'Согласиться: APT знает лучше',
            'Отказаться (n) и разобраться: удаление ubuntu-desktop убьёт графическое окружение',
            'Перезагрузиться, тогда вопрос отпадёт сам',
            'Удалить apt, чтобы он больше так не предлагал',
          ],
          correctIndex: 1,
          explanation:
            '`ubuntu-desktop` — метапакет, тянущий за собой всё графическое окружение. Такое массовое удаление почти наверняка оставит вас с чёрным экраном и мигающим курсором. Всегда читайте список перед ответом Y.',
        },
      ],
    },
    {
      id: 'm05-l02',
      title: 'Репозитории и PPA: откуда берутся программы',
      minutes: 25,
      intro:
        'Узнаете, откуда APT скачивает пакеты, как устроены официальные репозитории Ubuntu и что делать, если нужной программы в них нет — подключать PPA и сторонние источники.',
      blocks: [
        {
          type: 'paragraph',
          text: 'В прошлом уроке вы командовали APT, как опытный дирижёр: `update`, `install`, `remove`. Осталось понять главное: **откуда** он качает программы? Ответ: из **репозиториев** — серверов-хранилищ пакетов. Список этих серверов прописан прямо в вашей системе.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Репозиторий — это как склад интернет-магазина. APT — курьерская служба: у неё есть адреса складов (список репозиториев) и каталог товаров на каждом. Вы говорите «хочу htop» — курьер едет на склад, забирает товар и все нужные детали к нему.',
        },
        {
          type: 'heading',
          text: 'Где живут адреса репозиториев',
        },
        {
          type: 'paragraph',
          text: 'Главный файл со списком источников — `/etc/apt/sources.list`. В Ubuntu 22.04 дополнительные источники кладут отдельными файлами в папку `/etc/apt/sources.list.d/` — так аккуратнее. Посмотрим, что там внутри.',
        },
        {
          type: 'code',
          title: 'Заглядываем в адресную книгу APT',
          code: `$ cat /etc/apt/sources.list | grep -v "^#" | grep .
deb http://archive.ubuntu.com/ubuntu jammy main restricted
deb http://archive.ubuntu.com/ubuntu jammy-updates main restricted
deb http://archive.ubuntu.com/ubuntu jammy universe
deb http://archive.ubuntu.com/ubuntu jammy multiverse
deb http://security.ubuntu.com/ubuntu jammy-security main restricted
$ ls /etc/apt/sources.list.d/
# пусто — сторонних источников пока не подключали`,
        },
        {
          type: 'paragraph',
          text: 'Каждая строка читается так: `deb` — репозиторий с готовыми (бинарными) пакетами; адрес сервера; `jammy` — кодовое имя Ubuntu 22.04 (все её пакеты собраны именно под jammy); в конце — **компоненты**, разделы хранилища.',
        },
        {
          type: 'table',
          headers: ['Компонент', 'Что внутри', 'Поддержка'],
          rows: [
            ['main', 'Свободные программы, официально поддерживаемые Canonical', 'Полная, 5 лет'],
            ['restricted', 'Проприетарные драйверы (например, NVIDIA)', 'Частичная'],
            ['universe', 'Свободные программы от сообщества (большинство пакетов!)', 'Сообщество'],
            ['multiverse', 'Свободные, но с лицензионными ограничениями (кодеки, шрифты)', 'Минимальная'],
          ],
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Суффиксы репозитория: `jammy` — основной, `jammy-updates` — обновления программ, `jammy-security` — срочные заплатки безопасности, `jammy-backports` — новые версии, перенесённые из будущих выпусков. Security-источник должен быть включён всегда!',
        },
        {
          type: 'heading',
          text: 'PPA: личные архивы пакетов',
        },
        {
          type: 'paragraph',
          text: 'А если программы нет в официальных репозиториях или версия там древняя? Разработчики выкладывают свежие сборки в **PPA** (Personal Package Archive) — личные архивы пакетов на площадке Launchpad. Подключается PPA одной командой: `sudo add-apt-repository ppa:автор/название`. Запомните два правила: после добавления любого источника обязателен `sudo apt update` — иначе APT не узнает о новом «складе»; а отключается PPA той же командой с флагом `--remove`.',
        },
        {
          type: 'code',
          title: 'Подключаем PPA и ставим свежую программу',
          code: `$ sudo add-apt-repository ppa:graphics-drivers/ppa
Repository: 'deb https://ppa.launchpadcontent.net/.../ubuntu/ jammy main'
Description: Proprietary GPU Drivers PPA
Adding repository.
Press [ENTER] to continue or Ctrl-c to cancel.
$ sudo apt update      # обязательно! учим APT о новом складе
$ sudo apt install имя-программы
...`,
        },
        {
          type: 'code',
          title: 'Смотрим источники и убираем лишний',
          code: `$ ls /etc/apt/sources.list.d/
graphics-drivers-ubuntu-ppa-jammy.list    # появился новый файл
$ sudo add-apt-repository --remove ppa:graphics-drivers/ppa
$ sudo apt update        # не забываем освежить каталог`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'PPA — это доверие незнакомцу. Устанавливая пакеты из чужого архива, вы даёте его автору фактически полный доступ к системе. Подключайте только известные PPA от разработчиков программы, и никогда — по случайной инструкции с форума без проверки.',
        },
        {
          type: 'heading',
          text: 'Как выглядит идеальный рецепт установки',
        },
        {
          type: 'list',
          items: [
            '**Шаг 1.** Проверить официальные репозитории: `apt search имя` — нашлось? Ставим и радуемся',
            '**Шаг 2.** Не нашлось или версия старая — ищем официальный PPA на сайте программы',
            '**Шаг 3.** Подключаем: `sudo add-apt-repository ppa:...` и `sudo apt update`',
            '**Шаг 4.** Устанавливаем: `sudo apt install имя`',
            '**Шаг 5.** Если и PPA нет — смотрим snap/flatpak или сборку из исходников (следующие уроки)',
          ],
        },
        {
          type: 'callout',
          variant: 'check',
          text: 'Проверьте себя вслух: чем компонент `main` отличается от `universe`? Почему после добавления PPA обязателен `apt update`? Если ответили — двигаемся дальше.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Теперь вы понимаете всю цепочку поставки программ в Ubuntu. Но репозитории и APT — не единственный путь. В следующем уроке сравним три формата установки: классические `.deb` и `dpkg`, самодостаточные `snap` и независимые `flatpak` — и научимся выбирать нужный.',
        },
      ],
      tasks: [
        {
          title: 'Изучите свои источники',
          difficulty: 1,
          description:
            'Посмотрите, из каких репозиториев ваша система получает пакеты: выведите содержимое `/etc/apt/sources.list` без комментариев и загляните в `/etc/apt/sources.list.d/`. Подсчитайте, сколько раз встречается компонент `universe`.',
          hint: 'Комбинируйте `cat`, `grep -v "^#"` и `wc -l`. Компонент universe можно посчитать через `grep -c`.',
          solution: `$ grep -v "^#" /etc/apt/sources.list | grep .
deb http://archive.ubuntu.com/ubuntu jammy main restricted
deb http://archive.ubuntu.com/ubuntu jammy-updates main restricted
...
$ ls /etc/apt/sources.list.d/
$ grep -v "^#" /etc/apt/sources.list | grep -c universe
4        # universe встречается в 4 строках`,
        },
        {
          title: 'Включите компонент multiverse',
          difficulty: 2,
          description:
            'Пакет `unar` (распаковщик архивов) живёт в компоненте `universe`, а вот некоторые кодеки — в `multiverse`. Включите multiverse командой `sudo add-apt-repository multiverse`, обновите каталог и убедитесь, что пакет `ttf-mscorefonts-installer` (популярные шрифты) теперь находится поиском.',
          hint: '`add-apt-repository` умеет добавлять не только PPA, но и компоненты официального репозитория. Не забудьте про `update` после изменения.',
          solution: `$ sudo add-apt-repository multiverse
Adding component(s) multiverse to all repositories.
$ sudo apt update
...
$ apt search ttf-mscorefonts
Sorting... Done
Full Text Search... Done
ttf-mscorefonts-installer/jammy 3.8ubuntu2 all
  Installer for Microsoft TrueType core fonts`,
        },
        {
          title: 'Найдите, в каком разделе живёт пакет',
          difficulty: 2,
          description:
            'Определите, из какого компонента (main, universe, multiverse) приходят пакеты `nginx`, `htop` и `ubuntu-drivers-common`. Используйте `apt show имя` и найдите в выводе поле `Section` или посмотрите на строку репозитория в выводе `apt policy имя`.',
          hint: 'Команда `apt policy имя` показывает таблицу версий с источниками — там виден и компонент в конце строки с URL.',
          solution: `$ apt policy nginx htop ubuntu-drivers-common
nginx:
  Installed: (none)
  Candidate: 1.18.0-6ubuntu14
  Version table:
     1.18.0-6ubuntu14 500
        500 http://archive.ubuntu.com/ubuntu jammy/main amd64 Packages
htop:
        500 http://archive.ubuntu.com/ubuntu jammy/universe amd64 Packages
ubuntu-drivers-common:
        500 http://archive.ubuntu.com/ubuntu jammy/main amd64 Packages
# ubuntu-drivers-common — свободная утилита, поэтому живёт в main;
# в restricted лежат сами проприетарные драйверы, которыми она управляет`,
        },
        {
          title: 'Подключите и отключите PPA на практике',
          difficulty: 3,
          description:
            'Полный цикл управления PPA: 1) подключите `ppa:git-core/ppa` (свежие версии Git); 2) обновите каталог; 3) проверьте через `apt policy git`, что кандидат на установку стал новее; 4) отключите PPA обратно; 5) снова обновите каталог и убедитесь, что файл источника исчез из `sources.list.d`.',
          hint: 'Каждый шаг — одна команда из урока. Шаг 4: тот же `add-apt-repository`, но с флагом `--remove`.',
          solution: `$ sudo add-apt-repository ppa:git-core/ppa
...
$ sudo apt update
$ apt policy git | head -4
git:
  Installed: 1:2.34.1-1ubuntu1.10
  Candidate: 1:2.43.0-0ppa1~ubuntu22.04.1   # стал свежее!
$ sudo add-apt-repository --remove ppa:git-core/ppa
$ sudo apt update
$ ls /etc/apt/sources.list.d/
# файла ppa больше нет — чисто`,
        },
      ],
      quiz: [
        {
          question: 'Что такое репозиторий в контексте Ubuntu?',
          options: [
            'Папка на вашем диске, куда скачиваются торренты',
            'Сервер-хранилище пакетов, откуда APT скачивает программы',
            'Раздел диска с системными файлами',
            'Программа для управления паролями',
          ],
          correctIndex: 1,
          explanation:
            'Репозиторий — это сервер с пакетами и их каталогом. Адреса репозиториев записаны в `/etc/apt/sources.list` и папке `sources.list.d`, а APT обращается к ним при update и install.',
        },
        {
          question: 'В строке `deb http://archive.ubuntu.com/ubuntu jammy main restricted` что означает слово `jammy`?',
          options: [
            'Имя сервера Canonical',
            'Кодовое имя выпуска Ubuntu 22.04 — пакеты собраны именно под него',
            'Формат сжатия пакетов',
            'Логин для доступа к репозиторию',
          ],
          correctIndex: 1,
          explanation:
            'Каждый выпуск Ubuntu имеет кодовое имя: 22.04 — Jammy Jellyfish, сокращённо jammy. Репозитории раздают пакеты отдельно под каждый выпуск, поэтому имя обязательно указывается.',
        },
        {
          question: 'Какой компонент официального репозитория содержит большинство свободных программ, поддерживаемых сообществом, а не Canonical?',
          options: [
            'main',
            'restricted',
            'universe',
            'security',
          ],
          correctIndex: 2,
          explanation:
            '`universe` — «вселенная» пакетов от сообщества: там живут htop, tree и тысячи других программ. `main` — только официально поддерживаемое Canonical, `restricted` — проприетарные драйверы.',
        },
        {
          question: 'Зачем нужен PPA (Personal Package Archive)?',
          options: [
            'Получать свежие или отсутствующие в официальных репозиториях версии программ',
            'Создавать резервные копии системы',
            'Ускорять скачивание пакетов через P2P-сеть',
            'Шифровать домашнюю папку',
          ],
          correctIndex: 0,
          explanation:
            'PPA — личные архивы на Launchpad, где разработчики публикуют свежие сборки. Это способ получить новую версию программы, не дожидаясь её появления в официальном репозитории.',
        },
        {
          question: 'Вы подключили новый PPA командой `add-apt-repository`. Что обязательно сделать перед `apt install`?',
          options: [
            'Перезагрузить компьютер',
            'Выполнить sudo apt update, чтобы APT узнал о новом источнике',
            'Удалить старые репозитории',
            'Ничего — всё работает сразу',
          ],
          correctIndex: 1,
          explanation:
            'APT читает каталоги репозиториев только во время `apt update`. Пока вы его не выполните, система просто не знает о пакетах из нового источника.',
        },
      ],
    },
    {
      id: 'm05-l03',
      title: 'dpkg, snap и flatpak: три способа установки',
      minutes: 25,
      intro:
        'Разберёте три способа поставить программу: классический `.deb` через dpkg, самодостаточные snap-пакеты и независимые flatpak. Научитесь понимать, какой способ выбрать в конкретной ситуации.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Вы уже знаете: APT качает пакеты из репозиториев. Но что физически представляет собой пакет? Это файл с расширением `.deb` — по сути, архив с программой, её настройками и служебной информацией. Иногда программу распространяют просто таким файлом — например, Google Chrome или VS Code на своих сайтах. Как его установить?',
        },
        {
          type: 'heading',
          text: 'dpkg: установщик .deb-файлов',
        },
        {
          type: 'paragraph',
          text: 'За установку `.deb`-файлов отвечает **dpkg** (Debian package) — низкоуровневый инструмент, который стоит «под» APT. Собственно, APT лишь качает .deb-файлы и передаёт их dpkg. Скачанный вручную пакет ставится так: `sudo dpkg -i файл.deb`.',
        },
        {
          type: 'code',
          title: 'Скачали .deb с сайта — ставим через dpkg',
          code: `$ cd ~/Downloads
$ ls
google-chrome-stable_current_amd64.deb
$ sudo dpkg -i google-chrome-stable_current_amd64.deb
Selecting previously unselected package google-chrome-stable.
Unpacking google-chrome-stable (124.0.6367.60-1) ...
Setting up google-chrome-stable (124.0.6367.60-1) ...`,
        },
        {
          type: 'paragraph',
          text: 'Есть подвох: dpkg **не умеет** сам скачивать зависимости. Если пакету чего-то не хватает, установка оборвётся с ошибкой «проблемы зависимостей». Лечится одной командой: `sudo apt -f install` — APT достаёт недостающее из репозиториев и доводит дело до конца. А ещё проще ставить локальный файл сразу через APT: `sudo apt install ./файл.deb` — он и зависимости подтянет.',
        },
        {
          type: 'code',
          title: 'dpkg полезен и для разведки',
          code: `$ dpkg -l | grep htop        # какие пакеты установлены?
ii  htop   3.0.5-7build2   amd64   interactive processes viewer
$ dpkg -L htop | head -4     # какие файлы поставил пакет?
/.
/usr
/usr/bin
/usr/bin/htop`,
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'dpkg = работа с **локальными** .deb-файлами и базой установленного (`-i`, `-l`, `-L`, `-S`). APT = работа с **репозиториями** и зависимостями. Локальный .deb удобнее ставить через `sudo apt install ./файл.deb` — зависимости разрешатся сами.',
        },
        {
          type: 'heading',
          text: 'Snap: программа «в чемоданчике»',
        },
        {
          type: 'paragraph',
          text: 'У `.deb` есть слабость: пакет привязан к конкретному выпуску системы и её библиотекам. **Snap** — формат, придуманный Canonical, решает это иначе: каждая программа упакована «в чемоданчик» со всеми нужными библиотеками и работает в изолированной песочнице. В Ubuntu 22.04 snap встроен из коробки — Firefox здесь как раз snap-пакет.',
        },
        {
          type: 'code',
          title: 'Управляем snap-пакетами',
          code: `$ snap list
Name      Version        Rev    Tracking       Publisher
core22    20240408       1380   latest/stable  canonical
firefox   124.0.2-1      4209   latest/stable  mozilla
snapd     2.62           21465  latest/stable  canonical
$ snap find telegram        # поиск в магазине snap
Name               Version  Publisher
telegram-desktop   5.0.1    telegram.desktop
$ sudo snap install telegram-desktop
telegram-desktop 5.0.1 from Telegram✓ installed`,
        },
        {
          type: 'paragraph',
          text: 'Плюсы snap: программа всегда свежая (обновляется сама в фоне), изолирована от системы и одинаково работает на любом дистрибутиве. Минусы: пакеты тяжелее, первый запуск медленнее, а магазин Snap Store контролируется одной компанией — Canonical.',
        },
        {
          type: 'heading',
          text: 'Flatpak: свободная альтернатива',
        },
        {
          type: 'paragraph',
          text: '**Flatpak** — независимый формат «программ в песочнице» с открытым магазином Flathub. В Ubuntu 22.04 он не установлен по умолчанию, но добавляется одной командой. После установки flatpak-пакеты ставятся похожим образом — только из репозитория Flathub.',
        },
        {
          type: 'code',
          title: 'Ставим flatpak и первую программу из Flathub',
          code: `$ sudo apt install flatpak
$ flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
$ flatpak search vlc
Name    Application ID         Version
VLC     org.videolan.VLC       3.0.20
$ flatpak install flathub org.videolan.VLC
...
Installation complete.
$ flatpak run org.videolan.VLC     # запуск из терминала`,
        },
        {
          type: 'table',
          headers: ['Критерий', '.deb (APT/dpkg)', 'snap', 'flatpak'],
          rows: [
            ['Откуда', 'Репозитории Ubuntu', 'Snap Store', 'Flathub'],
            ['Зависимости', 'Общие с системой', 'Внутри пакета', 'Внутри пакета'],
            ['Обновления', 'С системой, вручную', 'Автоматически в фоне', 'Вручную или из магазина'],
            ['Изоляция', 'Нет', 'Да (песочница)', 'Да (песочница)'],
            ['Размер', 'Компактный', 'Крупнее', 'Крупнее'],
            ['В Ubuntu 22.04', 'Из коробки', 'Из коробки', 'Ставится отдельно'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Не смешивайте способы установки одной и той же программы: `firefox` через snap и `firefox` через apt будут конфликтовать или жить параллельными жизнями с разными настройками. Решили переехать — сначала удалите старый вариант.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Три дороги к программе — и вы знаете все. Проверьте себя: чем snap отличается от deb по части зависимостей? Какая команда покажет, какие файлы установил deb-пакет? А дальше — четвёртая дорога, самая «хардкорная» и самая поучительная: собрать программу из исходного кода вручную. В следующем уроке сделаем это на практике и поймём, почему пакетные менеджеры — великое изобретение.',
        },
      ],
      tasks: [
        {
          title: 'Разведка по установленному',
          difficulty: 1,
          description:
            'Узнайте с помощью dpkg: 1) сколько пакетов установлено в системе (`dpkg -l | wc -l`); 2) какие файлы установил пакет `bash`; 3) какому пакету принадлежит файл `/bin/bash`. Все три ответа запишите.',
          hint: 'Нужные флаги dpkg: `-l` (список), `-L пакет` (файлы пакета), `-S файл` (кому принадлежит файл).',
          solution: `$ dpkg -l | wc -l
2143
$ dpkg -L bash | head -5
/.
/bin
/bin/bash
/usr
/usr/share
$ dpkg -S /bin/bash
bash: /bin/bash`,
        },
        {
          title: 'Скачайте и установите .deb-файл вручную',
          difficulty: 2,
          description:
            'APT умеет скачивать .deb-файл без установки: команда `apt download htop` положит пакет в **текущую папку**. Скачайте так пакет `htop`, установите его «вручную» командой `sudo dpkg -i htop_*.deb`. Если dpkg пожалуется на зависимости — почините их командой `sudo apt -f install`. Проверьте, что программа работает, затем удалите её через `sudo apt remove htop`.',
          hint: 'Звёздочка в `htop_*.deb` подставит точную версию файла — не печатайте её вручную. Резервный план при ошибке зависимостей: `sudo apt -f install` достаёт недостающее из репозиториев.',
          solution: `$ cd ~/Downloads
$ apt download htop       # .deb скачается в текущую папку, без установки
Get:1 http://archive.ubuntu.com/ubuntu jammy/universe amd64 htop amd64 3.0.5-7build2 [128 kB]
$ ls
htop_3.0.5-7build2_amd64.deb
$ sudo dpkg -i htop_*.deb
Selecting previously unselected package htop.
Unpacking htop (3.0.5-7build2) ...
Setting up htop (3.0.5-7build2) ...
# если бы dpkg пожаловался на зависимости, спасла бы команда:
# sudo apt -f install
$ htop --version
htop 3.0.5
$ sudo apt remove htop`,
        },
        {
          title: 'Изучите snap-пакеты',
          difficulty: 2,
          description:
            'Выведите список snap-пакетов в системе. Найдите в Snap Store программу `asciiquarium` (аквариум в терминале) или `fortune` (шутки-цитаты), установите её и запустите. Затем узнайте, когда пакет обновлялся в последний раз: `snap info имя`.',
          hint: 'Команды: `snap list`, `snap find`, `sudo snap install`, `snap info`. Запускаются snap-программы просто по имени.',
          solution: `$ snap list
Name      Version   Rev    Tracking       Publisher
core22    20240408  1380   latest/stable  canonical
firefox   124.0.2-1 4209   latest/stable  mozilla
$ sudo snap install asciiquarium
asciiquarium 1.1 from Kyle Galloway installed
$ asciiquarium        # наслаждаемся рыбками, выход — Ctrl+C
$ snap info asciiquarium | head -5
name:      asciiquarium
summary:   An aquarium in your terminal
publisher: Kyle Galloway`,
        },
        {
          title: 'Сравните два мира',
          difficulty: 3,
          description:
            'Проведите эксперимент: 1) посмотрите размер одного и того же приложения в разных форматах — `apt show htop | grep Size` и (если flatpak установлен) `flatpak info org.videolan.VLC | grep -i size` или snap-аналог через `du -sh /snap/имя/*/`. 2) Сделайте вывод, почему «чемоданчик» тяжелее, и запишите 2-3 предложения в файл `~/compare.txt`.',
          hint: 'Размер установленного deb-пакета смотрится через `dpkg -s пакет | grep Installed-Size`. Для snap — каталоги внутри `/snap/`.',
          solution: `$ dpkg -s htop | grep Installed-Size
Installed-Size: 399           # килобайты!
$ du -sh /snap/firefox/current
394M    /snap/firefox/current
$ echo "deb-пакет htop занимает 399 КБ — зависимости общие." > ~/compare.txt
$ echo "snap firefox тянет 394 МБ: все библиотеки внутри пакета." >> ~/compare.txt
$ echo "Вывод: deb компактнее, snap автономнее и обновляется сам." >> ~/compare.txt
$ cat ~/compare.txt`,
        },
      ],
      quiz: [
        {
          question: 'Чем dpkg отличается от APT?',
          options: [
            'dpkg работает только в Debian, APT — только в Ubuntu',
            'dpkg ставит локальные .deb-файлы и не разрешает зависимости, APT качает из репозиториев и разрешает их',
            'dpkg — графическая программа, APT — консольная',
            'Ничем, это два названия одной утилиты',
          ],
          correctIndex: 1,
          explanation:
            'dpkg — низкоуровневый установщик .deb-файлов: он не ищет зависимости в сети. APT — надстройка, которая скачивает пакеты из репозиториев, подтягивает зависимости и передаёт файлы на установку тому же dpkg.',
        },
        {
          question: 'Вы скачали `app.deb` и поставили его через `sudo dpkg -i app.deb`, но получили ошибку зависимостей. Как починить?',
          options: [
            'Удалить dpkg и поставить заново',
            'Выполнить sudo apt -f install — APT доустановит недостающее',
            'Скачать другую версию Ubuntu',
            'Ошибку зависимостей исправить нельзя',
          ],
          correctIndex: 1,
          explanation:
            '`sudo apt -f install` (fix) находит недостающие зависимости в репозиториях и завершает прерванную установку. Ещё проще сразу ставить файл через `sudo apt install ./app.deb`.',
        },
        {
          question: 'Какая главная особенность snap- и flatpak-пакетов?',
          options: [
            'Они работают только на серверах',
            'Они не требуют интернета для установки',
            'Каждая программа несёт свои библиотеки с собой и работает в изолированной песочнице',
            'Они всегда бесплатны',
          ],
          correctIndex: 2,
          explanation:
            'Snap и flatpak — самодостаточные «чемоданчики»: все зависимости внутри, программа изолирована от системы. Цена вопроса — больший размер и чуть более медленный запуск.',
        },
        {
          question: 'Что нужно сделать, чтобы flatpak заработал на свежей Ubuntu 22.04?',
          options: [
            'Ничего: flatpak предустановлен, как и snap',
            'Установить пакет flatpak через APT и добавить репозиторий Flathub',
            'Перейти на другой дистрибутив — Ubuntu не поддерживает flatpak',
            'Купить подписку на Flathub',
          ],
          correctIndex: 1,
          explanation:
            'В Ubuntu 22.04 из коробки есть только snap. Flatpak ставится командой `sudo apt install flatpak`, после чего добавляется каталог Flathub — `flatpak remote-add flathub ...`.',
        },
        {
          question: 'Почему не стоит ставить одну и ту же программу одновременно через apt и snap?',
          options: [
            'Система немедленно сломается',
            'Будут две параллельные копии с разными настройками и возможными конфликтами',
            'Snap Store подаст на вас в суд',
            'Такая установка просто не запустится технически',
          ],
          correctIndex: 1,
          explanation:
            'Технически обе копии установятся, но вы запутаетесь: две версии, два набора настроек, разные пути к файлам. Решили сменить формат — сначала удалите старую копию.',
        },
      ],
    },
    {
      id: 'm05-l04',
      title: 'Собираем программу из исходников',
      minutes: 30,
      intro:
        'Сделаете классический ритуал Linux: скачаете исходный код программы, настроите сборку через configure, скомпилируете make и установите make install. И поймёте, когда это оправдано — а когда лучше APT.',
      blocks: [
        {
          type: 'paragraph',
          text: 'За три урока вы научились ставить программы как потребитель: apt, dpkg, snap, flatpak. Финальный урок модуля — как производитель. **Исходный код** — это тексты программы на языке вроде C, читаемые человеком. Чтобы компьютер мог их выполнять, код **компилируют** — переводят в машинные инструкции. Зачем это нужно в наши дни? Программы нет ни в одном репозитории; в репозитории старая версия, а нужна самая свежая; вы хотите включить нестандартные опции сборки; или вы изучаете и чините чужой код. Но помните: собранная вручную программа не обновляется через APT — её судьба теперь на вас.',
        },
        {
          type: 'callout',
          variant: 'simple',
          text: 'Аналогия с кухней: .deb-пакет — это готовое блюдо из ресторана (разогрел и ешь). Исходный код — рецепт и сырые продукты: придётся готовить самому, зато можно подстроить вкус под себя и быть уверенным в составе.',
        },
        {
          type: 'heading',
          text: 'Готовим инструменты сборки',
        },
        {
          type: 'paragraph',
          text: 'Для компиляции нужен компилятор (для C это `gcc`) и утилита `make`. В Ubuntu они собраны в метапакет **build-essential** — «набор строителя». Ставим его нашим старым знакомым APT.',
        },
        {
          type: 'code',
          title: 'Устанавливаем инструменты сборки',
          code: `$ sudo apt update
$ sudo apt install build-essential
...
The following NEW packages will be installed: gcc g++ make dpkg-dev ...
$ gcc --version | head -1
gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
$ make --version | head -1
GNU Make 4.3`,
        },
        {
          type: 'heading',
          text: 'Священная троица: configure, make, make install',
        },
        {
          type: 'paragraph',
          text: 'Классическая сборка программы на C выглядит как три шага. Возьмём реальный пример — утилиту `wget` (скачивалку файлов, вы ей уже пользовались). Сначала скачаем и распакуем архив с исходниками.',
        },
        {
          type: 'code',
          title: 'Шаг 0: скачиваем и распаковываем исходники',
          code: `$ mkdir ~/src && cd ~/src
$ wget https://ftp.gnu.org/gnu/wget/wget-1.21.3.tar.gz
...
'wget-1.21.3.tar.gz' saved [4998421/4998421]
$ tar -xzf wget-1.21.3.tar.gz     # распаковываем архив
$ cd wget-1.21.3
$ ls
configure  Makefile.in  README  src/  doc/  ...`,
        },
        {
          type: 'paragraph',
          text: '**Шаг 1 — `./configure`.** Скрипт осматривает вашу систему: есть ли компилятор, какие библиотеки установлены, куда ставить программу. По результатам он генерирует `Makefile` — файл рецептов для сборки. Если чего-то не хватает, configure честно скажет, что именно доустановить.',
        },
        {
          type: 'code',
          title: 'Шаг 1: configure проверяет систему',
          code: `$ ./configure --prefix=/usr/local
checking for gcc... gcc
checking whether the C compiler works... yes
checking for openssl... yes
configure: creating ./config.status
config.status: creating Makefile
$ # готово: Makefile сгенерирован`,
        },
        {
          type: 'paragraph',
          text: '**Шаг 2 — `make`.** Утилита читает `Makefile` и вызывает компилятор для каждого файла с кодом. На больших проектах это занимает минуты — видно, как бегут строки компиляции. Флаг `-j4` ускоряет сборку, задействуя 4 ядра процессора.',
        },
        {
          type: 'code',
          title: 'Шаг 2: make компилирует программу',
          code: `$ make -j4
gcc -DHAVE_CONFIG_H -I. -I../src -c -o main.o main.c
gcc -DHAVE_CONFIG_H -I. -I../src -c -o http.o http.c
...
gcc -o wget main.o http.o ... -lssl -lcrypto
$ ls src/wget        # вот она, свежесобранная программа
src/wget
$ ./src/wget --version | head -1
GNU Wget 1.21.3 built on linux-gnu.`,
        },
        {
          type: 'paragraph',
          text: '**Шаг 3 — `sudo make install`.** Копирует готовую программу и её файлы в системные папки — туда, куда указал параметр `--prefix` на шаге configure (по умолчанию `/usr/local`). Именно поэтому шаг требует `sudo`: писать в `/usr/local` может только администратор.',
        },
        {
          type: 'code',
          title: 'Шаг 3: устанавливаем в систему',
          code: `$ sudo make install
/usr/bin/install -c src/wget /usr/local/bin/wget
/usr/bin/install -c doc/wget.1 /usr/local/share/man/man1/wget.1
$ which wget
/usr/local/bin/wget          # система теперь видит нашу сборку
$ wget --version | head -1
GNU Wget 1.21.3 built on linux-gnu.`,
        },
        {
          type: 'callout',
          variant: 'warning',
          text: 'Ручная установка обходит APT: пакетный менеджер не знает о вашей программе и не будет её обновлять. Чтобы удалить такую программу, возвращайтесь в папку с исходниками и выполняйте `sudo make uninstall` (если автор его предусмотрел). Папку `~/src/wget-1.21.3` после установки не удаляйте!',
        },
        {
          type: 'callout',
          variant: 'remember',
          text: 'Запомните троицу: `./configure` — осмотреться и написать рецепт, `make` — приготовить, `sudo make install` — подать на стол. Эта схема работает для тысяч программ на C, от мелких утилит до nginx.',
        },
        {
          type: 'heading',
          text: 'Что дальше',
        },
        {
          type: 'paragraph',
          text: 'Проверьте себя вслух: что делает скрипт configure? Почему make install требует sudo? И запомните лестницу выбора: есть в репозитории — ставим через APT; нужна свежая версия — PPA; нет нигде — snap/flatpak; и только в конце — сборка из исходников. Поздравляем: модуль «Управление программами» пройден от apt update до make install! В следующем модуле «Процессы и ресурсы» мы оживим картину: посмотрим, что делает система прямо сейчас, найдём прожорливые процессы и научимся ими управлять.',
        },
      ],
      tasks: [
        {
          title: 'Подготовьте строительную площадку',
          difficulty: 1,
          description:
            'Установите метапакет `build-essential` и проверьте, что компилятор и make на месте: выведите первые строки `gcc --version` и `make --version`.',
          hint: 'Один пакет build-essential ставит и gcc, и make, и g++. Проверка версии — через флаг `--version` с ограничением вывода через `head -1`.',
          solution: `$ sudo apt update
$ sudo apt install build-essential
...
$ gcc --version | head -1
gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
$ make --version | head -1
GNU Make 4.3`,
        },
        {
          title: 'Напишите и скомпилируйте «Привет, мир!»',
          difficulty: 2,
          description:
            'Создайте файл `hello.c` с классической программой на C (печатает приветствие через `printf`), скомпилируйте его командой `gcc hello.c -o hello` и запустите `./hello`. Затем посмотрите размер получившегося файла через `ls -lh hello`.',
          hint: 'Содержимое hello.c: `#include <stdio.h>`, затем `int main(void) { printf("...\\n"); return 0; }`. Файл удобно создать в nano.',
          solution: `$ nano hello.c
# вставляем:
# #include <stdio.h>
# int main(void) { printf("Привет из C!\\n"); return 0; }
$ gcc hello.c -o hello
$ ./hello
Привет из C!
$ ls -lh hello
-rwxrwxr-x 1 student student 16K мая 12 10:24 hello`,
        },
        {
          title: 'Пройдите полный цикл сборки',
          difficulty: 3,
          description:
            'Скачайте исходники небольшой GNU-утилиты (например, `hello-2.12.tar.gz` с ftp.gnu.org — учебная программа, созданная специально для тренировки сборки). Распакуйте, выполните `./configure`, затем `make` и `sudo make install`. Проверьте, что `/usr/local/bin/hello` работает, и узнайте через `which hello`, откуда запускается программа.',
          hint: 'Вся последовательность из урока: wget → tar -xzf → cd → ./configure → make → sudo make install. Программа hello просто печатает приветствие — идеальный полигон.',
          solution: `$ mkdir ~/src && cd ~/src
$ wget https://ftp.gnu.org/gnu/hello/hello-2.12.tar.gz
$ tar -xzf hello-2.12.tar.gz
$ cd hello-2.12
$ ./configure
checking for gcc... gcc
...
config.status: creating Makefile
$ make
...
$ sudo make install
/usr/bin/install -c src/hello /usr/local/bin/hello
$ which hello
/usr/local/bin/hello
$ hello
Привет, мир!`,
        },
        {
          title: 'Почините сломанную сборку',
          difficulty: 3,
          description:
            'Сымитируйте типичную ошибку: в папке hello-2.12 выполните `make clean`, затем переименуйте `configure` в `configure.bak` и попробуйте собрать программу заново. Зафиксируйте ошибку, верните имя файла, повторите `./configure && make` успешно. Объясните себе в заметке `~/src/notes.txt`, почему make не смог работать без Makefile.',
          hint: '`make clean` удаляет результаты прошлой сборки, но не Makefile. Ошибка без configure: make не найдёт правила сборки. Всё лечится повторным запуском configure.',
          solution: `$ cd ~/src/hello-2.12
$ make clean
rm -f src/hello ...
$ mv configure configure.bak
$ make
make: *** No rule to make target ...  Stop.
$ mv configure.bak configure   # возвращаем как было
$ ./configure && make
...
$ echo "configure генерирует Makefile; без него make не знает," > ~/src/notes.txt
$ echo "как компилировать программу." >> ~/src/notes.txt`,
        },
      ],
      quiz: [
        {
          question: 'Что делает скрипт `./configure` при сборке из исходников?',
          options: [
            'Компилирует программу в машинный код',
            'Проверяет систему (компилятор, библиотеки) и генерирует Makefile — рецепт сборки',
            'Устанавливает готовую программу в /usr/local',
            'Скачивает зависимости из интернета',
          ],
          correctIndex: 1,
          explanation:
            'configure — это разведка: скрипт проверяет, есть ли gcc и нужные библиотеки, и по результатам создаёт Makefile, по которому make будет компилировать программу.',
        },
        {
          question: 'В каком порядке выполняется классическая сборка программы?',
          options: [
            'make → configure → make install',
            'make install → configure → make',
            './configure → make → sudo make install',
            'sudo make install → make → ./configure',
          ],
          correctIndex: 2,
          explanation:
            'Сначала configure осматривает систему и пишет рецепт, затем make по рецепту компилирует, и в конце make install копирует готовое в системные папки (поэтому — через sudo).',
        },
        {
          question: 'Почему шаг `make install` обычно выполняют через sudo?',
          options: [
            'sudo ускоряет копирование файлов',
            'Программа устанавливается в системные папки (/usr/local), куда обычный пользователь писать не может',
            'sudo обязателен для всех команд make',
            'Без sudo компилятор откажется работать',
          ],
          correctIndex: 1,
          explanation:
            'По умолчанию программа ставится в `/usr/local` — системный каталог, принадлежащий root. Права на запись туда есть только у администратора — отсюда sudo.',
        },
        {
          question: 'Какой главный минус программы, собранной вручную из исходников?',
          options: [
            'Она работает медленнее пакетной',
            'Она не видна APT: ни обновлений, ни удаления через apt remove',
            'Она не запускается после перезагрузки',
            'Её нельзя удалить вообще никак',
          ],
          correctIndex: 1,
          explanation:
            'APT ведёт учёт только своих пакетов. Вручную собранная программа живёт вне этого учёта: обновлять её придётся самому, а удалять — через `sudo make uninstall` из папки с исходниками.',
        },
        {
          question: 'Когда сборка из исходников действительно оправдана?',
          options: [
            'Всегда — так программа работает быстрее',
            'Никогда, это пережиток прошлого',
            'Когда программы нет в репозиториях/PPA/snap/flatpak, нужна свежая версия или особые опции сборки',
            'Только если сломался APT',
          ],
          correctIndex: 2,
          explanation:
            'Ручная сборка — инструмент последней инстанции или разработчика. Во всех обычных случаях пакетные менеджеры быстрее, безопаснее и сами следят за обновлениями.',
        },
      ],
    },
  ],
};
