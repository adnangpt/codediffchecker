export interface SamplePreset {
  id: string;
  name: string;
  language: string;
  original: string;
  changed: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'typescript',
    name: 'TypeScript API',
    language: 'typescript',
    original: `interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export function fetchUserProfile(userId: string): Promise<UserProfile> {
  const url = '/api/v1/users/' + userId;
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to load user');
      }
      return res.json();
    })
    .catch((err) => {
      console.log('Error fetching user:', err);
      return null;
    });
}

export function formatUserDisplayName(user: UserProfile): string {
  return user.name + ' (' + user.role + ')';
}`,
    changed: `interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  status: 'active' | 'suspended';
  updatedAt: string;
}

export async function fetchUserProfile(
  userId: string,
  signal?: AbortSignal
): Promise<UserProfile> {
  const url = \`/api/v2/users/\${encodeURIComponent(userId)}\`;
  
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(\`Failed to load user: \${res.status} \${res.statusText}\`);
    }
    return await res.json();
  } catch (err: unknown) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
}

export function formatUserDisplayName(user: UserProfile): string {
  const badge = user.status === 'suspended' ? ' [SUSPENDED]' : '';
  return \`\${user.displayName} (\${user.role})\${badge}\`;
}`,
  },
  {
    id: 'json',
    name: 'JSON Config',
    language: 'json',
    original: `{
  "name": "payment-service",
  "version": "1.4.0",
  "environment": "staging",
  "port": 8080,
  "retries": 3,
  "timeoutMs": 5000,
  "features": {
    "applePay": true,
    "googlePay": false,
    "cryptoPayments": false
  },
  "database": {
    "host": "staging-db.internal",
    "poolSize": 10
  }
}`,
    changed: `{
  "name": "payment-service",
  "version": "2.0.0",
  "environment": "production",
  "port": 8443,
  "retries": 5,
  "timeoutMs": 3500,
  "ssl": {
    "enabled": true,
    "certPath": "/etc/ssl/certs/bundle.crt"
  },
  "features": {
    "applePay": true,
    "googlePay": true,
    "oneClickCheckout": true
  },
  "database": {
    "host": "prod-db-cluster.internal",
    "poolSize": 25,
    "sslMode": "require"
  }
}`,
  },
  {
    id: 'python',
    name: 'Python Script',
    language: 'python',
    original: `def calculate_order_total(items, discount_pct=0):
    subtotal = 0
    for item in items:
        subtotal += item['price'] * item['quantity']
    
    discount = subtotal * (discount_pct / 100)
    tax = (subtotal - discount) * 0.08
    return subtotal - discount + tax

def summarize_cart(cart):
    print("Processing cart with", len(cart), "items")
    total = calculate_order_total(cart)
    return {"total": round(total, 2)}`,
    changed: `from decimal import Decimal, ROUND_HALF_UP

TAX_RATE = Decimal('0.0825')

def calculate_order_total(items: list[dict], discount_pct: float = 0.0) -> Decimal:
    """Calculates order total with decimal precision for currency."""
    subtotal = sum(Decimal(str(item['price'])) * item['quantity'] for item in items)
    
    discount_rate = Decimal(str(discount_pct)) / Decimal('100')
    discount_amount = subtotal * discount_rate
    taxable_amount = max(Decimal('0'), subtotal - discount_amount)
    tax = (taxable_amount * TAX_RATE).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    return (taxable_amount + tax).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

def summarize_cart(cart: list[dict], discount: float = 0.0) -> dict:
    total = calculate_order_total(cart, discount_pct=discount)
    return {
        "item_count": sum(i['quantity'] for i in cart),
        "total_formatted": f"$\${total:,.2f}",
        "raw_total": float(total)
    }`,
  },
  {
    id: 'markdown',
    name: 'Documentation',
    language: 'markdown',
    original: `# Getting Started

Welcome to the QuickStart guide!

To run this application locally, you will need Node.js 16 installed.
First, clone the repository:
\`\`\`bash
git clone https://github.com/example/repo.git
npm install
npm run start
\`\`\`

Note: This software is currently in Alpha stage and not recommended for production.`,
    changed: `# Getting Started Guide

Welcome to the official developer onboarding guide!

### Prerequisites
- Node.js 20.x or higher
- pnpm 9.x (recommended package manager)

### Installation
\`\`\`bash
git clone https://github.com/example/repo.git
pnpm install
pnpm dev
\`\`\`

Note: This software is now production-ready (v2.0) with enterprise support and 99.99% uptime SLA.`,
  },
];
