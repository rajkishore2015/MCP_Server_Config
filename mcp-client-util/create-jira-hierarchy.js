/**
 * create-jira-hierarchy.js
 *
 * Creates a full Jira hierarchy for the UserAppBG Spring Boot 3 backend
 * aligned to the actual code implementation and MSSQL DB changes.
 *
 * Hierarchy:
 *   Epic
 *     └─ Story  (linked via Epic Link customfield_10014)
 *          └─ Sub-task (parent = story key)
 *     └─ Task   (linked via Epic Link customfield_10014)
 */

require('dotenv').config();
const axios = require('axios');

const JIRA_BASE  = 'http://localhost:8080';
const JIRA_USER  = 'Raj2026';
const JIRA_PASS  = 'Dinesh1@';
const PROJECT    = 'US';
const AUTH       = Buffer.from(`${JIRA_USER}:${JIRA_PASS}`).toString('base64');
const HEADERS    = { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' };

async function post(fields) {
  const r = await axios.post(`${JIRA_BASE}/rest/api/2/issue`, { fields }, { headers: HEADERS, timeout: 10000 });
  return r.data;
}

async function linkToEpic(issueKey, epicKey) {
  try {
    // Agile API: move issue into epic
    await axios.post(
      `${JIRA_BASE}/rest/agile/1.0/epic/${epicKey}/issue`,
      { issues: [issueKey] },
      { headers: HEADERS, timeout: 10000 }
    );
  } catch (_) {
    // Fallback: update via field directly
    try {
      await axios.put(
        `${JIRA_BASE}/rest/api/2/issue/${issueKey}`,
        { fields: { customfield_10014: epicKey } },
        { headers: HEADERS, timeout: 10000 }
      );
    } catch (__) { /* epic link not critical – continue */ }
  }
}

async function createEpic(summary, epicName, description) {
  const r = await post({ project: { key: PROJECT }, summary, description, issuetype: { name: 'Epic' }, customfield_10102: epicName });
  console.log(`  [EPIC]     ${r.key}  ${summary}`);
  return r.key;
}

async function createStory(epicKey, summary, description) {
  const r = await post({ project: { key: PROJECT }, summary, description: `[Epic: ${epicKey}] ${description}`, issuetype: { name: 'Story' } });
  await linkToEpic(r.key, epicKey);
  console.log(`    [STORY]  ${r.key}  ${summary}`);
  return r.key;
}

async function createTask(epicKey, summary, description) {
  const r = await post({ project: { key: PROJECT }, summary, description: `[Epic: ${epicKey}] ${description}`, issuetype: { name: 'Task' } });
  await linkToEpic(r.key, epicKey);
  console.log(`    [TASK]   ${r.key}  ${summary}`);
  return r.key;
}

async function createSubtask(parentKey, summary, description) {
  const r = await post({ project: { key: PROJECT }, summary, description, issuetype: { name: 'Sub-task' }, parent: { key: parentKey } });
  console.log(`      [SUB]  ${r.key}  ${summary}`);
  return r.key;
}

(async () => {
  console.log('\n=== UserAppBG – Jira Hierarchy Creation ===\n');

  // ─────────────────────────────────────────────────────────────────────────────
  // EPIC 1 — Project Setup & Configuration
  // ─────────────────────────────────────────────────────────────────────────────
  const e1 = await createEpic(
    'Spring Boot 3 Backend – Project Setup & Configuration',
    'BE Project Setup',
    'Initial Maven project setup, Spring Boot 3 dependencies, and application configuration.'
  );

  const s1_1 = await createStory(e1,
    'Configure Maven Project for Spring Boot 3',
    'Set up pom.xml with all required Spring Boot 3 starters and MSSQL JDBC driver.'
  );
  await createSubtask(s1_1, 'Add spring-boot-starter-data-jpa dependency', 'Configure JPA/Hibernate with SQL Server dialect in pom.xml.');
  await createSubtask(s1_1, 'Add mssql-jdbc driver dependency', 'Add com.microsoft.sqlserver:mssql-jdbc to pom.xml.');
  await createSubtask(s1_1, 'Add spring-boot-starter-validation dependency', 'Enable Jakarta Bean Validation (Hibernate Validator).');
  await createSubtask(s1_1, 'Add spring-boot-starter-web dependency', 'Enable Spring MVC REST controller support.');

  const s1_2 = await createStory(e1,
    'Configure Application Properties for MSSQL DataSource',
    'Define MSSQL datasource, Hibernate DDL strategy, and logging in application.yml.'
  );
  await createSubtask(s1_2, 'Configure JDBC URL for SQL Server with databaseName=UserDB', 'Set jdbc:sqlserver with encrypt=false and trustServerCertificate=true.');
  await createSubtask(s1_2, 'Configure Hibernate DDL auto=update for schema management', 'Use spring.jpa.hibernate.ddl-auto: update to auto-create/migrate tables.');
  await createSubtask(s1_2, 'Set org.hibernate.dialect.SQLServerDialect', 'Configure Hibernate dialect for MSSQL-compatible SQL generation.');
  await createSubtask(s1_2, 'Configure logging levels for SQL and application', 'Set WARN for hibernate.SQL and INFO for com.sample.ollama.');

  await createTask(e1,
    'Set up MSSQL 2022 Docker container for local development',
    'Run mssql2022 Docker container on port 1434 with SA password and create UserDB database.'
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // EPIC 2 — MSSQL Database Layer
  // ─────────────────────────────────────────────────────────────────────────────
  const e2 = await createEpic(
    'MSSQL Database Layer – Schema & Connectivity',
    'MSSQL DB Layer',
    'Full MSSQL database provisioning and schema design for UserDB aligned to the User JPA entity.'
  );

  const s2_1 = await createStory(e2,
    'Provision UserDB Schema in MSSQL',
    'Create the UserDB database and design the users table aligned to the User JPA entity.'
  );
  await createSubtask(s2_1, 'Create UserDB database in SQL Server 2022', 'Execute: CREATE DATABASE UserDB on the mssql2022 Docker instance.');
  await createSubtask(s2_1, 'Create users table with BIGINT IDENTITY primary key', 'Column: id BIGINT IDENTITY(1,1) PRIMARY KEY – mapped to @GeneratedValue(IDENTITY).');
  await createSubtask(s2_1, 'Add firstName and lastName VARCHAR(100) NOT NULL columns', 'Maps to @Column(nullable=false) on User entity firstName/lastName fields.');
  await createSubtask(s2_1, 'Add email VARCHAR(255) NOT NULL UNIQUE column', 'Maps to @Column(nullable=false, unique=true) on User entity email field.');
  await createSubtask(s2_1, 'Add phone VARCHAR(40) NULL column', 'Maps to optional @Column phone field in User entity.');
  await createSubtask(s2_1, 'Add active BIT NOT NULL DEFAULT 1 column', 'Maps to @Column(nullable=false) boolean active field in User entity.');
  await createSubtask(s2_1, 'Add createdAt and updatedAt DATETIMEOFFSET NOT NULL audit columns', 'Maps to @PrePersist/@PreUpdate OffsetDateTime fields in User entity.');

  const s2_2 = await createStory(e2,
    'Configure MSSQL Connection Pool and DataSource',
    'Tune HikariCP connection pool settings for MSSQL connectivity and validate Docker container access.'
  );
  await createSubtask(s2_2, 'Configure MSSQL_HOST, MSSQL_PORT, MSSQL_DATABASE environment variables', 'Use ${MSSQL_HOST:localhost} placeholders in application.yml for 12-factor config.');
  await createSubtask(s2_2, 'Validate MSSQL connection from Spring Boot application startup', 'Confirm DataSource initialization succeeds and Hibernate schema update runs on startup.');
  await createSubtask(s2_2, 'Test SQL Server authentication with sa user and strong password', 'Verify MSSQL_USER=sa and MSSQL_PASSWORD=MyStrongPassw0rd! connect successfully.');

  await createTask(e2,
    'Write MSSQL schema migration script for UserDB.users table',
    'Provide idempotent DDL script for CI/CD: CREATE TABLE IF NOT EXISTS users (...).'
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // EPIC 3 — Domain, Repository & Service Layer
  // ─────────────────────────────────────────────────────────────────────────────
  const e3 = await createEpic(
    'User Domain, Repository & Service Layer',
    'BE Domain & Service',
    'Java domain model (JPA entity), Spring Data JPA repository, and transactional service layer for user CRUD.'
  );

  const s3_1 = await createStory(e3,
    'Implement User JPA Entity',
    'Model the users table as a JPA @Entity with audit timestamps and column constraints.'
  );
  await createSubtask(s3_1, 'Define @Entity @Table(name="users") annotations on User class', 'Place in com.sample.ollama.domain package.');
  await createSubtask(s3_1, 'Add @Id @GeneratedValue(strategy=IDENTITY) on id field', 'Maps to BIGINT IDENTITY PK in MSSQL users table.');
  await createSubtask(s3_1, 'Apply @Column(nullable=false, unique=true) on email field', 'Enforces DB-level unique constraint via Hibernate DDL.');
  await createSubtask(s3_1, 'Implement @PrePersist to set createdAt and updatedAt on insert', 'Use OffsetDateTime.now() in void onCreate() method.');
  await createSubtask(s3_1, 'Implement @PreUpdate to refresh updatedAt on every save', 'Use OffsetDateTime.now() in void onUpdate() method.');
  await createSubtask(s3_1, 'Add @Column(updatable=false) on createdAt field', 'Prevents Hibernate from updating createdAt after initial insert.');

  const s3_2 = await createStory(e3,
    'Implement UserRepository with Spring Data JPA',
    'Extend JpaRepository to get full CRUD, pagination, and derived query support for User entity.'
  );
  await createSubtask(s3_2, 'Create UserRepository extending JpaRepository<User, Long>', 'Place in com.sample.ollama.repository package with @Repository.');
  await createSubtask(s3_2, 'Implement paginated findAll using PageRequest.of(page, size)', 'Used in UserService.list() method via userRepository.findAll(PageRequest).');

  const s3_3 = await createStory(e3,
    'Implement UserService with CRUD Operations',
    'Transactional service layer delegating to UserRepository with proper exception handling.'
  );
  await createSubtask(s3_3, 'Implement list(int page, int size) – paginated user retrieval', 'Returns Page<User>, marked @Transactional(readOnly=true).');
  await createSubtask(s3_3, 'Implement get(Long id) – fetch single user or throw NotFoundException', 'Uses userRepository.findById(id).orElseThrow(NotFoundException).');
  await createSubtask(s3_3, 'Implement create(UserRequest) – map DTO to entity and persist', 'Calls UserMapper.toEntity(request) then userRepository.save(user).');
  await createSubtask(s3_3, 'Implement update(Long id, UserRequest) – fetch, update fields, save', 'Calls get(id) then UserMapper.update(existing, request) then save.');
  await createSubtask(s3_3, 'Implement delete(Long id) – fetch then remove entity', 'Calls get(id) to validate existence then userRepository.delete(existing).');

  // ─────────────────────────────────────────────────────────────────────────────
  // EPIC 4 — REST API Layer
  // ─────────────────────────────────────────────────────────────────────────────
  const e4 = await createEpic(
    'REST API – Controllers, DTOs, Mapping & Exception Handling',
    'BE REST API Layer',
    'Full REST API implementation: DTOs with validation, UserMapper, UserController, GlobalExceptionHandler, and RequestLoggingFilter.'
  );

  const s4_1 = await createStory(e4,
    'Implement UserRequest and UserResponse DTOs',
    'Define validated request DTO and structured response DTO for the User REST API.'
  );
  await createSubtask(s4_1, 'Add @NotBlank @Size(max=100) on firstName and lastName in UserRequest', 'Jakarta Bean Validation for required string fields.');
  await createSubtask(s4_1, 'Add @NotBlank @Email @Size(max=255) on email in UserRequest', 'Validates email format and enforces max length.');
  await createSubtask(s4_1, 'Add @Size(max=40) on optional phone field in UserRequest', 'Phone is optional but bounded to 40 chars.');
  await createSubtask(s4_1, 'Define UserResponse with id, names, email, phone, active, createdAt, updatedAt', 'Read-only DTO returned from all GET and POST/PUT endpoints.');
  await createSubtask(s4_1, 'Implement ErrorResponse DTO with timestamp, status, error, message, path, details', 'Structured error body returned by GlobalExceptionHandler.');

  const s4_2 = await createStory(e4,
    'Implement UserMapper for Entity–DTO Conversion',
    'Manual mapper class (no MapStruct) to convert between User entity and DTOs.'
  );
  await createSubtask(s4_2, 'Implement static toEntity(UserRequest) method in UserMapper', 'Maps firstName, lastName, email, phone, active from request to new User().');
  await createSubtask(s4_2, 'Implement static toResponse(User) method in UserMapper', 'Maps all fields including id, createdAt, updatedAt to UserResponse.');
  await createSubtask(s4_2, 'Implement static update(User, UserRequest) method in UserMapper', 'Mutates existing User entity fields in-place for PUT operations.');

  const s4_3 = await createStory(e4,
    'Implement UserController REST Endpoints',
    'Spring MVC @RestController exposing CRUD operations at /api/users with proper HTTP semantics.'
  );
  await createSubtask(s4_3, 'Implement GET /api/users with page/size params and X-Total-Count header', 'Returns List<UserResponse> with pagination metadata in response header.');
  await createSubtask(s4_3, 'Implement GET /api/users/{id} returning 200 or 404', 'Delegates to UserService.get(id), wrapped in ResponseEntity.ok().');
  await createSubtask(s4_3, 'Implement POST /api/users returning 201 Created with Location header', 'Returns CREATED status and Location: /api/users/{id} header.');
  await createSubtask(s4_3, 'Implement PUT /api/users/{id} returning 200 with updated UserResponse', 'Full update – all UserRequest fields replaced via UserMapper.update().');
  await createSubtask(s4_3, 'Implement DELETE /api/users/{id} returning 204 No Content', 'Calls UserService.delete(id) and returns ResponseEntity.noContent().');

  const s4_4 = await createStory(e4,
    'Implement GlobalExceptionHandler and Custom Exceptions',
    '@ControllerAdvice handling NotFoundException, validation errors, and generic exceptions with structured JSON.'
  );
  await createSubtask(s4_4, 'Create NotFoundException extending RuntimeException', 'In com.sample.ollama.exception package; accepts message string constructor.');
  await createSubtask(s4_4, 'Handle NotFoundException → 404 with ErrorResponse body', '@ExceptionHandler in GlobalExceptionHandler.');
  await createSubtask(s4_4, 'Handle MethodArgumentNotValidException → 400 with field error details list', 'Extract field name + message from BindingResult for each field error.');
  await createSubtask(s4_4, 'Handle ConstraintViolationException → 400', 'Extract constraint violation path + message from Set<ConstraintViolation>.');
  await createSubtask(s4_4, 'Handle generic Exception → 500 Unexpected error response', 'Catchall @ExceptionHandler(Exception.class) returning 500 status.');

  const s4_5 = await createStory(e4,
    'Implement RequestLoggingFilter',
    'Servlet filter to log all incoming HTTP requests for observability and debugging.'
  );
  await createSubtask(s4_5, 'Create RequestLoggingFilter implementing Filter', 'Log method, URI, and remote address for every incoming request.');
  await createSubtask(s4_5, 'Register RequestLoggingFilter as a Spring @Component', 'Auto-registered by Spring Boot component scan.');

  await createTask(e4,
    'Write UserControllerIntegrationTest for all 5 REST endpoints',
    'Spring Boot integration test (@SpringBootTest) validating list, get, create, update, delete against MSSQL TestContainers or embedded DB.'
  );

  console.log('\n=== All Jira items created successfully ===\n');
})().catch(e => {
  console.error('\nFailed:', e.response ? JSON.stringify(e.response.data) : e.message);
  process.exit(1);
});
