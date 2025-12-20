// Chat & Messaging Types and Storage

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'system';
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  participantNames: { [userId: string]: string };
  participantAvatars: { [userId: string]: string | undefined };
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  type: 'direct' | 'group';
  groupName?: string;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'blocked';
  requestedAt: string;
  acceptedAt?: string;
}

// Demo users for development
export interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  school?: string;
  currentYear?: string;
  specialty?: string;
  isOnline: boolean;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-1',
    firstName: 'Sarah',
    lastName: 'Chen',
    school: 'Johns Hopkins',
    currentYear: 'MS3',
    specialty: 'Cardiology',
    isOnline: true,
  },
  {
    id: 'demo-2',
    firstName: 'Marcus',
    lastName: 'Williams',
    school: 'Stanford',
    currentYear: 'MS4',
    specialty: 'Surgery',
    isOnline: true,
  },
  {
    id: 'demo-3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    school: 'UCSF',
    currentYear: 'MS2',
    specialty: 'Pediatrics',
    isOnline: false,
  },
  {
    id: 'demo-4',
    firstName: 'James',
    lastName: 'Park',
    school: 'UCLA',
    currentYear: 'Resident',
    specialty: 'Emergency Medicine',
    isOnline: true,
  },
  {
    id: 'demo-5',
    firstName: 'Dr. Amanda',
    lastName: 'Foster',
    school: 'Mayo Clinic',
    currentYear: 'Attending',
    specialty: 'Internal Medicine',
    isOnline: false,
  },
];

const CONVERSATIONS_KEY = 'tribewellmd_conversations';
const MESSAGES_KEY = 'tribewellmd_messages';
const CONNECTIONS_KEY = 'tribewellmd_connections';

// Get all conversations
export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with demo conversations
    const demoConversations = createDemoConversations();
    saveConversations(demoConversations);
    return demoConversations;
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

// Save conversations
export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
}

// Get messages for a conversation
export function getMessages(conversationId: string): Message[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) {
      const allMessages: Message[] = JSON.parse(stored);
      return allMessages.filter(m => m.conversationId === conversationId);
    }
    // Initialize with demo messages
    const demoMessages = createDemoMessages();
    saveAllMessages(demoMessages);
    return demoMessages.filter(m => m.conversationId === conversationId);
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

// Save all messages
export function saveAllMessages(messages: Message[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

// Send a new message
export function sendMessage(conversationId: string, content: string, senderId: string = 'current-user'): Message {
  const message: Message = {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    content,
    timestamp: new Date().toISOString(),
    read: true,
    type: 'text',
  };

  // Add to messages
  const stored = localStorage.getItem(MESSAGES_KEY);
  const allMessages: Message[] = stored ? JSON.parse(stored) : createDemoMessages();
  allMessages.push(message);
  saveAllMessages(allMessages);

  // Update conversation's last message
  const conversations = getConversations();
  const convoIndex = conversations.findIndex(c => c.id === conversationId);
  if (convoIndex !== -1) {
    conversations[convoIndex].lastMessage = message;
    conversations[convoIndex].updatedAt = message.timestamp;
    saveConversations(conversations);
  }

  return message;
}

// Mark messages as read
export function markConversationRead(conversationId: string): void {
  // Update messages
  const stored = localStorage.getItem(MESSAGES_KEY);
  if (stored) {
    const allMessages: Message[] = JSON.parse(stored);
    const updated = allMessages.map(m =>
      m.conversationId === conversationId ? { ...m, read: true } : m
    );
    saveAllMessages(updated);
  }

  // Update conversation unread count
  const conversations = getConversations();
  const convoIndex = conversations.findIndex(c => c.id === conversationId);
  if (convoIndex !== -1) {
    conversations[convoIndex].unreadCount = 0;
    saveConversations(conversations);
  }
}

// Get total unread count
export function getTotalUnreadCount(): number {
  const conversations = getConversations();
  return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}

// Create demo conversations for first-time users
function createDemoConversations(): Conversation[] {
  const now = new Date();

  return [
    {
      id: 'convo-1',
      participants: ['current-user', 'demo-1'],
      participantNames: { 'current-user': 'You', 'demo-1': 'Sarah Chen' },
      participantAvatars: {},
      lastMessage: {
        id: 'msg-demo-1',
        conversationId: 'convo-1',
        senderId: 'demo-1',
        content: 'Hey! Did you finish the cardiology cases? I found them really helpful for Step 1 prep.',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        read: false,
        type: 'text',
      },
      unreadCount: 1,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      type: 'direct',
    },
    {
      id: 'convo-2',
      participants: ['current-user', 'demo-4'],
      participantNames: { 'current-user': 'You', 'demo-4': 'James Park' },
      participantAvatars: {},
      lastMessage: {
        id: 'msg-demo-2',
        conversationId: 'convo-2',
        senderId: 'demo-4',
        content: 'The EM rotation is intense but so rewarding. Happy to share my study tips!',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'text',
      },
      unreadCount: 2,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'direct',
    },
    {
      id: 'convo-3',
      participants: ['current-user', 'demo-5'],
      participantNames: { 'current-user': 'You', 'demo-5': 'Dr. Amanda Foster' },
      participantAvatars: {},
      lastMessage: {
        id: 'msg-demo-3',
        conversationId: 'convo-3',
        senderId: 'current-user',
        content: 'Thank you so much for the mentorship advice!',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text',
      },
      unreadCount: 0,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'direct',
    },
  ];
}

// Create demo messages
function createDemoMessages(): Message[] {
  const now = new Date();

  return [
    // Conversation 1 - Sarah Chen
    {
      id: 'msg-1-1',
      conversationId: 'convo-1',
      senderId: 'demo-1',
      content: 'Hi! I saw you on TribeWellMD. Are you also preparing for Step 1?',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-2',
      conversationId: 'convo-1',
      senderId: 'current-user',
      content: 'Yes! Just started using the flashcard system here. Really liking the spaced repetition.',
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-1-3',
      conversationId: 'convo-1',
      senderId: 'demo-1',
      content: 'Same here! The clinical cases are great too. Have you tried the cardiology ones?',
      timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-demo-1',
      conversationId: 'convo-1',
      senderId: 'demo-1',
      content: 'Hey! Did you finish the cardiology cases? I found them really helpful for Step 1 prep.',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      read: false,
      type: 'text',
    },

    // Conversation 2 - James Park
    {
      id: 'msg-2-1',
      conversationId: 'convo-2',
      senderId: 'current-user',
      content: 'Hi James! I saw you are an EM resident. I am really interested in emergency medicine!',
      timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-2',
      conversationId: 'convo-2',
      senderId: 'demo-4',
      content: 'Hey! That is awesome. It is such a rewarding field. What year are you?',
      timestamp: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-2-3',
      conversationId: 'convo-2',
      senderId: 'demo-4',
      content: 'Also, do you have any specific questions about the EM match?',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'text',
    },
    {
      id: 'msg-demo-2',
      conversationId: 'convo-2',
      senderId: 'demo-4',
      content: 'The EM rotation is intense but so rewarding. Happy to share my study tips!',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'text',
    },

    // Conversation 3 - Dr. Amanda Foster (Mentor)
    {
      id: 'msg-3-1',
      conversationId: 'convo-3',
      senderId: 'demo-5',
      content: 'Welcome to TribeWellMD! I am Dr. Foster. Feel free to reach out if you have questions about your medical journey.',
      timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-2',
      conversationId: 'convo-3',
      senderId: 'current-user',
      content: 'Thank you Dr. Foster! I am an MS2 trying to figure out which specialty to pursue.',
      timestamp: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-3',
      conversationId: 'convo-3',
      senderId: 'demo-5',
      content: 'That is completely normal at your stage. My advice: try to get exposure to as many specialties as possible during MS3. Keep an open mind!',
      timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'msg-3-4',
      conversationId: 'convo-3',
      senderId: 'current-user',
      content: 'Thank you so much for the mentorship advice!',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text',
    },
  ];
}

// Get demo user by ID
export function getDemoUser(userId: string): DemoUser | undefined {
  return DEMO_USERS.find(u => u.id === userId);
}

// Get user initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
}

// Format timestamp for display
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// CONNECTIONS SYSTEM
// ============================================

// Get all connections
export function getConnections(): Connection[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with demo connections
    const demoConnections = createDemoConnections();
    saveConnections(demoConnections);
    return demoConnections;
  } catch (error) {
    console.error('Error loading connections:', error);
    return [];
  }
}

// Save connections
export function saveConnections(connections: Connection[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  } catch (error) {
    console.error('Error saving connections:', error);
  }
}

// Get accepted connections
export function getAcceptedConnections(): Connection[] {
  return getConnections().filter(c => c.status === 'accepted');
}

// Get pending connection requests (received)
export function getPendingRequests(): Connection[] {
  return getConnections().filter(
    c => c.status === 'pending' && c.connectedUserId === 'current-user'
  );
}

// Get sent connection requests (pending)
export function getSentRequests(): Connection[] {
  return getConnections().filter(
    c => c.status === 'pending' && c.userId === 'current-user'
  );
}

// Send a connection request
export function sendConnectionRequest(targetUserId: string): Connection {
  const connection: Connection = {
    id: crypto.randomUUID(),
    userId: 'current-user',
    connectedUserId: targetUserId,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  const connections = getConnections();
  connections.push(connection);
  saveConnections(connections);

  return connection;
}

// Accept a connection request
export function acceptConnectionRequest(connectionId: string): void {
  const connections = getConnections();
  const index = connections.findIndex(c => c.id === connectionId);
  if (index !== -1) {
    connections[index].status = 'accepted';
    connections[index].acceptedAt = new Date().toISOString();
    saveConnections(connections);
  }
}

// Decline/remove a connection
export function removeConnection(connectionId: string): void {
  const connections = getConnections();
  const filtered = connections.filter(c => c.id !== connectionId);
  saveConnections(filtered);
}

// Check if connected to a user
export function isConnectedTo(userId: string): boolean {
  const connections = getConnections();
  return connections.some(
    c => c.status === 'accepted' &&
    ((c.userId === 'current-user' && c.connectedUserId === userId) ||
     (c.connectedUserId === 'current-user' && c.userId === userId))
  );
}

// Check if request pending with user
export function hasPendingRequestWith(userId: string): 'sent' | 'received' | null {
  const connections = getConnections();
  const pending = connections.find(
    c => c.status === 'pending' &&
    ((c.userId === 'current-user' && c.connectedUserId === userId) ||
     (c.connectedUserId === 'current-user' && c.userId === userId))
  );

  if (!pending) return null;
  if (pending.userId === 'current-user') return 'sent';
  return 'received';
}

// Get connection count
export function getConnectionCount(): number {
  return getAcceptedConnections().length;
}

// Get pending request count
export function getPendingRequestCount(): number {
  return getPendingRequests().length;
}

// Create demo connections
function createDemoConnections(): Connection[] {
  const now = new Date();

  return [
    // Already connected with Sarah Chen and James Park
    {
      id: 'conn-1',
      userId: 'demo-1',
      connectedUserId: 'current-user',
      status: 'accepted',
      requestedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conn-2',
      userId: 'current-user',
      connectedUserId: 'demo-4',
      status: 'accepted',
      requestedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'conn-3',
      userId: 'current-user',
      connectedUserId: 'demo-5',
      status: 'accepted',
      requestedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: new Date(now.getTime() - 34 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Pending request from Marcus Williams
    {
      id: 'conn-4',
      userId: 'demo-2',
      connectedUserId: 'current-user',
      status: 'pending',
      requestedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // Sent request to Emily Rodriguez
    {
      id: 'conn-5',
      userId: 'current-user',
      connectedUserId: 'demo-3',
      status: 'pending',
      requestedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Get connected user details
export function getConnectedUsers(): DemoUser[] {
  const connections = getAcceptedConnections();
  const users: DemoUser[] = [];

  connections.forEach(conn => {
    const userId = conn.userId === 'current-user' ? conn.connectedUserId : conn.userId;
    const user = getDemoUser(userId);
    if (user) users.push(user);
  });

  return users;
}

// Get users who sent pending requests
export function getPendingRequestUsers(): DemoUser[] {
  const requests = getPendingRequests();
  const users: DemoUser[] = [];

  requests.forEach(req => {
    const user = getDemoUser(req.userId);
    if (user) users.push(user);
  });

  return users;
}
