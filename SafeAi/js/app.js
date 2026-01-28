/**
 * SafeCode AI - Application Logic
 * UI взаимодействие и управление событиями
 */

// Глобальные экземпляры
let anonymizer = null;
let deanonymizer = null;
let currentMapping = null;
let inputEditor = null;
let outputEditor = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Инициализация приложения
 */
function initializeApp() {
    anonymizer = new CodeAnonymizer();
    deanonymizer = new CodeDeanonymizer();

    // Инициализация CodeMirror редакторов
    initializeCodeEditors();

    // Инициализация обработчиков событий
    initializeTabSwitching();
    initializeAnonymizationHandlers();
    initializeDeanonymizationHandlers();
    initializeUtilityHandlers();
    initializeSynchronizedScrolling();

    // Загрузить последний mapping из localStorage если есть
    loadLastMappingFromStorage();
}

/**
 * Инициализация CodeMirror редакторов
 */
function initializeCodeEditors() {
    // Input редактор
    inputEditor = CodeMirror(document.getElementById('input-code-wrapper'), {
        mode: 'text/x-java',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        placeholder: 'Вставьте ваш код здесь...\n\nПоддерживаются:\n• Java код (классы, методы, поля)\n• Spring конфигурации (XML, YAML, properties)\n• JSON конфигурации\n• application.yml / application.properties\n\nПример:\npublic class PaymentService {\n  public void processPayment(String userId, double amount) {\n    // your code\n  }\n}'
    });

    // Output редактор
    outputEditor = CodeMirror(document.getElementById('output-code-wrapper'), {
        mode: 'text/x-java',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        placeholder: 'Анонимизированный код появится здесь...'
    });

    // Синхронизировать с textarea
    inputEditor.on('change', () => {
        document.getElementById('input-code').value = inputEditor.getValue();
    });

    outputEditor.on('change', () => {
        document.getElementById('output-code').value = outputEditor.getValue();
    });

    // Обновить при изменении размера окна
    window.addEventListener('resize', () => {
        inputEditor.refresh();
        outputEditor.refresh();
    });

    // Первоначальный refresh через небольшую задержку
    setTimeout(() => {
        inputEditor.refresh();
        outputEditor.refresh();
    }, 100);
}

/**
 * Переключение между вкладками
 */
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Убрать активный класс у всех
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Добавить активный класс к выбранному
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

/**
 * Обработчики для анонимизации
 */
function initializeAnonymizationHandlers() {
    const anonymizeBtn = document.getElementById('anonymize-btn');
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const clearInputBtn = document.getElementById('clear-input');
    const copyAnonymizedBtn = document.getElementById('copy-anonymized');
    const downloadCodeBtn = document.getElementById('download-code');
    const downloadMappingBtn = document.getElementById('download-mapping');

    // Кнопка анонимизации
    anonymizeBtn.addEventListener('click', () => {
        const code = inputEditor.getValue().trim();

        if (!code) {
            showToast('Введите код для анонимизации', 'error');
            return;
        }

        try {
            showSpinner();

            // Получить опции
            const options = {
                anonymizeFunctions: document.getElementById('opt-functions').checked,
                anonymizeVariables: document.getElementById('opt-variables').checked,
                anonymizeClasses: document.getElementById('opt-classes').checked,
                anonymizeStrings: document.getElementById('opt-strings').checked,
                removeComments: document.getElementById('opt-comments').checked,
                customImportPrefixes: document.getElementById('custom-imports').value,
                blacklist: document.getElementById('blacklist').value
            };

            // Анонимизировать
            setTimeout(() => {
                try {
                    const result = anonymizer.anonymize(code, options);
                    currentMapping = result.mapping;

                    // Отобразить результат
                    outputEditor.setValue(result.code);

                    // Сохранить mapping в localStorage
                    saveMappingToStorage(result.mapping);

                    // Показать статистику
                    displayStats(anonymizer.getStats(), code.length, result.code.length);

                    // Показать warnings если есть
                    if (result.warnings && result.warnings.length > 0) {
                        result.warnings.forEach(warning => {
                            showToast(warning.message, 'warning', 8000);
                        });
                    }

                    hideSpinner();
                    showToast('Код успешно анонимизирован!', 'success');
                } catch (error) {
                    hideSpinner();
                    showToast(`Ошибка: ${error.message}`, 'error');
                    console.error(error);
                }
            }, 100);
        } catch (error) {
            hideSpinner();
            showToast(`Ошибка: ${error.message}`, 'error');
            console.error(error);
        }
    });

    // Очистить input
    clearInputBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        hideStats();
    });

    // Копировать анонимизированный код
    copyAnonymizedBtn.addEventListener('click', () => {
        copyToClipboard(outputEditor.getValue(), 'Анонимизированный код скопирован!');
    });

    // Скачать анонимизированный код
    downloadCodeBtn.addEventListener('click', () => {
        const code = outputEditor.getValue();
        if (!code) {
            showToast('Нет кода для скачивания', 'error');
            return;
        }
        downloadFile(code, 'anonymized-code.java', 'text/x-java');
        showToast('Код сохранен!', 'success');
    });

    // Скачать mapping.json
    downloadMappingBtn.addEventListener('click', () => {
        if (!currentMapping) {
            showToast('Нет mapping для скачивания', 'error');
            return;
        }
        const json = JSON.stringify(currentMapping, null, 2);
        downloadFile(json, 'mapping.json', 'application/json');
        showToast('Mapping сохранен!', 'success');
    });

    // Полноэкранный режим для input
    const fullscreenInputBtn = document.getElementById('fullscreen-input');
    const inputPanel = document.getElementById('input-panel');
    fullscreenInputBtn.addEventListener('click', () => {
        toggleFullscreen(inputPanel, fullscreenInputBtn);
    });

    // Полноэкранный режим для output
    const fullscreenOutputBtn = document.getElementById('fullscreen-output');
    const outputPanel = document.getElementById('output-panel');
    fullscreenOutputBtn.addEventListener('click', () => {
        toggleFullscreen(outputPanel, fullscreenOutputBtn);
    });

    // Выход из fullscreen по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (inputPanel.classList.contains('fullscreen')) {
                toggleFullscreen(inputPanel, fullscreenInputBtn);
            }
            if (outputPanel.classList.contains('fullscreen')) {
                toggleFullscreen(outputPanel, fullscreenOutputBtn);
            }
        }
    });
}

/**
 * Обработчики для деанонимизации
 */
function initializeDeanonymizationHandlers() {
    const deanonymizeBtn = document.getElementById('deanonymize-btn');
    const uploadMappingBtn = document.getElementById('upload-mapping-btn');
    const mappingFileInput = document.getElementById('mapping-file');
    const useLastMappingBtn = document.getElementById('use-last-mapping');
    const aiCode = document.getElementById('ai-code');
    const restoredCode = document.getElementById('restored-code');
    const clearAiCodeBtn = document.getElementById('clear-ai-code');
    const copyRestoredBtn = document.getElementById('copy-restored');
    const downloadRestoredBtn = document.getElementById('download-restored');

    // Кнопка выбора mapping файла
    uploadMappingBtn.addEventListener('click', () => {
        mappingFileInput.click();
    });

    // Загрузка mapping файла
    mappingFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const mappingData = JSON.parse(text);

            // Валидация
            const validation = CodeDeanonymizer.validateMapping(mappingData);

            if (!validation.valid) {
                showToast(`Ошибки в mapping файле: ${validation.errors.join(', ')}`, 'error');
                return;
            }

            if (validation.warnings.length > 0) {
                validation.warnings.forEach(warning => {
                    showToast(warning, 'warning');
                });
            }

            // Загрузить mapping
            deanonymizer.loadMapping(mappingData);

            // Отобразить информацию
            displayMappingInfo(deanonymizer.getMappingInfo(), file.name);

            showToast(`Mapping загружен: ${validation.totalMappings} соответствий`, 'success');
        } catch (error) {
            showToast(`Ошибка загрузки: ${error.message}`, 'error');
            console.error(error);
        }
    });

    // Использовать последний mapping
    useLastMappingBtn.addEventListener('click', () => {
        const lastMapping = getLastMappingFromStorage();

        if (!lastMapping) {
            showToast('Нет сохраненного mapping', 'error');
            return;
        }

        try {
            deanonymizer.loadMapping(lastMapping);
            displayMappingInfo(deanonymizer.getMappingInfo(), 'Последний mapping из кэша');
            showToast('Последний mapping загружен', 'success');
        } catch (error) {
            showToast(`Ошибка: ${error.message}`, 'error');
        }
    });

    // Кнопка деанонимизации
    deanonymizeBtn.addEventListener('click', () => {
        const code = aiCode.value.trim();

        if (!code) {
            showToast('Введите код для деанонимизации', 'error');
            return;
        }

        if (!deanonymizer.reverseMapping) {
            showToast('Загрузите mapping файл сначала', 'error');
            return;
        }

        try {
            showSpinner();

            setTimeout(() => {
                try {
                    const result = deanonymizer.deanonymize(code);
                    restoredCode.value = result;

                    hideSpinner();
                    showToast('Код успешно восстановлен!', 'success');
                } catch (error) {
                    hideSpinner();
                    showToast(`Ошибка: ${error.message}`, 'error');
                    console.error(error);
                }
            }, 100);
        } catch (error) {
            hideSpinner();
            showToast(`Ошибка: ${error.message}`, 'error');
            console.error(error);
        }
    });

    // Очистить AI код
    clearAiCodeBtn.addEventListener('click', () => {
        aiCode.value = '';
        restoredCode.value = '';
    });

    // Копировать восстановленный код
    copyRestoredBtn.addEventListener('click', () => {
        copyToClipboard(restoredCode.value, 'Восстановленный код скопирован!');
    });

    // Скачать восстановленный код
    downloadRestoredBtn.addEventListener('click', () => {
        if (!restoredCode.value) {
            showToast('Нет кода для скачивания', 'error');
            return;
        }
        downloadFile(restoredCode.value, 'restored-code.js', 'application/javascript');
        showToast('Код сохранен!', 'success');
    });
}

/**
 * Утилиты и вспомогательные обработчики
 */
function initializeUtilityHandlers() {
    // Автосохранение input при вводе (debounced)
    let inputTimeout;
    const inputCode = document.getElementById('input-code');

    inputCode.addEventListener('input', () => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            localStorage.setItem('safecode-last-input', inputCode.value);
        }, 1000);
    });

    // Восстановить последний input
    const lastInput = localStorage.getItem('safecode-last-input');
    if (lastInput) {
        inputCode.value = lastInput;
    }
}

/**
 * Отображение статистики анонимизации
 */
function displayStats(stats, originalSize, anonymizedSize) {
    const statsPanel = document.getElementById('stats-panel');

    document.getElementById('stat-functions').textContent = stats.functions;
    document.getElementById('stat-variables').textContent = stats.variables;
    document.getElementById('stat-classes').textContent = stats.classes;
    document.getElementById('stat-parameters').textContent = stats.parameters || 0;
    document.getElementById('stat-constants').textContent = stats.constants;
    document.getElementById('stat-strings').textContent = stats.strings;

    statsPanel.style.display = 'block';
}

/**
 * Скрыть статистику
 */
function hideStats() {
    document.getElementById('stats-panel').style.display = 'none';
}

/**
 * Отображение информации о mapping файле
 */
function displayMappingInfo(info, filename) {
    const mappingInfo = document.getElementById('mapping-info');
    const filenameSpan = document.getElementById('mapping-filename');
    const infoFilename = document.getElementById('info-filename');
    const infoTimestamp = document.getElementById('info-timestamp');
    const infoVersion = document.getElementById('info-version');

    filenameSpan.textContent = filename;
    infoFilename.textContent = filename;
    infoTimestamp.textContent = info.formattedTimestamp;
    infoVersion.textContent = info.version;

    mappingInfo.style.display = 'block';

    if (info.isOld) {
        showToast(`Предупреждение: mapping создан ${info.ageInDays} дней назад`, 'warning');
    }
}

/**
 * Сохранить mapping в localStorage
 */
function saveMappingToStorage(mapping) {
    try {
        localStorage.setItem('safecode-last-mapping', JSON.stringify(mapping));
        localStorage.setItem('safecode-last-mapping-time', new Date().toISOString());
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
}

/**
 * Загрузить последний mapping из localStorage
 */
function getLastMappingFromStorage() {
    try {
        const mappingStr = localStorage.getItem('safecode-last-mapping');
        if (!mappingStr) return null;

        return JSON.parse(mappingStr);
    } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
        return null;
    }
}

/**
 * Проверить наличие последнего mapping при загрузке
 */
function loadLastMappingFromStorage() {
    const lastMappingTime = localStorage.getItem('safecode-last-mapping-time');

    if (lastMappingTime) {
        const time = new Date(lastMappingTime);
        const now = new Date();
        const hoursAgo = Math.floor((now - time) / (1000 * 60 * 60));

        if (hoursAgo < 24) {
            const useLastBtn = document.getElementById('use-last-mapping');
            useLastBtn.style.display = 'inline-flex';
            useLastBtn.title = `Последний mapping создан ${hoursAgo} ч. назад`;
        }
    }
}

/**
 * Синхронный скроллинг между CodeMirror редакторами
 */
function initializeSynchronizedScrolling() {
    let isSyncing = false;

    // Синхронизация при скролле исходного кода
    inputEditor.on('scroll', () => {
        if (isSyncing) return;
        isSyncing = true;

        const scrollInfo = inputEditor.getScrollInfo();
        const scrollPercentage = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);

        const outputScrollInfo = outputEditor.getScrollInfo();
        const outputScrollTop = scrollPercentage * (outputScrollInfo.height - outputScrollInfo.clientHeight);
        outputEditor.scrollTo(null, outputScrollTop);

        requestAnimationFrame(() => {
            isSyncing = false;
        });
    });

    // Синхронизация при скролле анонимизированного кода
    outputEditor.on('scroll', () => {
        if (isSyncing) return;
        isSyncing = true;

        const scrollInfo = outputEditor.getScrollInfo();
        const scrollPercentage = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);

        const inputScrollInfo = inputEditor.getScrollInfo();
        const inputScrollTop = scrollPercentage * (inputScrollInfo.height - inputScrollInfo.clientHeight);
        inputEditor.scrollTo(null, inputScrollTop);

        requestAnimationFrame(() => {
            isSyncing = false;
        });
    });
}

/**
 * Полноэкранный режим для панели
 */
function toggleFullscreen(panel, button) {
    panel.classList.toggle('fullscreen');

    if (panel.classList.contains('fullscreen')) {
        button.innerHTML = '<span class="btn-icon">✕</span> Выйти';
        button.title = 'Выйти из полноэкранного режима';
    } else {
        button.innerHTML = '<span class="btn-icon">⛶</span> Полный экран';
        button.title = 'Полноэкранный режим';
    }
}

/**
 * Копировать текст в буфер обмена
 */
async function copyToClipboard(text, successMessage = 'Скопировано!') {
    if (!text) {
        showToast('Нечего копировать', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast(successMessage, 'success');
    } catch (error) {
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showToast(successMessage, 'success');
        } catch (err) {
            showToast('Ошибка копирования', 'error');
        }

        document.body.removeChild(textarea);
    }
}

/**
 * Скачать файл
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Показать toast уведомление
 */
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }[type] || 'ℹ';

    toast.innerHTML = `<span style="font-size: 1.2em;">${icon}</span> ${message}`;

    container.appendChild(toast);

    // Автоудаление через заданное время
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

/**
 * Показать спиннер загрузки
 */
function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}

/**
 * Скрыть спиннер загрузки
 */
function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

/**
 * Обработка ошибок глобально
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('Произошла непредвиденная ошибка', 'error');
});

/**
 * Обработка unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('Произошла ошибка при выполнении операции', 'error');
});

// Экспорт для тестирования (опционально)
if (typeof window !== 'undefined') {
    window.SafeCodeApp = {
        copyToClipboard,
        downloadFile,
        showToast,
        showSpinner,
        hideSpinner
    };
}
