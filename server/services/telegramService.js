import fetch from 'node-fetch';

// Telegram bot token and default admins - DO NOT hardcode secrets in production.
// Move BOT_TOKEN to environment variable: process.env.TELEGRAM_BOT_TOKEN
// For now we keep fallback to ease testing if env not set.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'REPLACE_WITH_REAL_BOT_TOKEN';

// Comma separated list of chat IDs in env or fallback empty array.
const ADMIN_CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

/**
 * Send a plain text message to a specific Telegram chat id.
 * Returns response JSON or throws on network error.
 */
export async function sendTelegramMessage(chatId, message) {
  if (!BOT_TOKEN || BOT_TOKEN.startsWith('REPLACE_WITH')) {
    console.warn('[telegramService] BOT_TOKEN not configured; skipping send');
    return null;
  }
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('[telegramService] Failed to send message', data);
    }
    return data;
  } catch (err) {
    console.error('[telegramService] Error sending message:', err.message);
    return null;
  }
}

/**
 * Broadcast a message to all configured admin chat IDs.
 */
export async function broadcastToAdmins(message) {
  if (ADMIN_CHAT_IDS.length === 0) {
    console.warn('[telegramService] No admin chat IDs configured; skipping broadcast');
    return [];
  }
  const chunks = splitMessage(message);
  const promises = [];
  for (const id of ADMIN_CHAT_IDS) {
    for (const part of chunks) {
      promises.push(sendTelegramMessage(id, part));
    }
  }
  return Promise.all(promises);
}

/**
 * Format a rich order summary (cart from A to Z) for Telegram.
 */
export function formatOrderMessage(order, user) {
  const currency = v => `₹${Number(v || 0)}`;
  const lines = [];

  lines.push('🆕 NEW BOOKING');
  lines.push(`Order ID: ${order.orderNumber || order._id}`);
  lines.push('');

  // Customer Information
  lines.push('Customer Information');
  lines.push(`Name: ${safe(user?.name || user?.fullName || user?.username || 'N/A')}`);
  const phone = user?.phone || user?.mobile || extractPhone(order.customerNotes);
  if (phone) lines.push(`Phone: ${phone}`);
  if (user?.email) lines.push(`Email: ${user.email}`);
  lines.push('');

  // Address
  if (order.serviceAddress) {
    lines.push('Service Address');
    lines.push(safe(order.serviceAddress.fullAddress));
    const locBits = [];
    if (order.serviceAddress.city) locBits.push(order.serviceAddress.city);
    if (order.serviceAddress.state) locBits.push(order.serviceAddress.state);
    if (order.serviceAddress.pincode) locBits.push(order.serviceAddress.pincode);
    if (locBits.length) lines.push(locBits.join(', '));
    if (order.serviceAddress.landmark) lines.push(`Landmark: ${safe(order.serviceAddress.landmark)}`);
    lines.push('');
  }

  // Service Details
  lines.push('Service Details');
  const totalItems = order.items?.length || 0;
  if (totalItems) {
    lines.push(`${totalItems} item${totalItems > 1 ? 's' : ''}`);
  }
  lines.push('');

  order.items.forEach((it, idx) => {
    const itemTotal = computeItemTotal(it);
    lines.push(`Item ${idx + 1}`);
    const baseLine = [it.serviceName, it.packageName].filter(Boolean).join(' - ');
    lines.push(`Base Service: ${safe(baseLine)}`);
    if (it.vehicleType) lines.push(`Vehicle: ${capitalize(it.vehicleType)}`);
    lines.push(`${currency(it.price)} each`);
    // Included features / plan details
    const feat = it.includedFeatures || it.planDetails?.washIncludes || [];
    if (feat && feat.length) {
      lines.push('Included Features:');
      feat.slice(0, 30).forEach(f => lines.push(` - ${safe(f)}`));
    }
    // Extended plan details (monthly plans etc.)
    if (it.planDetails) {
      addPlanSection(lines, 'Weekly Includes', it.planDetails.weeklyIncludes);
      addPlanSection(lines, 'Wash Includes', it.planDetails.washIncludes);
      addPlanSection(lines, 'Bi-Weekly Includes', it.planDetails.biWeeklyIncludes);
      addPlanSection(lines, 'Monthly Bonuses', it.planDetails.monthlyBonuses);
      addPlanSection(lines, 'Platinum Extras', it.planDetails.platinumExtras);
    }
    // Add-ons
    if (it.addOns && it.addOns.length) {
      lines.push('Add-ons:');
      it.addOns.forEach(a => lines.push(` + ${safe(a.name)} ${currency(a.price)} x${a.quantity}`));
    }
    // Laundry items
    if (it.laundryItems && it.laundryItems.length) {
      lines.push('Laundry:');
      it.laundryItems.forEach(li => lines.push(` + ${safe(li.itemType)} ${currency(li.pricePerItem)} x${li.quantity}`));
    }
    lines.push(`Quantity: ${it.quantity}`);
    lines.push(`Item Total: ${currency(itemTotal)}`);
    if (it.specialInstructions) lines.push(`Notes: ${safe(it.specialInstructions)}`);
    lines.push('');
  });

  // Order Summary
  lines.push('Order Summary');
  lines.push(`Subtotal: ${currency(order.subtotal)}`);
  if (order.discountAmount) lines.push(`Discount (${order.couponCode}): -${currency(order.discountAmount)}`);
  const serviceCharge = 0; // Placeholder: adjust if you add service fee logic
  lines.push(`Service charge: ${serviceCharge ? currency(serviceCharge) : 'FREE'}`);
  lines.push(`Total: ${currency(order.totalAmount)}`);
  lines.push('');

  // Scheduling
  lines.push('Scheduling Information');
  const bookingDate = order.createdAt ? new Date(order.createdAt) : new Date();
  lines.push(`Booking Date: ${formatDate(bookingDate)}`);
  if (order.scheduledDate) lines.push(`Scheduled Date: ${formatDate(order.scheduledDate)}`);
  if (order.scheduledTimeSlot) lines.push(`Time Slot: ${order.scheduledTimeSlot}`);
  lines.push('');

  // Payment
  lines.push('Payment Information');
  if (order.paymentMethod) lines.push(`Payment Method: ${order.paymentMethod}`);
  if (order.paymentStatus) lines.push(`Payment Status: ${capitalize(order.paymentStatus)}`);
  if (order.estimatedDuration) lines.push(`Estimated Duration: ${order.estimatedDuration} minutes`);
  if (order.couponCode) lines.push(`Coupon Applied: ${order.couponCode}`);
  lines.push('');

  lines.push('Order Status');
  lines.push(capitalize(order.orderStatus || 'pending'));
  lines.push('');

  if (order.customerNotes) {
    lines.push('Customer Notes');
    lines.push(safe(order.customerNotes));
    lines.push('');
  }

  lines.push('— BFS Bot');
  return lines.join('\n');
}

// Telegram max message length ~4096 chars. Split if necessary.
function splitMessage(text, maxLen = 4000) {
  if (text.length <= maxLen) return [text];
  const parts = [];
  let current = '';
  for (const line of text.split('\n')) {
    if ((current + '\n' + line).length > maxLen) {
      parts.push(current);
      current = line;
    } else {
      current = current ? current + '\n' + line : line;
    }
  }
  if (current) parts.push(current);
  return parts;
}

// Escape Markdown special chars that could break formatting
function safe(str='') {
  return String(str).replace(/([_*`~>|#\[\]()])/g, '\\$1');
}

function computeItemTotal(it){
  const base = (it.price || 0) * (it.quantity || 1);
  const addOns = (it.addOns||[]).reduce((s,a)=>s + (a.price||0)*(a.quantity||1),0);
  const laundry = (it.laundryItems||[]).reduce((s,l)=>s + (l.pricePerItem||0)*(l.quantity||0),0);
  return base + addOns + laundry;
}

function capitalize(str='') { return str.charAt(0).toUpperCase() + str.slice(1); }

function formatDate(d){
  const date = new Date(d);
  return date.toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'2-digit'});
}

function addPlanSection(lines, title, arr){
  if (arr && arr.length) {
    lines.push(title + ':');
    arr.slice(0,25).forEach(x=> lines.push(' - ' + safe(x)));
  }
}

function extractPhone(notes='') {
  const m = String(notes).match(/(\+?\d{10,13})/);
  return m ? m[1] : null;
}
