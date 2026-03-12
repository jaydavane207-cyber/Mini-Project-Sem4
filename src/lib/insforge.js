import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://25w84ct4.us-east.insforge.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjU3ODF9.kxHNSFxDYky_th4UW4Gugz97tg9xxxwGP1l3yrZnyWc'
});

export default client;
