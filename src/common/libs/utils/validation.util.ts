import { ValidationArguments } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from 'src/generated/i18n.generated';

export function validationMessage(
  key: I18nPath
): (a: ValidationArguments) => string {
  return i18nValidationMessage<I18nTranslations>(key);
}
