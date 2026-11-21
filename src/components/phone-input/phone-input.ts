import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { normalizePhoneForSubmit } from '@function/phone.function';
import type { Iso2, Iti } from 'intl-tel-input';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private instance: Iti | null = null;
  private currentValue = '';
  private disabled = false;
  private writingValue = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  @Input() name = 'phone';
  @Input() placeholder = '999 999 999';
  @Input() fixedCountry: Iso2 | null = null;

  @ViewChild('phoneInput') private phoneInput?: ElementRef<HTMLInputElement>;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId) || !this.phoneInput) return;

    const { default: intlTelInput } = await import('intl-tel-input');
    if (this.destroyRef.destroyed) return;

    this.instance = intlTelInput(this.phoneInput.nativeElement, {
      initialCountry: this.fixedCountry ?? 'pe',
      ...(this.fixedCountry ? { onlyCountries: [this.fixedCountry], countrySelectorMode: 'OFF' } : {}),
      separateDialCode: true,
      // Leave invalid fixed-country values visible so the form can reject them.
      strictMode: !this.fixedCountry,
      loadUtils: () => import('intl-tel-input/utils'),
    });

    this.updateDisplayedNumber();
    this.instance.setDisabled(this.disabled);
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }

  writeValue(value: string | null): void {
    this.currentValue = value ?? '';
    this.updateDisplayedNumber();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.instance?.setDisabled(isDisabled);
  }

  handleInput() {
    if (this.writingValue) return;

    const rawValue = this.phoneInput?.nativeElement.value.trim() ?? '';
    const value = this.getCurrentNumber(rawValue);
    this.currentValue = value;
    this.onChange(value);
  }

  handleCountryChange(): void {
    if (this.fixedCountry && this.instance && this.instance.getSelectedCountry()?.iso2 !== this.fixedCountry) {
      this.instance.setSelectedCountry(this.fixedCountry);
      return;
    }
    this.handleInput();
  }

  handleBlur() {
    this.handleInput();
    this.onTouched();
  }

  private updateDisplayedNumber(): void {
    if (!this.instance) return;

    this.writingValue = true;
    this.instance.setNumber(normalizePhoneForSubmit(this.currentValue));
    this.writingValue = false;
  }

  private getCurrentNumber(rawValue: string) {
    if (this.fixedCountry && !/^\+?[\d\s().-]*$/.test(rawValue)) return rawValue;

    const digits = rawValue.replace(/\D/g, '');
    if (!digits) return '';
    if (rawValue.startsWith('+')) return this.fixedCountry ? `+${digits}` : normalizePhoneForSubmit(rawValue);

    const dialCode = this.instance?.getSelectedCountry()?.dialCode;
    if (!dialCode) return normalizePhoneForSubmit(rawValue);
    if (digits.startsWith(dialCode)) return `+${digits}`;

    return `+${dialCode}${digits}`;
  }
}
