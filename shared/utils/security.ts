/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+254|0)[17]\d{8}$/, // Kenyan phone numbers
  idNumber: /^\d{7,8}$/, // Kenyan ID numbers
  name: /^[a-zA-Z\s'-]{2,50}$/, // Names with basic special characters
  subject: /^[a-zA-Z0-9\s.,!?'-]{5,200}$/, // Subject lines
  safeText: /^[a-zA-Z0-9\s.,!?'"-]{1,1000}$/, // General safe text
} as const;

// File validation
export const FILE_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
} as const;

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

/**
 * Validate Kenyan phone number
 */
export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.phone.test(phone);
}

/**
 * Validate Kenyan ID number
 */
export function validateIdNumber(idNumber: string): boolean {
  return VALIDATION_PATTERNS.idNumber.test(idNumber);
}

/**
 * Validate name fields
 */
export function validateName(name: string): boolean {
  return VALIDATION_PATTERNS.name.test(name);
}

/**
 * Validate file upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > FILE_VALIDATION.maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!FILE_VALIDATION.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_VALIDATION.allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension not allowed' };
  }

  return { valid: true };
}

/**
 * Rate limiting utility (client-side)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeLeft);
  }
}

/**
 * Generate secure random string
 */
export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
} as const;

/**
 * Security headers for production
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...CSP_HEADERS
} as const;
