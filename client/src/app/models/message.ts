export interface Message {
  id: number;
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: null;
  recipientId: number;
  recipientUsername: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead: Date;
  messageSent: Date;
}

export interface MessageBody {
  recipientUsername: string;
  content: string;
}
