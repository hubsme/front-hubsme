import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { PATH, REGISTRATION_DOCUMENT_VERSION, buildPath } from '../src/routes/path.route.ts';

const modules = new URL('../src/modules/', import.meta.url);
const output = new URL(
  '../../backend-hubsme/src/modules/auth/config/registration-documents.generated.json',
  import.meta.url,
);

function sha256(template) {
  const html = readFileSync(new URL(template, modules), 'utf8').replace(/\r\n/g, '\n');
  return createHash('sha256').update(html).digest('hex');
}

const registrationDocuments = {
  version: REGISTRATION_DOCUMENT_VERSION,
  privacyUrl: `/${buildPath(PATH.policyPrivacy)}`,
  privacySha256: sha256('policy-privacy/policy-privacy.html'),
  contracts: Object.fromEntries(
    ['consultor', 'pyme'].map((role) => [
      role,
      {
        contractUrl: `/${buildPath(PATH.registrationDocuments.current[role])}`,
        contractSha256: sha256(`registration-document/${role}-contract/${role}-contract.html`),
      },
    ]),
  ),
};

writeFileSync(output, `${JSON.stringify(registrationDocuments, null, 2)}\n`);
