import { sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// Base Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  country?: string;
  region?: string;
  city?: string;
  coordinates?: Coordinates;
}

// Core Tables
export const dhaDocumentVerifications = pgTable("dha_document_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  verificationCode: text("verification_code").notNull().unique(),
  documentNumber: text("document_number"),
  documentType: text("document_type"),
  issuedAt: timestamp("issued_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  userId: varchar("user_id"),
  documentData: jsonb("document_data"),
  verificationStatus: text("verification_status").notNull().default("pending"),
  verificationMethod: text("verification_method"),
  verificationResult: jsonb("verification_result"),
  aiScore: integer("ai_score"),
  humanVerified: boolean("human_verified").notNull().default(false),
  lastVerifiedAt: timestamp("last_verified_at"),
  revokedAt: timestamp("revoked_at"),
  revocationReason: text("revocation_reason")
});

export const verificationSessions = pgTable("verification_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionToken: text("session_token").notNull().unique(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at").notNull(),
  lastActivity: timestamp("last_activity"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  currentVerifications: integer("current_verifications").notNull().default(0),
  maxVerifications: integer("max_verifications").notNull().default(100),
  isActive: boolean("is_active").notNull().default(true)
});

export const apiAccess = pgTable("api_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: text("api_key_id").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  hourlyQuota: integer("hourly_quota").notNull().default(1000),
  currentHourlyUsage: integer("current_hourly_usage").notNull().default(0),
  lastResetAt: timestamp("last_reset_at").notNull().default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  metadata: jsonb("metadata")
});

export const verificationHistory = pgTable("verification_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  verificationId: varchar("verification_id").notNull().references(() => dhaDocumentVerifications.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  ipAddress: text("ip_address"),
  location: jsonb("location"),
  userAgent: text("user_agent"),
  verificationMethod: text("verification_method").notNull(),
  isSuccessful: boolean("is_successful").notNull(),
  metadata: jsonb("metadata")
});

// Additional monitoring and security tables
export const securityEvents = pgTable("security_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  severity: text("severity").notNull(),
  source: text("source").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  details: jsonb("details"),
  metadata: jsonb("metadata")
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  resource: text("resource"),
  resourceId: text("resource_id"),
  result: text("result").notNull(),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  metricValue: integer("metric_value").notNull(),
  metricType: text("metric_type").notNull(),
  source: text("source").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});

export const selfHealingActions = pgTable("self_healing_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actionType: text("action_type").notNull(),
  trigger: text("trigger").notNull(),
  status: text("status").notNull().default("pending"),
  result: text("result"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at")
});

export const fraudAlerts = pgTable("fraud_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  userId: varchar("user_id"),
  description: text("description"),
  metadata: jsonb("metadata"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  resolvedAt: timestamp("resolved_at")
});

export const securityIncidents = pgTable("security_incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentType: text("incident_type").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("open"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by")
});

export const errorLogs = pgTable("error_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  errorType: text("error_type").notNull(),
  errorMessage: text("error_message").notNull(),
  stackTrace: text("stack_trace"),
  source: text("source").notNull(),
  severity: text("severity").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  resolvedAt: timestamp("resolved_at")
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("open"),
  affectedSystems: jsonb("affected_systems"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by")
});

// People table
export const people = pgTable('people', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  fullName: text('full_name').notNull(),
  firstName: text('first_name'),
  surname: text('surname'),
  passportNumber: text('passport_number'),
  idNumber: text('id_number'),
  nationality: text('nationality'),
  dateOfBirth: text('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Document types table
export const documentTypes = pgTable('document_types', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  requiredFields: jsonb('required_fields')
});

// Documents table
export const documents = pgTable('documents', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  personId: integer('person_id').notNull().references(() => people.id),
  documentTypeId: integer('document_type_id').notNull().references(() => documentTypes.id),
  documentNumber: text('document_number').notNull().unique(),
  referenceNumber: text('reference_number'),
  issueDate: text('issue_date').notNull(),
  expiryDate: text('expiry_date'),
  status: text('status').notNull().default('Issued'),
  metadata: jsonb('metadata'),
  officerName: text('officer_name'),
  officerID: text('officer_id'),
  dataSource: text('data_source').default('DHA_NPR'),
  dhaVerified: boolean('dha_verified').default(true),
  signature: text('signature'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const peopleRelations = relations(people, ({ many }) => ({
  documents: many(documents)
}));

export const documentTypesRelations = relations(documentTypes, ({ many }) => ({
  documents: many(documents)
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  person: one(people, {
    fields: [documents.personId],
    references: [people.id]
  }),
  documentType: one(documentTypes, {
    fields: [documents.documentTypeId],
    references: [documentTypes.id]
  })
}));


export type DhaDocumentVerification = typeof dhaDocumentVerifications.$inferSelect;
export type InsertDhaDocumentVerification = typeof dhaDocumentVerifications.$inferInsert;

export type VerificationSession = typeof verificationSessions.$inferSelect;
export type InsertVerificationSession = typeof verificationSessions.$inferInsert;

export type ApiAccess = typeof apiAccess.$inferSelect;
export type InsertApiAccess = typeof apiAccess.$inferInsert;

export type VerificationHistory = typeof verificationHistory.$inferSelect;
export type InsertVerificationHistory = typeof verificationHistory.$inferInsert;

export interface InsertSecurityEvent {
  eventType: string;
  severity: string;
  source: string;
  details?: any;
  metadata?: any;
  timestamp?: Date;
}

export interface InsertAuditLog {
  action: string;
  actor: string;
  result: string;
  resource?: string | null;
  resourceId?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface InsertSystemMetric {
  metricName: string;
  metricValue: number;
  metricType: string;
  source: string;
  metadata?: any;
}

export interface InsertSelfHealingAction {
  actionType: string;
  trigger: string;
  status?: string;
  result?: string | null;
  metadata?: any;
  completedAt?: Date | null;
}

export type SelfHealingAction = typeof selfHealingActions.$inferSelect;
// InsertSelfHealingAction defined above as interface

export type FraudAlert = typeof fraudAlerts.$inferSelect;
export type InsertFraudAlert = typeof fraudAlerts.$inferInsert;

export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type InsertSecurityIncident = typeof securityIncidents.$inferInsert;

export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = typeof errorLogs.$inferInsert;

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

// Notification enums and types
export enum NotificationCategory {
  DOCUMENT = 'document',
  APPLICATION = 'application',
  SYSTEM = 'system',
  SECURITY = 'security',
  USER = 'user'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum EventType {
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_PROCESSING = 'document_processing',
  DOCUMENT_PROCESSED = 'document_processed',
  DOCUMENT_VERIFIED = 'document_verified',
  DOCUMENT_REJECTED = 'document_rejected',
  SECURITY_BREACH = 'security_breach',
  SECURITY_LOGIN = 'security_login',
  SECURITY_FAILED_LOGIN = 'security_failed_login',
  FRAUD_DETECTED = 'fraud_detected',
  BIOMETRIC_ENROLLED = 'biometric_enrolled',
  BIOMETRIC_VERIFIED = 'biometric_verified',
  BIOMETRIC_FAILED = 'biometric_failed',
  ADMIN_REVIEW_REQUIRED = 'admin_review_required',
  SYSTEM_HEALTH_ALERT = 'system_health_alert',
  DOCUMENT_GENERATED = 'document_generated',
  VERIFICATION_COMPLETE = 'verification_complete',
  SECURITY_ALERT = 'security_alert',
  SYSTEM_UPDATE = 'system_update',
  PROCESSING_FAILED = 'processing_failed',
  PROCESSING_COMPLETED = 'processing_completed',
  DOCUMENT_STATUS_CHANGE = 'document_status_change',
  APPLICATION_UPDATE = 'application_update',
  SYSTEM_ALERT = 'system_alert',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  USER_REGISTERED = 'user_registered'
}

export interface NotificationEvent {
  id: string;
  userId: string;
  eventType: EventType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface InsertNotificationEvent extends Omit<NotificationEvent, 'id' | 'createdAt'> {}

export interface UserNotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  categories?: Record<string, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface StatusUpdate {
  id: string;
  status: string;
  message: string;
  timestamp: Date;
}

export interface InsertStatusUpdate extends Omit<StatusUpdate, 'id' | 'timestamp'> {}

// Audit types
export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SECURITY_EVENT = 'security_event',
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_DOWNLOADED = 'document_downloaded',
  DOCUMENT_VIEWED = 'document_viewed',
  DOCUMENT_DELETED = 'document_deleted',
  DOCUMENT_MODIFIED = 'document_modified',
  DOCUMENT_VERIFIED = 'document_verified',
  API_CALL = 'api_call',
  DHA_API_CALL = 'dha_api_call',
  SAPS_API_CALL = 'saps_api_call',
  ICAO_API_CALL = 'icao_api_call'
}

// Compliance types
export enum ComplianceEventType {
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  POLICY_VIOLATION = 'policy_violation',
  SECURITY_INCIDENT = 'security_incident',
  AUDIT_REVIEW = 'audit_review'
}

export interface InsertComplianceEvent {
  eventType: ComplianceEventType;
  description: string;
  actor: string;
  resource?: string | null;
  metadata?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}