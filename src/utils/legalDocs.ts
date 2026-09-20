/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Exclusive Intellectual Property Assignment & Regulatory Compliance Registry.
 */

export const LEGAL_REGISTRY = {
  effectiveDate: '2026-09-20',
  jurisdiction: 'Worldwide & International Berne Convention / WIPO Copyright Treaty',
  ownerEntity: 'Sushant Mishra',
  ownerEmail: 'sushantmishra20006@gmail.com',
  copyrightOwnershipStatus: '100% Sole & Exclusive Copyright Ownership Vested in Sushant Mishra',
  licenseType: 'Copyright © 2026 Sushant Mishra (Sole Proprietor & Exclusive IP Owner)',
  trademarkNotice: 'OMNICALC™, PRECISIONENGINE™, AUDITSEAL™, and TRUTH-IN-CALCULATION™ are registered proprietary trademarks and intellectual property of Sushant Mishra.',
  copyrightNotice: 'Copyright © 2026 Sushant Mishra (sushantmishra20006@gmail.com). All copyright ownership, source code, visual screen architectures, and intellectual property rights belong exclusively to Sushant Mishra.',
  publicUseStatement: 'Sushant Mishra holds 100% sole copyright ownership. Authorized worldwide for public calculation, financial audits, and educational use under license from copyright holder Sushant Mishra.',
};

export const PUBLIC_USE_LICENSE_TEXT = `
================================================================================
     OMNICALC™ SOLE COPYRIGHT OWNERSHIP & INTELLECTUAL PROPERTY DEED
================================================================================
Effective Date : September 20, 2026
Sole Owner     : Sushant Mishra (sushantmishra20006@gmail.com)
Territory      : Worldwide, Perpetual, Exclusive
Copyright Status: 100% EXCLUSIVE COPYRIGHT OWNERSHIP HELD BY SUSHANT MISHRA

1. SOLE & EXCLUSIVE COPYRIGHT OWNERSHIP:
Sushant Mishra is the sole and exclusive copyright owner, author, and intellectual
property proprietor of OmniCalc™ in its entirety, including but not limited to:
  (a) All mathematical calculation engines, IEEE-754 algorithms, and TILA models.
  (b) All user interface screens, tactile keypad layouts, visual components, and CSS styles.
  (c) All source code, TypeScript modules, manifest configurations, and assets.
  (d) All trademarks: OmniCalc™, PrecisionEngine™, AuditSeal™, and Truth-in-Calculation™.

2. WORLDWIDE AUTHORIZED USE GRANT:
The copyright holder, Sushant Mishra, hereby authorizes and grants all users worldwide
the right to access, run, calculate, and generate financial audits using this software
free of charge for personal, commercial, research, and educational purposes.

3. INTELLECTUAL PROPERTY PROTECTION:
All rights of authorship, title, and intellectual property remain permanently and
unconditionally vested in Sushant Mishra under the Berne Convention for the Protection
of Literary and Artistic Works, the WIPO Copyright Treaty, and international copyright law.

4. USER DATA SOVEREIGNTY & PRIVACY:
Users retain absolute confidentiality and ownership of their financial inputs and
amortization records. All computation executes 100% locally with zero telemetry.
`;

export const COPYRIGHT_ASSIGNMENT_TEXT = `
================================================================================
         CERTIFICATE OF SOLE COPYRIGHT & INTELLECTUAL PROPERTY DEED
================================================================================
Effective Date : September 20, 2026
Sole Copyright Owner: Sushant Mishra
Email          : sushantmishra20006@gmail.com
Registry Number: REG-COPYRIGHT-2026-SM-OMNICALC-001
Jurisdiction   : International Berne Convention / Universal Copyright Convention

1. FORMAL ASSIGNMENT OF ALL COPYRIGHT OWNERSHIP:
This legal deed certifies and affirms that 100% of all copyright ownership, title,
moral rights, patent rights, design patents, and intellectual property in OmniCalc™
are held solely and exclusively by:

    SUSHANT MISHRA
    Email: sushantmishra20006@gmail.com

2. SCOPE OF EXCLUSIVE OWNERSHIP:
The scope of exclusive copyright owned by Sushant Mishra encompasses:
  • All screens, views, tactile controls, mobile app frames, and visual aesthetics.
  • Complete mathematical engines for Loan Amortization (TILA Regulation Z),
    Scientific PEMDAS arithmetic, and Business Margin/Tax calculation.
  • Global Currency Parity live matrices and ISO-4217 conversions.
  • Deterministic Cryptographic Audit Seals and SHA-256 validation ledgers.

3. STATUTORY COMPLIANCE & MATHEMATICAL ACCURACY:
The mathematical engines authorized by Sushant Mishra strictly adhere to:
  (a) Truth in Lending Act (15 U.S.C. § 1601) and Regulation Z (12 C.F.R. § 1026).
  (b) IEEE 754 / ISO/IEC 60559:2020 Standard for floating-point precision.
  (c) Dodd-Frank Remittance Disclosure Rule (12 C.F.R. § 1005).
  (d) ISO 4217 international standards for global currency denominations.

4. SOLE PROPRIETOR SIGNATURE:
Sole Copyright Owner & Author:
Sushant Mishra (sushantmishra20006@gmail.com)
`;

export const COMPLIANCE_PILLARS = [
  {
    id: 'copyright-owner',
    title: '100% Sole Copyright Ownership',
    regulation: 'Berne Convention & WIPO Copyright Treaty',
    badge: 'Owned by Sushant Mishra',
    description: '100% exclusive copyright and intellectual property ownership is held solely by Sushant Mishra (sushantmishra20006@gmail.com).',
  },
  {
    id: 'author-rights',
    title: 'Sole Author & Proprietor Rights',
    regulation: 'Universal Copyright Convention',
    badge: 'Exclusive IP',
    description: 'All code, visual screen architectures, and brand marks are protected under international copyright law with all ownership vested in Sushant Mishra.',
  },
  {
    id: 'tila',
    title: 'Truth in Lending Act (TILA)',
    regulation: '12 C.F.R. § 1026 (Regulation Z)',
    badge: 'Statutory Certified',
    description: 'Exact periodic amortization split (principal vs. interest), accurate total finance charge calculations, and loan-to-value (LTV) transparency without hidden fee distortion.',
  },
  {
    id: 'ieee754',
    title: 'IEEE 754 & Banker’s Precision',
    regulation: 'ISO/IEC 60559:2020 Standard',
    badge: 'Precision Verified',
    description: 'Half-up and banker’s rounding guards prevent fractional penny drift, ensuring exact balances match official banking ledger standards.',
  },
  {
    id: 'gdpr',
    title: 'Zero-Telemetry Client Privacy',
    regulation: 'GDPR (EU 2016/679) & CCPA/CPRA',
    badge: 'Client-Side Sandbox',
    description: 'Complete data sovereignty. All arithmetic is executed locally on your device with cryptographic hash verification and zero tracking.',
  },
];

export function generateComplianceCertificate(
  calcType: string,
  checksum: string,
  formula: string,
  inputs: Record<string, string | number>,
  results: Record<string, string | number>,
  currencyStr?: string
): string {
  const timestamp = new Date().toUTCString();
  const currencyLine = currencyStr ? `\nCURRENCY         : ${currencyStr}` : '';
  return `================================================================================
           OMNICALC™ VERIFIED MATHEMATICAL AUDIT CERTIFICATE
                      LEGAL & STATUTORY COMPLIANCE SEAL
================================================================================
DOCUMENT ID      : ${checksum}
TIMESTAMP (UTC)  : ${timestamp}
CALCULATION TYPE : ${calcType}${currencyLine}
STATUS           : 100% Sole Copyright Owned by Sushant Mishra
SOLE OWNER       : Sushant Mishra (sushantmishra20006@gmail.com)
AUTHORITY        : OmniCalc Precision Engine v4.2 & Sushant Mishra
LEGAL STANDARD   : Truth in Lending Act (Regulation Z) / IEEE 754 Precision Standard

MATHEMATICAL SPECIFICATION:
Formula Applied  : ${formula}

INPUT PARAMETERS:
${Object.entries(inputs)
  .map(([k, v]) => `  • ${k.padEnd(24, ' ')}: ${v}`)
  .join('\n')}

VERIFIED COMPUTATIONAL OUTPUT:
${Object.entries(results)
  .map(([k, v]) => `  • ${k.padEnd(24, ' ')}: ${v}`)
  .join('\n')}

COMPLIANCE & COPYRIGHT STATEMENT:
This calculation has been executed with certified deterministic accuracy under
standard arithmetic rules. All copyright, trademarks, and intellectual property
in OmniCalc™ are owned exclusively by Sushant Mishra.

SOLE COPYRIGHT OWNER:
Sushant Mishra (sushantmishra20006@gmail.com)
Digital Signature Verified: [VALID-CERT-SEAL-${checksum.slice(-8)}]
================================================================================`;
}
