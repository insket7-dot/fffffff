// carousel.component.ts
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselImage } from '@app/shared/types/common.types';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './carousel.conponent.scss',
    template: `
        <div class="carousel">
            @for (img of images; track $index) {
                <img
                    [src]="img.image"
                    [alt]="img.alt || 'carousel image'"
                    class="carousel-image"
                    [class.active]="$index === currentIndex"
                />
            }
        </div>
    `,
})
export class CarouselComponent implements OnChanges, OnDestroy {
    @Input() images: CarouselImage[] = [];
    @Input() interval = 5000;

    currentIndex = 0;
    private carouselInterval: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['images'] && this.images.length > 0) {
            this.startCarousel();
        } else if (changes['images'] && this.images.length === 0) {
            this.stopCarousel();
        }

        if (changes['interval']) {
            this.restartCarousel();
        }
    }

    ngOnDestroy(): void {
        this.stopCarousel();
    }

    private startCarousel(): void {
        this.stopCarousel();

        if (this.images.length > 1) {
            this.carouselInterval = setInterval(() => {
                this.nextSlide();
            }, this.interval);
        }
    }

    private stopCarousel(): void {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    private restartCarousel(): void {
        this.stopCarousel();
        this.startCarousel();
    }

    nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    prevSlide(): void {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
}
