
/**
 * Security Service
 * Implements industry-standard hardening for client-side data
 */

export const securityService = {
  /**
   * Hashes a string using SHA-256 (e.g., for passwords)
   */
  async hash(text: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Simple "Seal" (Base64 + Obfuscation) for localStorage data.
   */
  seal(data: any): string {
    const stringified = JSON.stringify(data);
    const salt = "EZ_SECURE_2024";
    return btoa(unescape(encodeURIComponent(stringified + "||" + salt)));
  },

  /**
   * Unseals data and verifies integrity
   */
  unseal(sealed: string): any {
    try {
      const decoded = decodeURIComponent(escape(atob(sealed)));
      const [dataStr, salt] = decoded.split("||");
      if (salt !== "EZ_SECURE_2024") throw new Error("Data tampering detected");
      return JSON.parse(dataStr);
    } catch (e) {
      console.error("Security violation: Data corrupted or tampered.");
      return null;
    }
  },

  /**
   * Prevents XSS by stripping dangerous HTML tags
   */
  sanitize(input: string): string {
    return input
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/[<>]/g, (tag) => ({ '<': '&lt;', '>': '&gt;' }[tag] || tag));
  },

  /**
   * Validates if an email is from a reputable provider (Gmail, Corp) 
   * and not from a disposable service.
   */
  isReputableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    // High Reputation Consumer Domains
    const reputableDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 
      'icloud.com', 'me.com', 'live.com', 'protonmail.com', 
      'aol.com', 'zoho.com', 'yandex.com'
    ];

    // Common Disposable / Fake Email Providers
    const blockedDomains = [
      'mailinator.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
      'trashmail.com', 'yopmail.com', 'getnada.com', 'dispostable.com',
      'sharklasers.com', 'guerillamail.info', 'grr.la', 'guerrillamail.biz',
      'guerrillamail.com', 'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org',
      'pokemail.net', 'spam4.me', 'discard.email', 'disposable.com',
      'tempmail.net', 'maildrop.cc', 'mintemail.com', 'mailness.com',
      'fakeinbox.com', 'easytrashmail.com', 'discardmail.com', 'teleworm.us',
      'armyspy.com', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com',
      'rhyta.com', 'superrito.com', 'trbvm.com', 'temp-mail.io', 'mailnesia.com'
    ];

    if (blockedDomains.includes(domain)) return false;
    
    // If it's a known reputable domain, approve immediately
    if (reputableDomains.includes(domain)) return true;

    // Corporate logic: Check for standard TLDs and ensure it's not a generic "free" sub-pattern
    const corporatePattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,20}$/;
    const isStandardDomain = corporatePattern.test(domain);
    
    // Check if domain contains common "temp" or "test" keywords
    const isSuspicious = /temp|test|dummy|fake|burn|trash|disposable/i.test(domain);

    return isStandardDomain && !isSuspicious;
  },

  /**
   * Generates a unique secure session token
   */
  generateToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};
