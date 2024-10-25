import { integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: serial('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: serial('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: serial('userId').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  sessionToken: text('sessionToken').notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const races = pgTable('races', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  raceTime: timestamp('race_time').notNull(),
  pixKey: text('pix_key').notNull(),
  pricePerPerson: integer('price_per_person').notNull(),
  maxParticipants: integer('max_participants').notNull(),
  raceDate: timestamp('race_date').notNull(),
  notificationEmails: json('notification_emails').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = {
  id: number;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
};