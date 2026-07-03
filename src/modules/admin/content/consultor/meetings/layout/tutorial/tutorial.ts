import { Component, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-tutorial',
  imports: [CommonModule],
  templateUrl: './tutorial.html',
})
export class CalendarTutorial implements OnInit, OnDestroy {
  onClose = output<void>();

  currentSlide = signal(0);
  slides = [
    {
      title: 'Paso 1: Selecciona tu Pincel',
      description: 'Selecciona "Disponible" (en verde) para pintar tus horas libres a la semana, o "No disponible" para borrarlas.',
      icon: 'fas fa-paint-brush',
    },
    {
      title: 'Paso 2: Haz Click o Arrastra',
      description: 'Haz clic o arrastra en las horas que tienes disponible a la semana.',
      icon: 'fas fa-mouse-pointer',
    },
    {
      title: 'Paso 3: Guarda tu Disponibilidad',
      description: 'Haz clic en "Guardar". Elige "Solo esta semana" para guardar estos días, o "Todos los días del mes" para replicar este patrón semanal en todo el mes.',
      icon: 'fas fa-floppy-disk',
    },
    {
      title: 'Paso 4: Despinta un Horario',
      description: 'Selecciona "No disponible" y haz clic o arrastra sobre un horario verde para despintarlo. Luego guarda nuevamente tus cambios.',
      icon: 'fas fa-eraser',
    }
  ];

  private autoPlayTimer: any = null;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  nextSlide() {
    this.clearTimer();
    const nextIdx = (this.currentSlide() + 1) % this.slides.length;
    if (this.currentSlide() === this.slides.length - 1) {
      this.skip();
      return;
    }
    this.currentSlide.set(nextIdx);
    this.startTimer();
  }

  prevSlide() {
    this.clearTimer();
    this.currentSlide.update((curr) => (curr - 1 + this.slides.length) % this.slides.length);
    this.startTimer();
  }

  setSlide(index: number) {
    this.clearTimer();
    this.currentSlide.set(index);
    this.startTimer();
  }

  skip() {
    this.onClose.emit();
  }

  private startTimer() {
    this.autoPlayTimer = setTimeout(() => {
      this.nextSlide();
    }, 10000);
  }

  private clearTimer() {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
}
