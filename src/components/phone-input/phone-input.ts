import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
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
import type { Iti } from 'intl-tel-input';

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
  private instance: Iti | null = null;
  private currentValue = '';
  private disabled = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  @Input() name = 'phone';
  @Input() placeholder = '999 999 999';

  @ViewChild('phoneInput') private phoneInput?: ElementRef<HTMLInputElement>;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId) || !this.phoneInput) return;

    const { default: intlTelInput } = await import('intl-tel-input');
    this.instance = intlTelInput(this.phoneInput.nativeElement, {
      initialCountry: 'pe',
      separateDialCode: true,
      strictMode: true,
      loadUtils: () => import('intl-tel-input/utils'),
    });

    this.instance.setNumber(this.toDisplayNumber(this.currentValue));
    this.instance.setDisabled(this.disabled);
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }

  writeValue(value: string | null): void {
    this.currentValue = value ?? '';
    this.instance?.setNumber(this.toDisplayNumber(this.currentValue));
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
    const rawValue = this.phoneInput?.nativeElement.value.trim() ?? '';
    const value = this.getCurrentNumber(rawValue);
    this.currentValue = value;
    this.onChange(value);
  }

  handleBlur() {
    this.handleInput();
    this.onTouched();
  }

  private toDisplayNumber(value: string) {
    return normalizePhoneForSubmit(value);
  }

  private getCurrentNumber(rawValue: string) {
    const digits = rawValue.replace(/\D/g, '');
    if (!digits) return '';
    if (rawValue.trim().startsWith('+')) return normalizePhoneForSubmit(rawValue);

    const dialCode = this.instance?.getSelectedCountry()?.dialCode;
    if (!dialCode) return normalizePhoneForSubmit(rawValue);
    if (digits.startsWith(dialCode)) return `+${digits}`;

    return `+${dialCode}${digits}`;
  }
}
