/**
 * SafeCode AI - Anonymizer Module
 * Анонимизирует Java/Spring/Kafka/SQL код
 */

class CodeAnonymizer {
    constructor() {
        this.mapping = {
            functions: {},
            variables: {},
            classes: {},
            constants: {},
            strings: {},
            parameters: {},
            imports: {}
        };

        this.counters = {
            func: 0,
            var: 0,
            class: 0,
            const: 0,
            endpoint: 0,
            param: 0,
            str: 0,
            service: 0,
            repository: 0,
            dto: 0,
            entity: 0,
            feign: 0,
            adapter: 0,
            controller: 0,
            request: 0,
            response: 0,
            config: 0,
            aspect: 0,
            stream: 0,
            cache: 0,
            object: 0
        };

        this.keywords = new Set([
            'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
            'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
            'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
            'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
            'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
            'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
            'try', 'void', 'volatile', 'while',
            'let', 'var', 'function', 'async', 'await', 'yield', 'typeof', 'delete',
            'with', 'debugger', 'export', 'from', 'as', 'of', 'get', 'set',
            'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT',
            'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'LIKE', 'BETWEEN',
            'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT',
            'AS', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'CONSTRAINT', 'PRIMARY', 'KEY',
            'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK', 'DEFAULT', 'NULL', 'NOT NULL',
            'VARCHAR', 'INTEGER', 'DECIMAL', 'DATE', 'TIMESTAMP', 'BOOLEAN'
        ]);

        this.standardLibraries = new Set([
            'System', 'out', 'println', 'print', 'err',
            'String', 'Integer', 'Long', 'Double', 'Float', 'Boolean', 'Character',
            'Byte', 'Short', 'BigDecimal', 'BigInteger',
            'Object', 'Class', 'Enum', 'Thread', 'Runnable',
            'Exception', 'RuntimeException', 'Error', 'Throwable',
            'List', 'ArrayList', 'LinkedList', 'Vector',
            'Set', 'HashSet', 'TreeSet', 'LinkedHashSet',
            'Map', 'HashMap', 'TreeMap', 'LinkedHashMap', 'Hashtable',
            'Queue', 'Deque', 'Stack', 'PriorityQueue',
            'Collection', 'Collections', 'Arrays', 'Objects',
            'Optional', 'Stream', 'Collectors',
            'Comparator', 'Comparable', 'Iterator', 'Iterable',
            'File', 'Files', 'Path', 'Paths',
            'InputStream', 'OutputStream', 'Reader', 'Writer',
            'BufferedReader', 'BufferedWriter', 'FileReader', 'FileWriter',
            'Scanner', 'PrintWriter',
            'Date', 'Calendar', 'LocalDate', 'LocalDateTime', 'LocalTime',
            'Instant', 'Duration', 'Period', 'ZonedDateTime',
            'DateTimeFormatter', 'SimpleDateFormat',
            'Pattern', 'Matcher', 'UUID', 'Random', 'Math',
            'SQLException', 'ResultSet', 'PreparedStatement', 'CallableStatement', 'Connection',
            'Clob', 'Blob', 'DriverManager',
            'SpringApplication', 'SpringBootApplication', 'Configuration',
            'Component', 'Service', 'Repository', 'Controller', 'RestController',
            'Autowired', 'Qualifier', 'Value', 'Primary', 'Lazy',
            'Bean', 'Scope', 'Profile', 'Conditional',
            'RequestMapping', 'GetMapping', 'PostMapping', 'PutMapping', 'DeleteMapping', 'PatchMapping',
            'RequestBody', 'RequestParam', 'PathVariable', 'RequestHeader',
            'ResponseBody', 'ResponseStatus', 'ResponseEntity', 'HttpStatus',
            'ModelAttribute', 'SessionAttribute', 'CookieValue',
            'Transactional', 'EnableTransactionManagement',
            'Entity', 'Table', 'Column', 'Id', 'GeneratedValue', 'SequenceGenerator',
            'OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany', 'JoinColumn', 'JoinTable',
            'EnableJpaRepositories', 'EntityManager', 'Query',
            'JpaRepository', 'CrudRepository', 'PagingAndSortingRepository',
            'Cacheable', 'CacheEvict', 'CachePut', 'EnableCaching',
            'Scheduled', 'EnableScheduling', 'Async', 'EnableAsync',
            'ExceptionHandler', 'ControllerAdvice', 'RestControllerAdvice',
            'Valid', 'Validated', 'NotNull', 'NotEmpty', 'NotBlank', 'Size', 'Min', 'Max',
            'Email', 'Pattern', 'CrossOrigin', 'EnableWebMvc',
            'KafkaListener', 'EnableKafka', 'KafkaTemplate',
            'ProducerRecord', 'ConsumerRecord', 'RecordMetadata',
            'KafkaProducer', 'KafkaConsumer', 'SendResult', 'ListenableFuture',
            'Data', 'Getter', 'Setter', 'ToString', 'EqualsAndHashCode',
            'NoArgsConstructor', 'AllArgsConstructor', 'RequiredArgsConstructor',
            'Builder', 'Singular', 'Slf4j', 'Log', 'Log4j', 'Log4j2',
            'Cleanup', 'SneakyThrows', 'Synchronized',
            'Test', 'Before', 'After', 'BeforeEach', 'AfterEach',
            'BeforeAll', 'AfterAll', 'BeforeClass', 'AfterClass',
            'Mock', 'InjectMocks', 'Spy', 'Captor', 'MockBean', 'SpyBean',
            'RunWith', 'ExtendWith', 'SpringBootTest', 'WebMvcTest',
            'MockMvc', 'MockMultipartFile',
            'assertEquals', 'assertTrue', 'assertFalse', 'assertNull', 'assertNotNull',
            'assertThrows', 'assertDoesNotThrow',
            'verify', 'when', 'given', 'then', 'doReturn', 'doThrow',
            'JsonProperty', 'JsonIgnore', 'JsonFormat', 'JsonInclude',
            'ObjectMapper', 'JsonNode',
            'ConstraintViolation', 'Validator', 'ValidationException',
            'Logger', 'LoggerFactory', 'Level',
            'toString', 'equals', 'hashCode', 'clone', 'finalize',
            'wait', 'notify', 'notifyAll',
            'getClass', 'valueOf', 'values', 'ordinal', 'name',
            'length', 'size', 'isEmpty', 'contains', 'add', 'remove', 'clear',
            'get', 'set', 'put', 'replace', 'compute',
            'stream', 'filter', 'map', 'flatMap', 'reduce', 'collect',
            'forEach', 'findFirst', 'findAny', 'anyMatch', 'allMatch', 'noneMatch',
            'sorted', 'distinct', 'limit', 'skip', 'peek',
            'toList', 'toSet', 'toMap', 'joining', 'groupingBy',
            'split', 'trim', 'substring', 'indexOf', 'lastIndexOf',
            'startsWith', 'endsWith', 'matches', 'replaceAll', 'replaceFirst',
            'toUpperCase', 'toLowerCase', 'format',
            'parse', 'parseInt', 'parseLong', 'parseDouble',
            'read', 'write', 'close', 'flush',
            'getMessage', 'getCause', 'getStackTrace', 'printStackTrace',
            'compareTo', 'compare', 'getBody',
            'console', 'log', 'error', 'warn', 'info', 'debug',
            'JSON', 'stringify', 'Promise', 'resolve', 'reject',
            'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
            'fetch', 'Response', 'Request', 'Headers',
            'window', 'document', 'localStorage', 'sessionStorage',
            'addEventListener', 'removeEventListener',
            'getElementById', 'querySelector', 'querySelectorAll'
        ]);

        this.standardPackages = [
            'java.', 'javax.', 'jakarta.',
            'org.springframework.', 'org.apache.kafka.',
            'lombok.', 'org.junit.', 'org.mockito.',
            'com.fasterxml.jackson.', 'org.slf4j.',
            'org.hibernate.', 'org.apache.commons.',
            'com.google.', 'org.json.', 'io.swagger.',
            'oracle.jdbc.'
        ];

        this.specialSuffixes = {
            'Service': 'service',
            'Repository': 'repository',
            'Dto': 'dto',
            'Entity': 'entity',
            'Feign': 'feign',
            'Adapter': 'adapter',
            'Controller': 'controller',
            'Request': 'request',
            'Response': 'response',
            'Config': 'config',
            'Aspect': 'aspect',
            'Stream': 'stream',
            'Cache': 'cache'
        };

        this.customImportPrefixes = [];
        this.blacklist = new Set(); // Исключения из анонимизации
        this.genericTypes = new Set(); // Generics типы <T>, <R>, <E> и т.д.
        this.detectedCompanyPrefix = null; // Автоматически определенный префикс компании
        this.warnings = []; // Предупреждения для пользователя
    }

    anonymize(code, options) {
        if (!code || typeof code !== 'string') {
            throw new Error('Код должен быть непустой строкой');
        }

        this.resetState();

        if (options.customImportPrefixes && options.customImportPrefixes.trim()) {
            this.customImportPrefixes = options.customImportPrefixes
                .split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0);
        }

        // Blacklist (исключения из анонимизации)
        if (options.blacklist && options.blacklist.trim()) {
            const blacklistItems = options.blacklist
                .split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0);
            this.blacklist = new Set(blacklistItems);
        }

        let result = code;

        try {
            const fileType = this.detectFileType(code);
            const isJava = fileType === 'java';

            // Для конфигурационных файлов используем специальную логику
            if (fileType === 'xml') {
                return this.anonymizeXML(result, options);
            } else if (fileType === 'yaml') {
                return this.anonymizeYAML(result, options);
            } else if (fileType === 'json') {
                return this.anonymizeJSON(result, options);
            } else if (fileType === 'properties') {
                return this.anonymizeProperties(result, options);
            }

            // Java code анонимизация
            // 0. Автоматически определить префикс компании из package
            this.autoDetectCompanyPrefix(result);

            // 0.1 Собрать generics типы
            this.collectGenericTypes(result);

            // 0.2 Проверить wildcard imports с префиксом компании
            this.checkWildcardImports(result);

            // 1. Комментарии
            if (options.removeComments) {
                result = this.anonymizeComments(result);
            }

            // 2. Package
            result = this.anonymizePackage(result);

            // 3. Импорты (собрать custom классы)
            result = this.anonymizeImports(result);

            // 4. Собрать имена
            this.collectNames(result, isJava);

            // 5. Строки
            if (options.anonymizeStrings) {
                result = this.anonymizeStrings(result);
            }

            // 6. Заменить все
            result = this.replaceAllNames(result);

            return {
                code: result,
                mapping: this.createMappingFile(),
                warnings: this.warnings
            };
        } catch (error) {
            throw new Error(`Ошибка анонимизации: ${error.message}`);
        }
    }

    detectFileType(code) {
        // Определяем тип файла
        const trimmed = code.trim();

        // XML/HTML
        if (trimmed.startsWith('<?xml') || trimmed.startsWith('<beans') ||
            trimmed.startsWith('<configuration') || /<[a-zA-Z][^>]*>/.test(trimmed.substring(0, 100))) {
            return 'xml';
        }

        // YAML
        if (/^[a-zA-Z][a-zA-Z0-9-]*:\s*$/m.test(code) || /^  [a-zA-Z][a-zA-Z0-9-]*:/m.test(code)) {
            return 'yaml';
        }

        // JSON
        if ((trimmed.startsWith('{') || trimmed.startsWith('[')) &&
            (trimmed.endsWith('}') || trimmed.endsWith(']'))) {
            try {
                JSON.parse(code);
                return 'json';
            } catch (e) {
                // Не JSON, продолжаем проверку
            }
        }

        // Properties
        if (/^[a-zA-Z][a-zA-Z0-9._-]*\s*[=:]/m.test(code)) {
            return 'properties';
        }

        // Java code
        if (code.includes('public class') ||
            code.includes('private class') ||
            code.includes('protected class') ||
            code.includes('class ') ||
            code.includes('import java.') ||
            code.includes('import org.springframework.') ||
            code.includes('@Override') ||
            code.includes('@Component') ||
            code.includes('public static') ||
            code.includes('private static') ||
            code.includes('void ') ||
            /\b(?:public|private|protected)\s+(?:static\s+)?(?:void|int|long|double|float|boolean|String)\s+\w+\s*\(/.test(code) ||
            code.includes(';') && (code.includes('int ') || code.includes('long ') || code.includes('String '))) {
            return 'java';
        }

        return 'unknown';
    }

    detectJava(code) {
        return this.detectFileType(code) === 'java';
    }

    resetState() {
        this.mapping = {
            functions: {},
            variables: {},
            classes: {},
            constants: {},
            strings: {},
            parameters: {},
            imports: {}
        };
        this.counters = {
            func: 0,
            var: 0,
            class: 0,
            const: 0,
            endpoint: 0,
            param: 0,
            str: 0,
            service: 0,
            repository: 0,
            dto: 0,
            entity: 0,
            feign: 0,
            adapter: 0,
            controller: 0,
            request: 0,
            response: 0,
            config: 0,
            aspect: 0,
            stream: 0,
            cache: 0,
            object: 0
        };
        this.customImportPrefixes = [];
        this.blacklist = new Set();
        this.genericTypes = new Set();
        this.detectedCompanyPrefix = null;
        this.warnings = [];
    }

    autoDetectCompanyPrefix(code) {
        // Находим первый package declaration
        const packageRegex = /^package\s+([\w.]+);/m;
        const match = packageRegex.exec(code);

        if (!match) return;

        const packageName = match[1];

        // Проверяем что это не стандартный package
        const isStandard = this.standardPackages.some(pkg => packageName.startsWith(pkg));
        if (isStandard) return;

        // Извлекаем префикс компании
        // Логика: берем первые 2-3 части package name
        const parts = packageName.split('.');

        if (parts.length === 1) {
            // Простой случай: "example"
            this.detectedCompanyPrefix = parts[0];
        } else if (parts.length === 2) {
            // "com.company"
            this.detectedCompanyPrefix = packageName;
        } else if (parts.length >= 3) {
            // "kz.one.bpm.colvir.adapter.client" -> берем первые 3 части "kz.one.bpm"
            // "com.mycompany.project" -> "com.mycompany.project"

            // Проверяем паттерн: если первая часть короткая (2 символа), берем 3 части
            if (parts[0].length <= 2) {
                this.detectedCompanyPrefix = parts.slice(0, 3).join('.');
            } else {
                this.detectedCompanyPrefix = parts.slice(0, 2).join('.');
            }
        }

        // Добавляем автоматически определенный префикс к customImportPrefixes
        if (this.detectedCompanyPrefix && !this.customImportPrefixes.includes(this.detectedCompanyPrefix)) {
            this.customImportPrefixes.push(this.detectedCompanyPrefix);
        }
    }

    checkWildcardImports(code) {
        // Проверяем импорты с wildcard (.*) и префиксом компании
        const wildcardRegex = /^import\s+(?:static\s+)?([\w.]+\.\*);/gm;
        let match;
        const foundWildcards = [];

        while ((match = wildcardRegex.exec(code)) !== null) {
            const importPath = match[1];

            // Проверяем является ли это импортом компании
            const isCompanyImport = this.customImportPrefixes.some(prefix =>
                importPath.startsWith(prefix)
            );

            if (isCompanyImport) {
                foundWildcards.push(match[0]);
            }
        }

        // Показываем только одно уведомление, если найдены wildcard imports
        if (foundWildcards.length > 0) {
            const importsList = foundWildcards.map(imp => `  • ${imp}`).join('\n');
            this.warnings.push({
                type: 'wildcard_import',
                message: `⚠️ Обнаружено ${foundWildcards.length} wildcard import(s):\n${importsList}\n\nВсе классы под этими импортами НЕ будут анонимизированы, так как мы не знаем их имена заранее. Рекомендуется заменить на конкретные импорты.`,
                count: foundWildcards.length
            });
        }
    }

    collectGenericTypes(code) {
        // Собираем все generic типы из <T>, <E>, <R> и т.д.
        const genericRegex = /<([A-Z](?:,\s*[A-Z])*)>/g;
        let match;
        while ((match = genericRegex.exec(code)) !== null) {
            const types = match[1].split(',').map(t => t.trim());
            types.forEach(type => this.genericTypes.add(type));
        }
    }

    anonymizePackage(code) {
        // Анонимизируем package declarations
        const packageRegex = /^package\s+([\w.]+);/gm;
        return code.replace(packageRegex, (match, packageName) => {
            const isStandard = this.standardPackages.some(pkg => packageName.startsWith(pkg));
            if (isStandard) {
                return match;
            }
            return 'package com.anonymous;';
        });
    }

    anonymizeImports(code) {
        // Обрабатываем обычные и static imports
        const importRegex = /^import\s+(static\s+)?([\w.]+\*?);/gm;

        return code.replace(importRegex, (match, staticKeyword, importPath) => {
            // Проверяем standard
            const isStandard = this.standardPackages.some(pkg => importPath.startsWith(pkg));
            if (isStandard) {
                return match;
            }

            // Проверяем custom
            const isCustom = this.customImportPrefixes.some(prefix => importPath.startsWith(prefix));
            if (!isCustom) {
                return match;
            }

            // Wildcard import
            if (importPath.endsWith('.*')) {
                return `import ${staticKeyword || ''}com.anonymous.*;`;
            }

            // Конкретный класс
            const parts = importPath.split('.');
            const className = parts[parts.length - 1];

            // Анонимизируем с типом
            const anonymized = this.getSpecialAnonymizedName(className);

            if (!this.mapping.classes[className]) {
                this.mapping.classes[className] = anonymized;
            }

            return `import ${staticKeyword || ''}com.anonymous.${anonymized};`;
        });
    }

    collectNames(code, isJava) {
        if (!isJava) return;

        let match;

        // 1. Классы
        const classRegex = /\b(?:public\s+|private\s+|protected\s+)?(?:static\s+|final\s+|abstract\s+)?class\s+([A-Z][a-zA-Z0-9_]*)/g;
        while ((match = classRegex.exec(code)) !== null) {
            const name = match[1];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name) && !this.genericTypes.has(name)) {
                if (!this.mapping.classes[name]) {
                    const anonymized = this.getSpecialAnonymizedName(name);
                    this.mapping.classes[name] = anonymized;
                }
            }
        }

        // 2. extends/implements
        const extendsRegex = /\b(?:extends|implements)\s+([A-Z][a-zA-Z0-9_]*)/g;
        while ((match = extendsRegex.exec(code)) !== null) {
            const name = match[1];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name) && !this.genericTypes.has(name)) {
                if (!this.mapping.classes[name]) {
                    const anonymized = this.getSpecialAnonymizedName(name);
                    this.mapping.classes[name] = anonymized;
                }
            }
        }

        // 3. Методы (включая геттеры/сеттеры)
        const methodRegex = /\b(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?(?:synchronized\s+)?(?:[\w<>[\]]+)\s+([a-z][a-zA-Z0-9_]*)\s*\(/g;
        while ((match = methodRegex.exec(code)) !== null) {
            const name = match[1];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name)) {
                if (!this.mapping.functions[name]) {
                    // Геттер/сеттер?
                    this.handleGetterSetter(name);
                    // После handleGetterSetter проверяем был ли добавлен mapping
                    if (!this.mapping.functions[name]) {
                        this.counters.func++;
                        this.mapping.functions[name] = `method${this.counters.func}`;
                    }
                }
            }
        }

        // 4. Константы (имя, не значение!)
        const constRegex = /\b(?:private\s+|public\s+|protected\s+)?(?:static\s+)?final\s+[\w<>[\]]+\s+([A-Z][A-Z0-9_]*)\s*=/g;
        while ((match = constRegex.exec(code)) !== null) {
            const name = match[1];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name)) {
                if (!this.mapping.constants[name]) {
                    this.counters.const++;
                    this.mapping.constants[name] = `CONST${this.counters.const}`;
                }
            }
        }

        // 5. Поля
        const fieldRegex = /\b(?:private\s+|public\s+|protected\s+)?(?:static\s+)?(?:final\s+)?([\w<>[\]]+)\s+([a-z][a-zA-Z0-9_]*)\s*[=;]/g;
        while ((match = fieldRegex.exec(code)) !== null) {
            const type = match[1];
            const name = match[2];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name) && !this.mapping.functions[name]) {
                if (!this.mapping.variables[name]) {
                    const anonymized = this.getSpecialAnonymizedName(name, type);
                    this.mapping.variables[name] = anonymized;
                }
            }
        }

        // 6. Параметры
        const paramRegex = /\(([^)]+)\)/g;
        while ((match = paramRegex.exec(code)) !== null) {
            const params = match[1];
            if (!params.trim()) continue;

            const paramList = params.split(',');
            paramList.forEach(param => {
                const trimmed = param.trim();
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    const paramName = parts[parts.length - 1].replace(/[[\]]/g, '');
                    if (paramName && !this.keywords.has(paramName) && !this.standardLibraries.has(paramName) &&
                        !this.blacklist.has(paramName) && !this.genericTypes.has(paramName)) {
                        if (!this.mapping.parameters[paramName]) {
                            this.counters.param++;
                            this.mapping.parameters[paramName] = `param${this.counters.param}`;
                        }
                    }
                }
            });
        }

        // 7. Локальные переменные
        const localVarRegex = /\b([\w<>[\]]+)\s+([a-z][a-zA-Z0-9_]*)\s*=/g;
        while ((match = localVarRegex.exec(code)) !== null) {
            const type = match[1];
            const name = match[2];
            if (!this.keywords.has(name) && !this.standardLibraries.has(name) &&
                !this.blacklist.has(name) && !this.mapping.functions[name] && !this.mapping.parameters[name]) {
                if (!this.mapping.variables[name]) {
                    const anonymized = this.getSpecialAnonymizedName(name, type);
                    this.mapping.variables[name] = anonymized;
                }
            }
        }
    }

    /**
     * Обработка геттеров/сеттеров
     */
    handleGetterSetter(methodName) {
        // getPrequestId -> getPar1
        const getterMatch = methodName.match(/^get([A-Z][a-zA-Z0-9]*)$/);
        if (getterMatch) {
            const fieldName = getterMatch[1].charAt(0).toLowerCase() + getterMatch[1].slice(1);
            if (!this.mapping.parameters[fieldName]) {
                this.counters.param++;
                this.mapping.parameters[fieldName] = `par${this.counters.param}`;
            }
            const anonymized = `get${this.capitalizeFirst(this.mapping.parameters[fieldName])}`;
            this.mapping.functions[methodName] = anonymized;
            return;
        }

        // setPrequestId -> setPar1
        const setterMatch = methodName.match(/^set([A-Z][a-zA-Z0-9]*)$/);
        if (setterMatch) {
            const fieldName = setterMatch[1].charAt(0).toLowerCase() + setterMatch[1].slice(1);
            if (!this.mapping.parameters[fieldName]) {
                this.counters.param++;
                this.mapping.parameters[fieldName] = `par${this.counters.param}`;
            }
            const anonymized = `set${this.capitalizeFirst(this.mapping.parameters[fieldName])}`;
            this.mapping.functions[methodName] = anonymized;
            return;
        }

        // isActive -> isPar1
        const isMatch = methodName.match(/^is([A-Z][a-zA-Z0-9]*)$/);
        if (isMatch) {
            const fieldName = isMatch[1].charAt(0).toLowerCase() + isMatch[1].slice(1);
            if (!this.mapping.parameters[fieldName]) {
                this.counters.param++;
                this.mapping.parameters[fieldName] = `par${this.counters.param}`;
            }
            const anonymized = `is${this.capitalizeFirst(this.mapping.parameters[fieldName])}`;
            this.mapping.functions[methodName] = anonymized;
            return;
        }
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getSpecialAnonymizedName(name, type = '') {
        // Проверяем суффиксы
        for (const [suffix, counterKey] of Object.entries(this.specialSuffixes)) {
            if (name.endsWith(suffix) || type.endsWith(suffix)) {
                this.counters[counterKey]++;
                return `${suffix}${this.counters[counterKey]}`;
            }
        }

        // Обычная анонимизация
        if (/^[A-Z]/.test(name)) {
            this.counters.object++;
            return `Object${this.counters.object}`;
        } else {
            this.counters.var++;
            return `var${this.counters.var}`;
        }
    }

    replaceAllNames(code) {
        let result = code;

        const allMappings = {
            ...this.mapping.classes,
            ...this.mapping.functions,
            ...this.mapping.constants,
            ...this.mapping.variables,
            ...this.mapping.parameters
        };

        const sortedNames = Object.keys(allMappings).sort((a, b) => b.length - a.length);

        sortedNames.forEach(original => {
            const anonymized = allMappings[original];
            const regex = new RegExp(`(?<!\\d)\\b${this.escapeRegex(original)}\\b(?!\\d)`, 'g');

            result = result.replace(regex, (match, offset) => {
                const before = result[offset - 1];
                const after = result[offset + match.length];

                if (/\d/.test(before) || /\d/.test(after)) {
                    return match;
                }

                return anonymized;
            });
        });

        return result;
    }

    anonymizeStrings(code) {
        let result = code;

        // SQL
        const queryRegex = /@Query\(([\s\S]*?)\)/g;
        result = result.replace(queryRegex, (match, content) => {
            let sqlAnonymized = content;

            sqlAnonymized = sqlAnonymized.replace(/(?:FROM|JOIN)\s+([a-z_][a-z0-9_]*)/gi, (m, tableName) => {
                if (!this.mapping.strings[tableName]) {
                    this.counters.str++;
                    this.mapping.strings[tableName] = `table${this.counters.str}`;
                }
                return m.replace(tableName, this.mapping.strings[tableName]);
            });

            sqlAnonymized = sqlAnonymized.replace(/\b([a-z_][a-z0-9_]*)\s*[=<>]/gi, (m, colName) => {
                const upper = colName.toUpperCase();
                if (this.keywords.has(upper)) return m;

                if (!this.mapping.strings[colName]) {
                    this.counters.str++;
                    this.mapping.strings[colName] = `col${this.counters.str}`;
                }
                return m.replace(colName, this.mapping.strings[colName]);
            });

            return `@Query(${sqlAnonymized})`;
        });

        // API endpoints
        const apiRegex = /(["'])(\/api\/[^"'\s]+)\1/g;
        result = result.replace(apiRegex, (match, quote, url) => {
            if (!this.mapping.strings[url]) {
                this.counters.endpoint++;
                this.mapping.strings[url] = `/api/endpoint${this.counters.endpoint}`;
            }
            return quote + this.mapping.strings[url] + quote;
        });

        // URLs
        const urlRegex = /(["'])(https?:\/\/[^\s"']+)\1/g;
        result = result.replace(urlRegex, (match, quote, url) => {
            if (!this.mapping.strings[url]) {
                this.counters.endpoint++;
                this.mapping.strings[url] = `https://example.com/endpoint${this.counters.endpoint}`;
            }
            return quote + this.mapping.strings[url] + quote;
        });

        // @Value
        const valueRegex = /@Value\(["'](\$\{[^}]+\})["']\)/g;
        result = result.replace(valueRegex, (match, prop) => {
            if (!this.mapping.strings[prop]) {
                this.counters.str++;
                this.mapping.strings[prop] = `\${property${this.counters.str}}`;
            }
            return `@Value("${this.mapping.strings[prop]}")`;
        });

        // Все строки
        const stringRegex = /(["'])([^"'\n]+)\1/g;
        result = result.replace(stringRegex, (match, quote, str) => {
            if (str.includes('endpoint') || str.includes('property') ||
                str.includes('String') || str.includes('table') || str.includes('col')) {
                return match;
            }

            if (!str.trim()) {
                return match;
            }

            if (!this.mapping.strings[str]) {
                this.counters.str++;
                this.mapping.strings[str] = `String${this.counters.str}`;
            }

            return quote + this.mapping.strings[str] + quote;
        });

        // API keys
        const apiKeyRegex = /(["'])(?:sk-|key_|token_|api[_-]?key[_-]?)([a-zA-Z0-9]{16,})\1/gi;
        result = result.replace(apiKeyRegex, (match, quote) => {
            return quote + 'REDACTED_API_KEY' + quote;
        });

        return result;
    }

    anonymizeComments(code) {
        let result = code;
        let commentCounter = 0;

        // Многострочные комментарии /* ... */
        result = result.replace(/\/\*[\s\S]*?\*\//g, () => {
            commentCounter++;
            return `/* comment${commentCounter} */`;
        });

        // Однострочные комментарии //
        result = result.replace(/\/\/.*$/gm, () => {
            commentCounter++;
            return `// comment${commentCounter}`;
        });

        return result;
    }

    anonymizeXML(code, options) {
        let result = code;
        const propertyMapping = {};
        let propertyCounter = 0;

        // Анонимизируем bean ids и names
        result = result.replace(/\bid\s*=\s*["']([^"']+)["']/g, (match, id) => {
            if (!propertyMapping[id]) {
                propertyCounter++;
                propertyMapping[id] = `bean${propertyCounter}`;
            }
            return `id="${propertyMapping[id]}"`;
        });

        result = result.replace(/\bname\s*=\s*["']([^"']+)["']/g, (match, name) => {
            if (!propertyMapping[name]) {
                propertyCounter++;
                propertyMapping[name] = `name${propertyCounter}`;
            }
            return `name="${propertyMapping[name]}"`;
        });

        // Анонимизируем package/class references
        result = result.replace(/\bclass\s*=\s*["']([a-zA-Z][a-zA-Z0-9._]*)["']/g, (match, className) => {
            const isCustom = this.customImportPrefixes.some(prefix => className.startsWith(prefix));
            if (isCustom) {
                return `class="com.anonymous.Class${propertyCounter++}"`;
            }
            return match;
        });

        // Анонимизируем property values (но не стандартные значения)
        result = result.replace(/\bvalue\s*=\s*["']([^"']+)["']/g, (match, value) => {
            if (options.anonymizeStrings && !/^(true|false|\d+|null)$/.test(value)) {
                if (!propertyMapping[value]) {
                    propertyCounter++;
                    propertyMapping[value] = `value${propertyCounter}`;
                }
                return `value="${propertyMapping[value]}"`;
            }
            return match;
        });

        return {
            code: result,
            mapping: { properties: propertyMapping },
            warnings: this.warnings
        };
    }

    anonymizeYAML(code, options) {
        let result = code;
        const propertyMapping = {};
        let propertyCounter = 0;

        // Анонимизируем ключи (но не стандартные Spring/application.yml ключи)
        const standardKeys = new Set([
            'server', 'port', 'spring', 'application', 'name', 'datasource',
            'url', 'username', 'password', 'jpa', 'hibernate', 'ddl-auto',
            'show-sql', 'logging', 'level', 'kafka', 'bootstrap-servers',
            'consumer', 'group-id', 'producer', 'key-serializer', 'value-serializer'
        ]);

        // Анонимизируем custom property keys
        result = result.replace(/^(\s*)([a-zA-Z][a-zA-Z0-9-]*):(.*)$/gm, (match, indent, key, value) => {
            if (!standardKeys.has(key) && !standardKeys.has(key.replace(/-/g, ''))) {
                if (!propertyMapping[key]) {
                    propertyCounter++;
                    propertyMapping[key] = `property${propertyCounter}`;
                }
                return `${indent}${propertyMapping[key]}:${value}`;
            }
            return match;
        });

        // Анонимизируем строковые значения
        if (options.anonymizeStrings) {
            result = result.replace(/:\s*["']([^"']+)["']/g, (match, value) => {
                if (!/^(true|false|\d+|null|localhost|http)/.test(value)) {
                    if (!propertyMapping[value]) {
                        propertyCounter++;
                        propertyMapping[value] = `string${propertyCounter}`;
                    }
                    return `: "${propertyMapping[value]}"`;
                }
                return match;
            });
        }

        return {
            code: result,
            mapping: { properties: propertyMapping },
            warnings: this.warnings
        };
    }

    anonymizeJSON(code, options) {
        try {
            const obj = JSON.parse(code);
            const propertyMapping = {};
            let propertyCounter = 0;

            const anonymizeObject = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.map(item => anonymizeObject(item));
                } else if (obj !== null && typeof obj === 'object') {
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        // Анонимизируем ключи (кроме стандартных)
                        const standardKeys = ['id', 'name', 'type', 'value', 'data', 'status', 'message'];
                        let newKey = key;
                        if (!standardKeys.includes(key)) {
                            if (!propertyMapping[key]) {
                                propertyCounter++;
                                propertyMapping[key] = `key${propertyCounter}`;
                            }
                            newKey = propertyMapping[key];
                        }
                        result[newKey] = anonymizeObject(value);
                    }
                    return result;
                } else if (typeof obj === 'string' && options.anonymizeStrings) {
                    if (!/^(true|false|\d+|null)$/.test(obj)) {
                        if (!propertyMapping[obj]) {
                            propertyCounter++;
                            propertyMapping[obj] = `string${propertyCounter}`;
                        }
                        return propertyMapping[obj];
                    }
                }
                return obj;
            };

            const anonymized = anonymizeObject(obj);
            return {
                code: JSON.stringify(anonymized, null, 2),
                mapping: { properties: propertyMapping },
                warnings: this.warnings
            };
        } catch (e) {
            throw new Error(`Invalid JSON: ${e.message}`);
        }
    }

    anonymizeProperties(code, options) {
        let result = code;
        const propertyMapping = {};
        let propertyCounter = 0;

        // Анонимизируем property keys
        result = result.replace(/^([a-zA-Z][a-zA-Z0-9._-]*)\s*[=:]\s*(.*)$/gm, (match, key, value) => {
            // Не анонимизируем стандартные Spring Boot properties
            const standardPrefixes = [
                'server.', 'spring.', 'logging.', 'management.',
                'kafka.', 'eureka.', 'hystrix.', 'ribbon.'
            ];

            const isStandard = standardPrefixes.some(prefix => key.startsWith(prefix));
            let newKey = key;

            if (!isStandard) {
                if (!propertyMapping[key]) {
                    propertyCounter++;
                    propertyMapping[key] = `property${propertyCounter}`;
                }
                newKey = propertyMapping[key];
            }

            // Анонимизируем значения
            let newValue = value;
            if (options.anonymizeStrings && value.trim() && !/^(\d+|true|false)$/.test(value.trim())) {
                const trimmedValue = value.trim();
                if (!propertyMapping[trimmedValue]) {
                    propertyCounter++;
                    propertyMapping[trimmedValue] = `value${propertyCounter}`;
                }
                newValue = value.replace(trimmedValue, propertyMapping[trimmedValue]);
            }

            return `${newKey}=${newValue}`;
        });

        return {
            code: result,
            mapping: { properties: propertyMapping },
            warnings: this.warnings
        };
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    createMappingFile() {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            customImportPrefixes: this.customImportPrefixes,
            mappings: this.mapping
        };
    }

    getStats() {
        return {
            functions: Object.keys(this.mapping.functions).length,
            variables: Object.keys(this.mapping.variables).length,
            classes: Object.keys(this.mapping.classes).length,
            constants: Object.keys(this.mapping.constants).length,
            strings: Object.keys(this.mapping.strings).length,
            parameters: Object.keys(this.mapping.parameters).length,
            imports: Object.keys(this.mapping.imports).length,
            total: Object.keys(this.mapping.functions).length +
                   Object.keys(this.mapping.variables).length +
                   Object.keys(this.mapping.classes).length +
                   Object.keys(this.mapping.constants).length +
                   Object.keys(this.mapping.strings).length +
                   Object.keys(this.mapping.parameters).length +
                   Object.keys(this.mapping.imports).length
        };
    }
}

if (typeof window !== 'undefined') {
    window.CodeAnonymizer = CodeAnonymizer;
}
