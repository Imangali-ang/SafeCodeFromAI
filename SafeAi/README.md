# 🔒 SafeCode AI

**Безопасная анонимизация Java/Spring/Kafka проектов и конфигурационных файлов перед отправкой в AI-ассистенты**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![No Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](package.json)
[![100% Client-Side](https://img.shields.io/badge/security-100%25%20client--side-brightgreen.svg)](index.html)
[![GitHub stars](https://img.shields.io/github/stars/imangali-ang/SafeAi?style=social)](https://github.com/imangali-ang/SafeAi/stargazers)
[![Live Demo](https://img.shields.io/badge/demo-live-success.svg)](https://imangali-ang.github.io/SafeAi/)

---

## 📋 Содержание

- [Зачем это нужно?](#-зачем-это-нужно)
- [Как это работает?](#-как-это-работает)
- [Возможности](#-возможности)
- [Быстрый старт](#-быстрый-старт)
- [Примеры использования](#-примеры-использования)
- [Deploy на GitHub Pages](#-deploy-на-github-pages)
- [Технические детали](#-технические-детали)
- [Безопасность](#-безопасность)
- [FAQ](#-faq)
- [Лицензия](#-лицензия)

---

## 🎯 Зачем это нужно?

При работе с AI-ассистентами (ChatGPT, Claude, и др.) часто возникает необходимость поделиться кодом для получения помощи. Однако ваш код может содержать:

- 🏢 **Коммерческую логику** - проприетарные алгоритмы и бизнес-правила
- 🔑 **Чувствительные данные** - API endpoints, названия внутренних сервисов
- 📜 **Информацию под NDA** - код клиентов, корпоративные проекты
- 🎯 **Архитектурные решения** - которые вы не хотите раскрывать

**SafeCode AI** решает эту проблему путем анонимизации вашего кода с возможностью полного восстановления.

---

## 🔄 Как это работает?

### Процесс в 3 шага:

```
1. АНОНИМИЗАЦИЯ               2. РАБОТА С AI              3. ДЕАНОНИМИЗАЦИЯ
┌─────────────────┐           ┌─────────────────┐         ┌─────────────────┐
│ Ваш код:        │           │ AI видит:       │         │ Восстановлено:  │
│                 │  ──────>  │                 │  ────>  │                 │
│ getUserData()   │           │ func1()         │         │ getUserData()   │
│ apiKey          │           │ var1            │         │ apiKey          │
│ /api/v1/users   │           │ /api/endpoint1  │         │ /api/v1/users   │
└─────────────────┘           └─────────────────┘         └─────────────────┘
        ↓                             ↓                           ↑
  mapping.json ──────────────────────────────────────────────────┘
  (храните у себя!)
```

**Ключевые преимущества:**

- ✅ AI получает синтаксически корректный код
- ✅ AI может анализировать логику и находить ошибки
- ✅ Ваши секреты остаются в безопасности
- ✅ Полное восстановление оригинального кода

---

## ✨ Возможности

### Анонимизация

**Java код:**
- **Функции/Методы**: `calculateUserBalance()` → `method1()`
- **Переменные**: `userAccount` → `var1`
- **Классы**: `PaymentService` → `Service1`
- **Константы**: `MAX_RETRY_COUNT` → `CONST1`
- **Package names**: `com.company.project` → `com.anonymous`
- **Геттеры/Сеттеры**: `getUserId()` → `getPar1()`
- **Строковые литералы**:
  - URLs: `"/api/v1/users"` → `"/api/endpoint1"`
  - API keys: автоматическая замена на `REDACTED_API_KEY`
- **Комментарии**: анонимизация (опционально)

**Конфигурационные файлы:**
- **XML**: bean ids, class references, property values
- **YAML**: custom keys и values (application.yml)
- **JSON**: ключи и строковые значения
- **Properties**: property names и values (application.properties)

### Безопасность

- 🛡️ **100% client-side** - код не покидает ваш браузер
- 🔒 **Нет backend** - нет серверов, нет баз данных
- 💾 **LocalStorage** - автосохранение последнего mapping
- 🔐 **Mapping файл** - храните его в безопасном месте

### UX

- 📊 **Статистика** - сколько элементов анонимизировано
- 📋 **One-click copy** - быстрое копирование результата
- 💾 **Download** - скачивание кода и mapping файла
- 📱 **Responsive** - работает на мобильных устройствах
- 🎨 **Современный дизайн** - приятный интерфейс

---

## 🚀 Быстрый старт

### Вариант 1: Локальное использование

1. **Клонировать репозиторий:**
```bash
git clone https://github.com/imangali-ang/SafeAi.git
cd SafeAi
```

2. **Открыть index.html:**
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

3. **Готово!** Приложение работает без сервера.

### Вариант 2: GitHub Pages

Просто перейдите на: **https://imangali-ang.github.io/SafeAi**

---

## 📖 Примеры использования

### Пример 1: Java класс

**Исходный код:**
```java
package com.company.payment;

import com.company.model.Account;

public class PaymentService {
    private static final double FEE_RATE = 0.025;
    private String apiEndpoint = "/api/v1/payments";

    public void processPayment(String userId, double amount) {
        Account account = fetchUserAccount(userId);
        double fee = calculateFee(amount);
        sendPayment(userId, amount, fee);
    }

    private double calculateFee(double amount) {
        return amount * FEE_RATE;
    }

    public String getUserId() {
        return this.userId;
    }
}
```

**Анонимизированный код:**
```java
package com.anonymous;

import com.anonymous.Class1;

public class Service1 {
    private static final double CONST1 = 0.025;
    private String var1 = "/api/endpoint1";

    public void method1(String param1, double param2) {
        Class1 var2 = method2(param1);
        double var3 = method3(param2);
        method4(param1, param2, var3);
    }

    private double method3(double param2) {
        return param2 * CONST1;
    }

    public String getPar1() {
        return this.par1;
    }
}
```

### Пример 2: YAML конфигурация

**До (application.yml):**
```yaml
server:
  port: 8080

spring:
  application:
    name: payment-service

company:
  api:
    endpoint: "https://internal.company.com/api"
    timeout: 5000
  features:
    payment-processing: true
    fraud-detection: enabled
```

**После:**
```yaml
server:
  port: 8080

spring:
  application:
    name: string1

property1:
  property2:
    property3: "string2"
    property4: 5000
  property5:
    property6: true
    property7: string3
```

---

## 🌐 Deploy на GitHub Pages

### Шаг 1: Создать репозиторий

```bash
git init
git add .
git commit -m "Initial commit: SafeCode AI"
git branch -M main
git remote add origin https://github.com/imangali-ang/SafeAi.git
git push -u origin main
```

### Шаг 2: Настроить GitHub Pages

1. Перейти в **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Нажать **Save**

### Шаг 3: Готово!

Через 1-2 минуты приложение будет доступно по адресу:
```
https://imangali-ang.github.io/SafeAi
```

---

## 🔧 Технические детали

### Структура проекта

```
SafeAi/
├── index.html              # Главная страница
├── css/
│   └── styles.css          # Все стили (минималистичный дизайн)
├── js/
│   ├── anonymizer.js       # Логика анонимизации (CodeAnonymizer класс)
│   ├── deanonymizer.js     # Логика деанонимизации (CodeDeanonymizer класс)
│   └── app.js              # UI логика и event handlers
└── README.md               # Эта документация
```

### Технологии

- **HTML5** - семантическая разметка
- **CSS3** - Grid, Flexbox, animations
- **Vanilla JavaScript (ES6+)** - без фреймворков
- **Prism.js (CDN)** - подсветка синтаксиса (опционально)

### Алгоритм анонимизации

1. **Парсинг кода** - поиск паттернов через regex
2. **Создание mapping** - сохранение соответствий
3. **Замена** - с использованием word boundaries (`\b`)
4. **Валидация** - проверка синтаксиса

**Что НЕ анонимизируется:**
- Java keywords (`if`, `for`, `return`, `const`, `let`, etc.)
- Стандартные API (`console.log`, `Math.random`, `JSON.parse`, etc.)
- Числа и булевы значения
- Операторы

### Формат mapping файла

```json
{
  "version": "1.0",
  "timestamp": "2025-01-24T10:30:00Z",
  "mappings": {
    "functions": {
      "calculateUserBalance": "func1",
      "fetchAccountData": "func2"
    },
    "variables": {
      "userAccount": "var1",
      "totalAmount": "var2"
    },
    "classes": {
      "PaymentService": "Class1"
    },
    "constants": {
      "MAX_RETRY_COUNT": "CONST1"
    },
    "strings": {
      "/api/v1/users": "/api/endpoint1"
    }
  }
}
```

---

## 🛡️ Безопасность

### Гарантии безопасности

✅ **Нет сетевых запросов** - весь код выполняется локально
✅ **Нет cookies** - не используем отслеживание
✅ **Нет аналитики** - ваши данные остаются приватными
✅ **Open Source** - код полностью открыт для аудита

### Рекомендации

1. **Храните mapping файлы в безопасном месте** (не в публичных репозиториях)
2. **Не отправляйте mapping вместе с кодом** в AI
3. **Проверяйте анонимизированный код** перед отправкой
4. **Используйте version control** для mapping файлов

### Что делать если потерян mapping?

❌ **Без mapping файла восстановление невозможно!**

**Решения:**
- Храните mapping в безопасном облаке (encrypted)
- Используйте password manager для важных mapping
- Делайте backup в несколько мест

---

## ❓ FAQ

### Какие типы файлов поддерживаются?

Текущая версия поддерживает:
- **Java** код (классы, методы, поля, интерфейсы)
- **Spring** конфигурации (XML beans)
- **YAML** файлы (application.yml, custom configs)
- **JSON** конфигурации
- **Properties** файлы (application.properties)

### Работает ли это с Kotlin или Scala?

Текущая версия оптимизирована для Java. Для Kotlin/Scala потребуется адаптация regex паттернов.

### Можно ли анонимизировать несколько файлов сразу?

В текущей версии - нет. Работа ведется с одним файлом за раз. Вы можете объединить файлы или обработать их поочередно.

### Безопасно ли хранить mapping в LocalStorage?

LocalStorage может быть доступен через XSS атаки. Для критически важных проектов скачивайте mapping файл и удаляйте из LocalStorage.

### Как обновить проект?

```bash
git pull origin main
```

Приложение не требует установки зависимостей.

---

## 🤝 Contributing

Contributions приветствуются!

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Roadmap

- [ ] Поддержка TypeScript типов
- [ ] Batch обработка файлов
- [ ] Экспорт в другие форматы (Python, Java)
- [ ] CLI версия для автоматизации
- [ ] Интеграция с VS Code
- [ ] Темная тема
- [ ] Мультиязычность (EN, RU, etc.)

---

## 📄 Лицензия

Этот проект распространяется под лицензией **MIT License**.

```
MIT License

Copyright (c) 2025 SafeCode AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Благодарности

- [Prism.js](https://prismjs.com/) - подсветка синтаксиса
- [MDN Web Docs](https://developer.mozilla.org/) - документация
- Все контрибьюторы и пользователи проекта

---

## 📧 Контакты

- 🌐 Live Demo: [https://imangali-ang.github.io/SafeAi](https://imangali-ang.github.io/SafeAi)
- 🐛 Report Issues: [GitHub Issues](https://github.com/imangali-ang/SafeAi/issues)
- 💡 Feature Requests: [GitHub Discussions](https://github.com/imangali-ang/SafeAi/discussions)
- 👤 Author: [Imangali](https://github.com/imangali-ang)

---

<div align="center">

**Made with ❤️ for developers who value privacy**

⭐ Star this project if you find it useful!

[Report Bug](https://github.com/imangali-ang/SafeAi/issues) · [Request Feature](https://github.com/imangali-ang/SafeAi/issues)

</div>
