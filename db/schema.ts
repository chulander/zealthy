import { randomUUID } from 'crypto';
import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Helper functions
const id = () =>
  text('id')
    .primaryKey()
    .$default(() => randomUUID()); // Generate a UUID as the default value

const createdAt = () =>
  text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

const editedAt = () =>
  text('edited_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull();

/* USERS TABLE */
export const users = sqliteTable('users', {
  id: id(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: createdAt(),
});

// Relationships for users
export const usersRelations = relations(users, ({ many }) => ({
  userWorkflows: many(userWorkflows),
}));

/* USER WORKFLOWS TABLE */
export const userWorkflows = sqliteTable(
  'user_workflows',
  {
    id: id(),
    userId: text('user_id').notNull(),
    workflowId: text('workflow_id').notNull(),
    completedSteps: integer('completed_steps').default(0).notNull(),
    createdAt: createdAt(),
    editedAt: editedAt(),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.userId, table.workflowId), // Add unique constraint
  }),
);
// Relationships for userWorkflows
export const userWorkflowsRelations = relations(userWorkflows, ({ one }) => ({
  user: one(users, {
    fields: [userWorkflows.userId],
    references: [users.id],
  }),
  workflow: one(workflows, {
    fields: [userWorkflows.workflowId],
    references: [workflows.id],
  }),
}));

/* WORKFLOWS TABLE */
export const workflows = sqliteTable('workflows', {
  id: id(),
  name: text('name').notNull(),
  createdAt: createdAt(),
});
// Relationships for workflows
export const workflowsRelations = relations(workflows, ({ many }) => ({
  userWorkflows: many(userWorkflows),
  steps: many(workflowSteps),
}));

/* WORKFLOW STEPS TABLE */
export const workflowSteps = sqliteTable(
  'workflow_steps',
  {
    id: id(),
    workflowId: text('workflow_id').notNull(),
    step: integer('step').notNull(),
    component: text('component', {
      enum: ['about_me', 'address', 'birthdate'],
    }).notNull(),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.workflowId, table.step), // Add unique constraint
  }),
);
// Relationships for workflowSteps
export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowSteps.workflowId],
    references: [workflows.id],
  }),
}));

/* ABOUT ME COMPONENT TABLE */
export const aboutMe = sqliteTable(
  'about_me',
  {
    id: id(),
    userId: text('user_id').notNull(),
    workflowId: text('workflow_id').notNull(),
    stepId: text('step_id').notNull(),
    content: text('content').notNull(),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.userId, table.workflowId, table.stepId), // Add unique constraint
  }),
);
// Relationships for aboutMe
export const aboutMeRelations = relations(aboutMe, ({ one }) => ({
  user: one(users, {
    fields: [aboutMe.userId],
    references: [users.id],
  }),
  step: one(workflowSteps, {
    fields: [aboutMe.stepId],
    references: [workflowSteps.id],
  }),
}));

/* ADDRESS COMPONENT TABLE */
export const addresses = sqliteTable(
  'addresses',
  {
    id: id(),
    userId: text('user_id').notNull(),
    workflowId: text('workflow_id').notNull(),
    stepId: text('step_id').notNull(),
    street: text('street').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zip: text('zip').notNull(),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.userId, table.workflowId, table.stepId), // Add unique constraint
  }),
);
// Relationships for addresses
export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  step: one(workflowSteps, {
    fields: [addresses.stepId],
    references: [workflowSteps.id],
  }),
}));

/* BIRTHDATE COMPONENT TABLE */
export const birthdates = sqliteTable(
  'birthdates',
  {
    id: id(),
    userId: text('user_id').notNull(),
    workflowId: text('workflow_id').notNull(),
    stepId: text('step_id').notNull(),
    birthdate: text('birthdate').notNull(),
  },
  (table) => ({
    uniqueConstraint: unique().on(table.userId, table.workflowId, table.stepId), // Add unique constraint
  }),
);
// Relationships for birthdates
export const birthdatesRelations = relations(birthdates, ({ one }) => ({
  user: one(users, {
    fields: [birthdates.userId],
    references: [users.id],
  }),
  step: one(workflowSteps, {
    fields: [birthdates.stepId],
    references: [workflowSteps.id],
  }),
}));
