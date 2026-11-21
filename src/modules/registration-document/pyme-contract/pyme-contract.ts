import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { RegistrationClause } from '../registration-clause';
import { RegistrationDocument } from '../registration-document';

@Component({
  selector: 'app-pyme-contract',
  imports: [RegistrationClause, RegistrationDocument, RouterLink],
  templateUrl: './pyme-contract.html',
})
export class PymeContract {
  readonly privacyPath = ['/', buildPath(PATH.policyPrivacy)];
}
