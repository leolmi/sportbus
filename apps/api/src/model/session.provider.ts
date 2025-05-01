import { Connection } from 'mongoose';
import { SessionSchema } from './session.schema';
import { SessionOnDaySchema } from './session-on-day.schema';

const SESSION_SCHEMA_NAME = 'SportBusSession';
const SESSION_ON_DAY_SCHEMA_NAME = 'SportBusSessionOnDay';

export const sessionProviders = [
  {
    provide: 'SESSION_MODEL',
    useFactory: (connection: Connection) => connection.model(SESSION_SCHEMA_NAME, SessionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SESSION_ON_DAY_MODEL',
    useFactory: (connection: Connection) => connection.model(SESSION_ON_DAY_SCHEMA_NAME, SessionOnDaySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
