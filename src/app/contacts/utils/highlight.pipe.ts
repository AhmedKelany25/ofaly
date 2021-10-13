import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { split } from './contacts.utils';

const TAG_O = '<ion-text color="primary">';
const TAG_C = '</ion-text>';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string,
    filters: string[] = null,
    anywhere: boolean = false
  ): SafeHtml {
    if (!filters || !filters.length) {
      return value;
    }

    const parts: string[] = split(value);
    const partsMap = new Map();

    filters.sort((a, b) => a.length - b.length);

    for (let part of parts) {
      for (let filter of filters) {
        if (
          anywhere &&
          part.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        ) {
          partsMap.set(part, this.replace(part, filter));
        } else if (
          part.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
        ) {
          partsMap.set(part, this.replace(part, filter));
        } else if (!partsMap.has(part)) {
          partsMap.set(part, part);
        }
      }

      value = value.replace(part, partsMap.get(part));
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  private replace(base: string, lookUp: string): string {
    const index: number = base
      .toLocaleLowerCase()
      .indexOf(lookUp.toLocaleLowerCase());

    const parts: string[] = [
      base.substring(0, index),
      base.substring(index, index + lookUp.length),
      base.substring(index + lookUp.length),
    ];

    parts[1] = `${TAG_O}${parts[1]}${TAG_C}`;

    return parts.join('');
  }
}
