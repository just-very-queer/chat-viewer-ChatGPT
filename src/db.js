import Dexie from 'dexie';

export const db = new Dexie('UniversalChatArchive');

db.version(1).stores({
  conversations: '++id, platform, title', // Primary key 'id' is auto-incrementing
  messages: 'id, conversationId, timestamp', // Primary key 'id' from source data
  media: 'id', // Primary key 'id' from source data, to store blobs
});
