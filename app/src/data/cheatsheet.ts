/**
 * Шпаргалка команд Ubuntu 22.04 LTS (jammy).
 * Данные для страницы /cheatsheet. Каждая команда проверена на актуальность для jammy.
 */

export interface CheatCommand {
  /** Команда как есть — отображается и копируется в буфер. */
  command: string;
  /** Короткое описание по-русски. */
  description: string;
  /** Пример использования — показывается в подсказке при наведении. */
  example?: string;
}

export interface CheatCategory {
  /** Якорь для scrollspy и быстрой навигации. */
  id: string;
  title: string;
  /** Ключ иконки — маппится на lucide-react в компоненте страницы. */
  icon:
    | 'compass'
    | 'folder'
    | 'file-text'
    | 'shield'
    | 'package'
    | 'cpu'
    | 'hard-drive'
    | 'network'
    | 'settings'
    | 'archive';
  commands: CheatCommand[];
}

export const cheatCategories: CheatCategory[] = [
  {
    id: 'navigation',
    title: 'Навигация',
    icon: 'compass',
    commands: [
      { command: 'pwd', description: 'Показать, в какой папке вы находитесь', example: '/home/student' },
      { command: 'ls -la', description: 'Все файлы (включая скрытые) с деталями', example: 'ls -la ~/Документы' },
      { command: 'cd <папка>', description: 'Перейти в папку', example: 'cd /var/log' },
      { command: 'cd ..', description: 'Подняться на уровень вверх' },
      { command: 'cd ~', description: 'Вернуться в домашнюю папку' },
      { command: 'tree', description: 'Дерево папок (ставится: sudo apt install tree)', example: 'tree -L 2 ~' },
    ],
  },
  {
    id: 'files',
    title: 'Файлы и папки',
    icon: 'folder',
    commands: [
      { command: 'mkdir <имя>', description: 'Создать папку', example: 'mkdir projects' },
      { command: 'mkdir -p <путь>', description: 'Создать вложенные папки разом', example: 'mkdir -p projects/linux/day1' },
      { command: 'touch <файл>', description: 'Создать пустой файл', example: 'touch notes.txt' },
      { command: 'cp -r <откуда> <куда>', description: 'Копировать файл или папку', example: 'cp -r projects backup' },
      { command: 'mv <откуда> <куда>', description: 'Переместить или переименовать', example: 'mv notes.txt notes_old.txt' },
      { command: 'rm -ri <папка>', description: 'Удалить с подтверждением каждого файла', example: 'rm -ri test' },
      { command: 'find . -name "*.txt"', description: 'Найти файлы по имени', example: 'find ~ -name "*.log"' },
      { command: 'ln -s <цель> <ссылка>', description: 'Создать ярлык (символическую ссылку)', example: 'ln -s /var/www/html site' },
    ],
  },
  {
    id: 'text',
    title: 'Текст и просмотр',
    icon: 'file-text',
    commands: [
      { command: 'cat <файл>', description: 'Вывести файл целиком', example: 'cat /etc/os-release' },
      { command: 'less <файл>', description: 'Читать постранично (q — выход)', example: 'less /var/log/syslog' },
      { command: 'head -n 20 <файл>', description: 'Первые 20 строк файла' },
      { command: 'tail -f <лог>', description: 'Следить за концом файла в реальном времени', example: 'tail -f /var/log/auth.log' },
      { command: 'grep "слово" <файл>', description: 'Поиск текста в файле', example: 'grep "error" /var/log/syslog' },
      { command: 'nano <файл>', description: 'Простой редактор прямо в терминале' },
      { command: 'wc -l <файл>', description: 'Посчитать строки в файле' },
    ],
  },
  {
    id: 'users',
    title: 'Пользователи и права',
    icon: 'shield',
    commands: [
      { command: 'sudo <команда>', description: 'Выполнить команду как администратор', example: 'sudo apt update' },
      { command: 'whoami', description: 'Показать, под каким пользователем вы работаете', example: 'student' },
      { command: 'chmod +x <файл>', description: 'Сделать файл исполняемым', example: 'chmod +x script.sh' },
      { command: 'chmod 755 <файл>', description: 'Права rwxr-xr-x (владельцу всё, остальным чтение)', example: 'chmod 755 script.sh' },
      { command: 'sudo chown user:user <файл>', description: 'Сменить владельца файла', example: 'sudo chown student:student report.txt' },
      { command: 'adduser <имя>', description: 'Создать нового пользователя (с паролем и домашней папкой)', example: 'sudo adduser ivan' },
      { command: 'groups <имя>', description: 'В каких группах состоит пользователь', example: 'groups student' },
    ],
  },
  {
    id: 'packages',
    title: 'Пакеты и программы',
    icon: 'package',
    commands: [
      { command: 'sudo apt update', description: 'Обновить список доступных пакетов' },
      { command: 'sudo apt upgrade', description: 'Обновить установленные программы' },
      { command: 'sudo apt install <имя>', description: 'Установить программу', example: 'sudo apt install htop' },
      { command: 'sudo apt remove <имя>', description: 'Удалить программу', example: 'sudo apt remove htop' },
      { command: 'apt search <слово>', description: 'Найти пакет по названию', example: 'apt search nginx' },
      { command: 'apt show <имя>', description: 'Подробности о пакете: версия, размер, описание', example: 'apt show nginx' },
      { command: 'snap install <имя>', description: 'Установить snap-пакет', example: 'sudo snap install code --classic' },
    ],
  },
  {
    id: 'processes',
    title: 'Процессы',
    icon: 'cpu',
    commands: [
      { command: 'htop', description: 'Интерактивный монитор процессов (q — выход)' },
      { command: 'ps aux | grep <имя>', description: 'Найти процесс по имени', example: 'ps aux | grep firefox' },
      { command: 'kill <PID>', description: 'Аккуратно завершить процесс по его номеру', example: 'kill 1234' },
      { command: 'kill -9 <PID>', description: 'Завершить принудительно, если не слушается', example: 'kill -9 1234' },
      { command: 'jobs', description: 'Список фоновых задач текущего терминала' },
      { command: 'bg %1', description: 'Отправить задачу №1 работать в фоне' },
      { command: 'fg %1', description: 'Вернуть задачу №1 на передний план' },
    ],
  },
  {
    id: 'disks',
    title: 'Диски и память',
    icon: 'hard-drive',
    commands: [
      { command: 'df -h', description: 'Свободное место на дисках в удобном виде' },
      { command: 'du -sh <папка>', description: 'Сколько места занимает папка', example: 'du -sh ~/Загрузки' },
      { command: 'free -h', description: 'Оперативная память: сколько занято и свободно' },
      { command: 'lsblk', description: 'Список дисков и разделов' },
      { command: 'sudo mount <раздел> <точка>', description: 'Подключить диск вручную', example: 'sudo mount /dev/sdb1 /mnt' },
      { command: 'uptime', description: 'Сколько работает система и средняя нагрузка' },
    ],
  },
  {
    id: 'network',
    title: 'Сеть',
    icon: 'network',
    commands: [
      { command: 'ip a', description: 'Сетевые интерфейсы и ваши IP-адреса' },
      { command: 'ping -c 4 <хост>', description: 'Проверить связь, ровно 4 запроса', example: 'ping -c 4 8.8.8.8' },
      { command: 'ss -tuln', description: 'Какие порты слушает система' },
      { command: 'ssh user@host', description: 'Подключиться к удалённому серверу', example: 'ssh student@192.168.1.10' },
      { command: 'scp <файл> user@host:~', description: 'Скопировать файл на сервер по SSH', example: 'scp notes.txt student@192.168.1.10:~' },
      { command: 'curl -I <url>', description: 'Показать заголовки ответа сайта', example: 'curl -I https://ubuntu.com' },
      { command: 'wget <url>', description: 'Скачать файл по ссылке', example: 'wget https://releases.ubuntu.com/22.04/SHA256SUMS' },
    ],
  },
  {
    id: 'systemd',
    title: 'Systemd и безопасность',
    icon: 'settings',
    commands: [
      { command: 'sudo systemctl status <служба>', description: 'Статус службы: работает ли, последние логи', example: 'sudo systemctl status ssh' },
      { command: 'sudo systemctl restart <служба>', description: 'Перезапустить службу', example: 'sudo systemctl restart nginx' },
      { command: 'sudo systemctl enable <служба>', description: 'Запускать службу при загрузке', example: 'sudo systemctl enable nginx' },
      { command: 'journalctl -u <служба>', description: 'Логи конкретной службы', example: 'journalctl -u ssh -n 50' },
      { command: 'sudo ufw status', description: 'Статус файрвола и открытые порты' },
      { command: 'sudo ufw allow <порт>', description: 'Открыть порт в файрволе', example: 'sudo ufw allow 443/tcp' },
      { command: 'sudo reboot', description: 'Перезагрузить систему' },
      { command: 'sudo poweroff', description: 'Выключить систему' },
    ],
  },
  {
    id: 'archives',
    title: 'Архивы и резервные копии',
    icon: 'archive',
    commands: [
      { command: 'tar -czf <архив.tar.gz> <папка>', description: 'Упаковать папку в tar.gz', example: 'tar -czf backup.tar.gz projects' },
      { command: 'tar -xzf <архив.tar.gz>', description: 'Распаковать архив tar.gz в текущую папку' },
      { command: 'tar -tzf <архив.tar.gz>', description: 'Посмотреть содержимое архива без распаковки' },
      { command: 'rsync -av <откуда>/ <куда>/', description: 'Точная копия папки (удобно для бэкапов)', example: 'rsync -av ~/documents/ ~/backup/' },
      { command: 'zip -r <архив.zip> <папка>', description: 'Упаковать папку в zip', example: 'zip -r project.zip projects' },
      { command: 'unzip <архив.zip>', description: 'Распаковать zip-архив' },
    ],
  },
];

export interface Hotkey {
  /** Комбинация как набор клавиш (каждая — отдельный <kbd>). */
  keys: string[];
  action: string;
}

export const terminalHotkeys: Hotkey[] = [
  { keys: ['Ctrl', 'Alt', 'T'], action: 'Открыть терминал' },
  { keys: ['Tab'], action: 'Автодополнение команды или пути' },
  { keys: ['↑', '↓'], action: 'Листать историю команд' },
  { keys: ['Ctrl', 'C'], action: 'Прервать выполняющуюся команду' },
  { keys: ['Ctrl', 'L'], action: 'Очистить экран терминала' },
  { keys: ['Ctrl', 'R'], action: 'Поиск по истории команд' },
  { keys: ['Ctrl', 'Shift', 'C'], action: 'Копировать из терминала' },
  { keys: ['Ctrl', 'Shift', 'V'], action: 'Вставить в терминал' },
  { keys: ['Ctrl', 'Z'], action: 'Приостановить задачу (далее bg / fg)' },
  { keys: ['exit'], action: 'Закрыть терминал' },
];

/** Общее число команд в шпаргалке. */
export const totalCommands = cheatCategories.reduce((sum, c) => sum + c.commands.length, 0);
