import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PATH, buildPath } from '@route/path.route';

type LandingRole = 'pyme' | 'consultor';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private router = inject(Router);

  protected readonly consultants = [
    {
      name: 'Carlos Mendoza',
      specialty: 'Estrategia Digital',
      score: '4.9',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Carlos',
    },
    {
      name: 'Ana Lucia Torres',
      specialty: 'Consultoria Financiera',
      score: '4.8',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Ana',
    },
    {
      name: 'Roberto Sanchez',
      specialty: 'Experto en Operaciones',
      score: '4.7',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Roberto',
    },
    {
      name: 'Elena Rivas',
      specialty: 'Especialista en RRHH',
      score: '4.9',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Elena',
    },
  ];

  protected readonly services = [
    {
      title: 'Consultoria de RRHH',
      description: 'Optimiza tu talento humano y tu cultura organizacional con acompanamiento experto.',
    },
    {
      title: 'Consultoria de Finanzas',
      description: 'Estrategias financieras concretas para ganar control, liquidez y rentabilidad.',
    },
    {
      title: 'Consultoria de Logistica',
      description: 'Mejora tu cadena de suministro, distribucion y capacidad de respuesta operativa.',
    },
    {
      title: 'Consultoria de Operaciones',
      description: 'Procesos mas simples, indicadores claros y ejecucion continua para crecer ordenadamente.',
    },
  ];

  protected readonly stats = [
    { value: '+120', label: 'Diagnosticos realizados' },
    { value: '92%', label: 'Empresas con plan accionable' },
    { value: '+45', label: 'Consultores validados' },
  ];

  protected goToLogin(): void {
    this.router.navigate([buildPath(PATH.auth.signIn)]);
  }

  protected goToSignUp(role: LandingRole): void {
    this.router.navigate([buildPath(PATH.auth.signUp)], {
      queryParams: { role },
    });
  }
}
