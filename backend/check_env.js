
import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  // Print protocol and host/port, mask password
  console.log('DATABASE_URL format:', url.replace(/:[^:@]*@/, ':****@'));
}
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
