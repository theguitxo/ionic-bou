import { SafeHtml } from '@angular/platform-browser';

export type InstructionsObjectType = 'text' | 'image' | 'html' | 'title';

export type ImageAlignement = 'start' | 'center' | 'end';
export interface InstructionsObject {
  type: InstructionsObjectType;
  translationKey?: string;
  htmlContent?: string;
  url?: string;
  urlES?: string;
  urlCA?: string;
  imageWithLang?: boolean;
  imageAlignement?: ImageAlignement;
}

export interface InstructionsObjectData {
  objects: InstructionsObject[];
}

export interface InstructionsItem {
  type: InstructionsObjectType;
  value: string | SafeHtml;
  imageAlignement?: ImageAlignement;
}

export interface InstructionsSlide {
  objects: InstructionsItem[];
}
