/**
 * SafeCode AI - Deanonymizer Module
 * Восстанавливает оригинальные имена из анонимизированного кода
 */

class CodeDeanonymizer {
    constructor() {
        this.reverseMapping = null;
        this.mappingData = null;
    }

    /**
     * Загрузить mapping файл
     * @param {Object} mappingData - Объект mapping из JSON файла
     */
    loadMapping(mappingData) {
        if (!mappingData || typeof mappingData !== 'object') {
            throw new Error('Некорректный mapping файл');
        }

        if (!mappingData.version) {
            throw new Error('Отсутствует версия в mapping файле');
        }

        if (!mappingData.mappings) {
            throw new Error('Отсутствуют mappings в файле');
        }

        this.mappingData = mappingData;
        this.reverseMapping = this.createReverseMapping(mappingData.mappings);

        return {
            version: mappingData.version,
            timestamp: mappingData.timestamp,
            totalMappings: this.getTotalMappings()
        };
    }

    /**
     * Создать обратный mapping (анонимизированное -> оригинальное)
     * @param {Object} mappings - Объект с прямыми соответствиями
     * @returns {Object} - Обратный mapping
     */
    createReverseMapping(mappings) {
        const reverse = {};

        // Обрабатываем все категории
        Object.keys(mappings).forEach(category => {
            const categoryMappings = mappings[category];

            Object.entries(categoryMappings).forEach(([original, anonymized]) => {
                // Сохраняем обратное соответствие
                reverse[anonymized] = original;
            });
        });

        return reverse;
    }

    /**
     * Деанонимизировать код
     * @param {string} code - Анонимизированный код
     * @returns {string} - Восстановленный код
     */
    deanonymize(code) {
        if (!code || typeof code !== 'string') {
            throw new Error('Код должен быть непустой строкой');
        }

        if (!this.reverseMapping) {
            throw new Error('Mapping не загружен. Используйте loadMapping() сначала');
        }

        let result = code;

        try {
            // Сортируем ключи по длине (от длинных к коротким)
            // Это важно чтобы избежать partial replacements
            // Например, var10 должен быть заменен раньше чем var1
            const sortedKeys = Object.keys(this.reverseMapping)
                .sort((a, b) => b.length - a.length);

            // Заменяем каждое анонимизированное имя на оригинальное
            sortedKeys.forEach(anonymized => {
                const original = this.reverseMapping[anonymized];

                // Используем word boundaries для точной замены
                // \b гарантирует что мы заменяем целые слова, а не части
                const regex = new RegExp(`\\b${this.escapeRegex(anonymized)}\\b`, 'g');
                result = result.replace(regex, original);
            });

            return result;
        } catch (error) {
            throw new Error(`Ошибка деанонимизации: ${error.message}`);
        }
    }

    /**
     * Экранирование специальных символов для regex
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Получить общее количество mappings
     */
    getTotalMappings() {
        if (!this.reverseMapping) return 0;
        return Object.keys(this.reverseMapping).length;
    }

    /**
     * Получить информацию о mapping файле
     */
    getMappingInfo() {
        if (!this.mappingData) {
            return null;
        }

        const mappings = this.mappingData.mappings;
        const timestamp = new Date(this.mappingData.timestamp);
        const now = new Date();
        const ageInDays = Math.floor((now - timestamp) / (1000 * 60 * 60 * 24));

        return {
            version: this.mappingData.version,
            timestamp: this.mappingData.timestamp,
            formattedTimestamp: this.formatTimestamp(timestamp),
            ageInDays: ageInDays,
            isOld: ageInDays > 30,
            stats: {
                functions: Object.keys(mappings.functions || {}).length,
                variables: Object.keys(mappings.variables || {}).length,
                classes: Object.keys(mappings.classes || {}).length,
                constants: Object.keys(mappings.constants || {}).length,
                strings: Object.keys(mappings.strings || {}).length,
                total: this.getTotalMappings()
            }
        };
    }

    /**
     * Форматировать timestamp для отображения
     */
    formatTimestamp(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return date.toLocaleDateString('ru-RU', options);
    }

    /**
     * Валидация mapping файла
     * @param {Object} mappingData - Данные для валидации
     * @returns {Object} - Результат валидации
     */
    static validateMapping(mappingData) {
        const errors = [];
        const warnings = [];

        // Проверка структуры
        if (!mappingData) {
            errors.push('Mapping файл пустой');
            return { valid: false, errors, warnings };
        }

        if (typeof mappingData !== 'object') {
            errors.push('Mapping файл должен быть JSON объектом');
            return { valid: false, errors, warnings };
        }

        // Проверка обязательных полей
        if (!mappingData.version) {
            errors.push('Отсутствует поле "version"');
        }

        if (!mappingData.timestamp) {
            warnings.push('Отсутствует поле "timestamp"');
        }

        if (!mappingData.mappings) {
            errors.push('Отсутствует поле "mappings"');
            return { valid: false, errors, warnings };
        }

        // Проверка структуры mappings
        const expectedCategories = ['functions', 'variables', 'classes', 'constants', 'strings'];
        const mappings = mappingData.mappings;

        expectedCategories.forEach(category => {
            if (!mappings[category]) {
                warnings.push(`Отсутствует категория "${category}"`);
            } else if (typeof mappings[category] !== 'object') {
                errors.push(`Категория "${category}" должна быть объектом`);
            }
        });

        // Проверка возраста файла
        if (mappingData.timestamp) {
            const timestamp = new Date(mappingData.timestamp);
            const now = new Date();
            const ageInDays = Math.floor((now - timestamp) / (1000 * 60 * 60 * 24));

            if (ageInDays > 30) {
                warnings.push(`Mapping файл старый (${ageInDays} дней). Возможны несоответствия.`);
            }
        }

        // Проверка на пустые mappings
        let totalMappings = 0;
        expectedCategories.forEach(category => {
            if (mappings[category]) {
                totalMappings += Object.keys(mappings[category]).length;
            }
        });

        if (totalMappings === 0) {
            warnings.push('Mapping файл не содержит ни одного соответствия');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            totalMappings
        };
    }

    /**
     * Экспорт mapping в читаемый формат
     */
    exportReadableMapping() {
        if (!this.mappingData) {
            return null;
        }

        const lines = [];
        lines.push('=== SafeCode AI Mapping File ===');
        lines.push(`Version: ${this.mappingData.version}`);
        lines.push(`Created: ${this.formatTimestamp(new Date(this.mappingData.timestamp))}`);
        lines.push('');

        const mappings = this.mappingData.mappings;

        // Классы
        if (mappings.classes && Object.keys(mappings.classes).length > 0) {
            lines.push('CLASSES:');
            Object.entries(mappings.classes).forEach(([original, anonymized]) => {
                lines.push(`  ${original} → ${anonymized}`);
            });
            lines.push('');
        }

        // Функции
        if (mappings.functions && Object.keys(mappings.functions).length > 0) {
            lines.push('FUNCTIONS:');
            Object.entries(mappings.functions).forEach(([original, anonymized]) => {
                lines.push(`  ${original} → ${anonymized}`);
            });
            lines.push('');
        }

        // Переменные
        if (mappings.variables && Object.keys(mappings.variables).length > 0) {
            lines.push('VARIABLES:');
            Object.entries(mappings.variables).forEach(([original, anonymized]) => {
                lines.push(`  ${original} → ${anonymized}`);
            });
            lines.push('');
        }

        // Константы
        if (mappings.constants && Object.keys(mappings.constants).length > 0) {
            lines.push('CONSTANTS:');
            Object.entries(mappings.constants).forEach(([original, anonymized]) => {
                lines.push(`  ${original} → ${anonymized}`);
            });
            lines.push('');
        }

        // Строки
        if (mappings.strings && Object.keys(mappings.strings).length > 0) {
            lines.push('STRINGS (URLs/Endpoints):');
            Object.entries(mappings.strings).forEach(([original, anonymized]) => {
                lines.push(`  ${original} → ${anonymized}`);
            });
            lines.push('');
        }

        return lines.join('\n');
    }

    /**
     * Сброс состояния
     */
    reset() {
        this.reverseMapping = null;
        this.mappingData = null;
    }
}

// Экспорт для использования в браузере
if (typeof window !== 'undefined') {
    window.CodeDeanonymizer = CodeDeanonymizer;
}
