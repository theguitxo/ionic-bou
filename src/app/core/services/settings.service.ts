import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  AppValues_LOCALSTORAGE_KEY,
  DEFAULT_GAME_DIFFICULTY,
  DEFAULT_LANGUAGE,
  GAME_DIFFICULTY,
  LANGUAGES,
  Settings_LOCALSTORAGE_KEY
} from '../constants/settings.constants';
import { FirePoints } from '../models/fire.points.model';
import { AppValues, Settings } from '../models/settings.model';

@Injectable()
export class SettingsService {
  private _settings!: Settings;
  private _appValues!: AppValues;
  private _firePoints!: FirePoints[];

  private readonly httpClient = inject(HttpClient);

  private _gameVersion = signal<string | undefined>(undefined);
  set gameVersion(value: string | undefined) {
    this._gameVersion.set(value);
  }
  get gameVersion(): WritableSignal<string | undefined> {
    return this._gameVersion;
  }

  constructor() {
    this.httpClient.get('assets/fire.points.json').subscribe((data: Object) => {
      this._firePoints = (data as FirePoints[]) ?? [];
    });
  }

  public loadSettings(): void {
    this._settings = JSON.parse(
      localStorage.getItem(Settings_LOCALSTORAGE_KEY) ?? '{}'
    );
  }

  public saveSettings(): void {
    const settings = JSON.stringify(this._settings);
    localStorage.setItem(Settings_LOCALSTORAGE_KEY, settings);
  }

  public loadAppValues(): void {
    this._appValues = JSON.parse(
      localStorage.getItem(AppValues_LOCALSTORAGE_KEY) ?? '{}'
    );
  }

  public saveAppValues(): void {
    const appValues = JSON.stringify(this._appValues);
    localStorage.setItem(AppValues_LOCALSTORAGE_KEY, appValues);
  }

  get firePoints(): FirePoints[] {
    return this._firePoints;
  }

  get language(): LANGUAGES {
    return this._settings?.language ?? DEFAULT_LANGUAGE;
  }

  set language(value: LANGUAGES) {
    this._settings.language = value;
    this.saveSettings();
  }

  // get pointsPrecision(): POINTS_PRECISION {
  //   return this._settings.pointsPrecision ?? DEFAULT_POINTS_PRECISION;
  // }

  // set pointsPrecision(value: POINTS_PRECISION) {
  //   this._settings.pointsPrecision = value;
  //   this.saveSettings();
  // }

  get gameDifficulty(): GAME_DIFFICULTY {
    return this._settings.gameDifficulty ?? DEFAULT_GAME_DIFFICULTY;
  }

  set gameDifficulty(value: GAME_DIFFICULTY) {
    this._settings.gameDifficulty = value;
    this.saveSettings();
  }

  get instructionsValues(): Partial<AppValues> {
    return {
      instructionsReaded: this._appValues?.instructionsReaded,
      noShowInstructionsReaded: this._appValues?.noShowInstructionsReaded,
    };
  }

  set instructionsValues(
    value: Partial<
      Pick<AppValues, 'instructionsReaded' | 'noShowInstructionsReaded'>
    >
  ) {
    this._appValues = {
      ...this._appValues,
      ...value,
    };
    this.saveAppValues();
  }

  get noShowFirePointsWarning(): boolean {
    return !!this._appValues.noShowFirePointsWarning;
  }

  set noShowFirePointsWarning(value: boolean) {
    this._appValues = {
      ...this._appValues,
      noShowFirePointsWarning: value,
    };
    this.saveAppValues();
  }
}
