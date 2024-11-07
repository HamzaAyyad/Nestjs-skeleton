import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from 'src/generated/i18n.generated';
import { AbstractKeyValuePair } from '../interfaces/Abstract-key-value.interface';

@Injectable()
export class LanguageService {
  constructor(private readonly _i18n: I18nService<I18nTranslations>) {}

  translate(
    key: I18nPath,
    args?: AbstractKeyValuePair | AbstractKeyValuePair[]
  ): string {
    return this._i18n.translate(key, { lang: this.currentLang, args });
  }

  get currentLang(): string {
    return I18nContext.current()?.lang ?? 'en';
  }
}
