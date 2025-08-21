import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloaderService {
  private progress$ = new BehaviorSubject<number>(0);

  getDownloadProgress(): Observable<number> {
    return this.progress$.asObservable();
  }

  preloadImages(images: string[]): Promise<void> {
    return new Promise((resolve) => {
      if (!images || images.length === 0) {
        this.progress$.next(1);
        resolve();
        return;
      }

      let loadedCounter = 0;
      const totalImages = images.length;

      images.forEach((src) => {
        const img = new Image();
        
        img.onload = () => {
          loadedCounter++;
          this.updateProgress(loadedCounter, totalImages, resolve);
        };

        img.onerror = () => {
          loadedCounter++;
          this.updateProgress(loadedCounter, totalImages, resolve);
        };

        img.src = src;
      });
    });
  }

  private updateProgress(current: number, total: number, resolve: () => void) {
    const progress = current / total;
    this.progress$.next(progress);

    if (current === total) {
      timer(300).pipe(take(1)).subscribe(() => resolve());
    }
  }
}