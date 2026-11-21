import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';
import { RegistrationClause } from '../registration-clause';
import { RegistrationDocument } from '../registration-document';

@Component({
  selector: 'app-consultor-contract',
  imports: [RegistrationClause, RegistrationDocument, RouterLink],
  templateUrl: './consultor-contract.html',
})
export class ConsultorContract {
  readonly privacyPath = ['/', buildPath(PATH.policyPrivacy)];
}
