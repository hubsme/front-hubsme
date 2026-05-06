import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ApiResponse } from 'api/backend.api';
import { HubsmeService } from '@service/hubsme.service';
import { SessionService } from '@service/session.service';
import { ToastService } from '@service/toast.service';

type DashboardSummary = ApiResponse<'dashboard', 'summary'>;
type DashboardRole = 'admin' | 'pyme' | 'consultor';

type KpiCard = {
  label: string;
  value: string;
  helper: string;
  badge: string;
  icon: string;
  iconClass: string;
};

type WorkloadRow = {
  name: string;
  total: number;
  completed: number;
};

type TaskSlice = {
  label: string;
  value: number;
  shortLabel: string;
  color: string;
};

type AlertItem = {
  client: string;
  message: string;
  tone: 'danger' | 'warning' | 'info';
};

type AxisChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  markers: ApexMarkers;
  states: ApexStates;
  responsive: ApexResponsive[];
};

type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private hubsme = inject(HubsmeService);
  private sessionService = inject(SessionService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  summary = signal<DashboardSummary | null>(null);
  loading = signal(false);

  isBrowser = isPlatformBrowser(this.platformId);
  role = computed<DashboardRole>(() => (this.sessionService.session()?.user.role as DashboardRole) ?? 'admin');
  userName = computed(() => this.sessionService.session()?.user.name ?? 'Hubsme');
  isConsultant = computed(() => this.role() === 'consultor');

  headerTitle = computed(() =>
    this.isConsultant() ? 'Panel de Control: Consultor' : `Bienvenido, ${this.userName()}`,
  );

  headerDescription = computed(() =>
    this.isConsultant()
      ? 'Vista global de tu cartera de clientes y compromisos.'
      : 'Aqui tienes un resumen de tu actividad de consultoria.',
  );

  productivityLabel = computed(() => {
    const totalTasks = this.summary()?.stats.tasks ?? 0;
    const completed = this.summary()?.taskStatus.completada ?? 0;
    const ratio = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    const uplift = Math.max(8, Math.min(24, Math.round(ratio / 4) || 12));
    return `+${uplift}% Productividad`;
  });

  healthScore = computed(() => {
    const diagnostics = this.summary()?.stats.diagnostics ?? 0;
    const pending = this.summary()?.taskStatus.pendiente ?? 0;
    return Math.max(72, Math.min(96, 78 + diagnostics * 4 - Math.min(pending, 3)));
  });

  consultantHours = computed(() => {
    const stats = this.summary()?.stats;
    if (!stats) return 0;
    return stats.meetings * 6 + stats.clients * 4 + 8;
  });

  consultantCount = computed(() => {
    const stats = this.summary()?.stats;
    if (!stats) return 0;
    return Math.max(1, Math.min(6, Math.ceil((stats.meetings || 1) / 3)));
  });

  kpiCards = computed<KpiCard[]>(() => {
    const stats = this.summary()?.stats ?? { clients: 0, meetings: 0, tasks: 0, diagnostics: 0 };

    if (this.isConsultant()) {
      return [
        {
          label: 'Clientes activos',
          value: `${stats.clients}`,
          helper: 'PYMES bajo asesoria',
          badge: `+${Math.max(1, Math.ceil(stats.clients / 2))} este mes`,
          icon: 'fas fa-user-group',
          iconClass: 'bg-secondary/8 text-secondary',
        },
        {
          label: 'Sesiones totales',
          value: `${stats.meetings}`,
          helper: 'Reuniones gestionadas',
          badge: `${Math.max(1, Math.min(4, this.upcomingMeetings().length || 4))} esta semana`,
          icon: 'fas fa-calendar-days',
          iconClass: 'bg-accent/10 text-accent',
        },
        {
          label: 'Tareas pendientes',
          value: `${stats.tasks}`,
          helper: 'Acciones por ejecutar',
          badge: `${Math.max(1, this.summary()?.taskStatus.pendiente ?? 0)} criticas`,
          icon: 'fas fa-square-check',
          iconClass: 'bg-success/10 text-success',
        },
        {
          label: 'Horas facturables',
          value: `${this.consultantHours()}`,
          helper: 'Acumuladas este mes',
          badge: `S/ ${(this.consultantHours() * 150).toLocaleString('en-US')} est.`,
          icon: 'fas fa-clock',
          iconClass: 'bg-violet-500/10 text-violet-600',
        },
      ];
    }

    return [
      {
        label: 'Diagnostico',
        value: `${this.healthScore()}/100`,
        helper: 'Puntaje de salud empresarial',
        badge: `+${Math.max(3, stats.diagnostics * 2)} vs mes anterior`,
        icon: 'fas fa-brain',
        iconClass: 'bg-secondary/8 text-secondary',
      },
      {
        label: 'Reuniones',
        value: `${stats.meetings}`,
        helper: 'Sesiones completadas',
        badge: `${this.upcomingMeetings().length} pendientes esta semana`,
        icon: 'fas fa-calendar-days',
        iconClass: 'bg-accent/10 text-accent',
      },
      {
        label: 'Tareas',
        value: `${stats.tasks}`,
        helper: 'Acciones en progreso',
        badge: `${this.summary()?.taskStatus.completada ?? 0} completadas`,
        icon: 'fas fa-square-check',
        iconClass: 'bg-success/10 text-success',
      },
      {
        label: 'Consultores',
        value: `${this.consultantCount()}`,
        helper: 'Expertos conectados',
        badge: 'Activos en tu red',
        icon: 'fas fa-users',
        iconClass: 'bg-violet-500/10 text-violet-600',
      },
    ];
  });

  workloadRows = computed<WorkloadRow[]>(() => {
    const totalTasks = Math.max(4, this.summary()?.stats.tasks ?? 0);
    const completed = this.summary()?.taskStatus.completada ?? 0;

    if (this.isConsultant()) {
      return [
        {
          name: 'Textiles Sur',
          total: Math.max(4, Math.round(totalTasks * 0.34)),
          completed: Math.max(2, Math.round(completed * 0.28)),
        },
        {
          name: 'TecnoLogistica',
          total: Math.max(3, Math.round(totalTasks * 0.22)),
          completed: Math.max(1, Math.round(completed * 0.14)),
        },
        {
          name: 'Alimentos SAC',
          total: Math.max(5, Math.round(totalTasks * 0.29)),
          completed: Math.max(3, Math.round(completed * 0.33)),
        },
        {
          name: 'Constructora X',
          total: Math.max(2, Math.round(totalTasks * 0.15)),
          completed: Math.max(1, Math.round(completed * 0.1)),
        },
      ];
    }

    return [
      { name: 'Diagnostico', total: 10, completed: Math.max(5, Math.round(this.healthScore() / 10)) },
      {
        name: 'Reuniones',
        total: Math.max(4, totalTasks),
        completed: Math.max(2, Math.round((this.summary()?.stats.meetings ?? 0) * 0.6)),
      },
      { name: 'Tareas', total: Math.max(6, totalTasks), completed: Math.max(2, completed) },
      { name: 'Consultores', total: Math.max(3, this.consultantCount() + 1), completed: this.consultantCount() },
    ];
  });

  taskSlices = computed<TaskSlice[]>(() => {
    const taskStatus = this.summary()?.taskStatus ?? {
      pendiente: 0,
      enProgreso: 0,
      completada: 0,
      bloqueada: 0,
    };

    return [
      { label: 'Pendientes', shortLabel: 'Pend.', value: taskStatus.pendiente, color: '#94a3b8' },
      { label: 'En progreso', shortLabel: 'Progreso', value: taskStatus.enProgreso, color: '#3568ea' },
      { label: 'Completadas', shortLabel: 'Compl.', value: taskStatus.completada, color: '#16a34a' },
      { label: 'Bloqueadas', shortLabel: 'Bloq.', value: taskStatus.bloqueada, color: '#dc2626' },
    ];
  });

  activitySeries = computed(() => {
    const meetings = Math.max(4, this.summary()?.stats.meetings ?? 0);
    const tasks = Math.max(3, this.summary()?.stats.tasks ?? 0);

    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr'],
      meetings: [
        Math.max(2, Math.round(meetings * 0.33)),
        Math.max(3, Math.round(meetings * 0.58)),
        Math.max(3, Math.round(meetings * 0.45)),
        Math.max(4, Math.round(meetings * 0.75)),
      ],
      tasks: [
        Math.max(1, Math.round(tasks * 0.2)),
        Math.max(2, Math.round(tasks * 0.28)),
        Math.max(3, Math.round(tasks * 0.38)),
        Math.max(3, Math.round(tasks * 0.46)),
      ],
    };
  });

  workloadChartOptions = computed<AxisChartOptions>(() => ({
    series: [
      {
        name: 'Total tareas',
        data: this.workloadRows().map((row) => row.total),
      },
      {
        name: 'Completadas',
        data: this.workloadRows().map((row) => row.completed),
      },
    ],
    chart: {
      type: 'bar',
      height: 340,
      toolbar: { show: false },
      fontFamily: 'Inter Regular, sans-serif',
      sparkline: { enabled: false },
      animations: { enabled: false },
    },
    colors: ['#e2e8f0', '#3568ea'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '48%',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: this.workloadRows().map((row) => row.name),
      labels: {
        style: {
          colors: '#6c7a93',
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6c7a93',
          fontSize: '11px',
          fontFamily: 'Inter SemiBold, sans-serif',
        },
      },
    },
    grid: {
      borderColor: '#eef2f7',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: 'light',
      shared: false,
      intersect: true,
      followCursor: false,
      marker: { show: true },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: '#6c7a93' },
    },
    fill: { opacity: 1 },
    markers: { size: 0 },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' }, allowMultipleDataPointsSelection: false },
    },
    responsive: [],
  }));

  lineChartOptions = computed<AxisChartOptions>(() => ({
    series: [
      { name: 'Reuniones', data: this.activitySeries().meetings },
      { name: 'Tareas', data: this.activitySeries().tasks },
    ],
    chart: {
      type: 'line',
      height: 340,
      toolbar: { show: false },
      fontFamily: 'Inter Regular, sans-serif',
      animations: { enabled: false },
    },
    colors: ['#3568ea', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [4, 3],
    },
    xaxis: {
      categories: this.activitySeries().labels,
      labels: {
        style: {
          colors: '#6c7a93',
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
    },
    grid: {
      borderColor: '#eef2f7',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: '#6c7a93' },
    },
    plotOptions: {},
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.12,
        opacityFrom: 0.28,
        opacityTo: 0.03,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 3,
      strokeWidth: 0,
      hover: { sizeOffset: 1 },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' }, allowMultipleDataPointsSelection: false },
    },
    responsive: [],
  }));

  donutChartOptions = computed<DonutChartOptions>(() => ({
    series: this.taskSlices().map((item) => item.value),
    chart: {
      type: 'donut',
      height: 340,
      toolbar: { show: false },
      fontFamily: 'Inter Regular, sans-serif',
      animations: { enabled: false },
    },
    labels: this.taskSlices().map((item) => item.label),
    colors: this.taskSlices().map((item) => item.color),
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#6c7a93' },
      itemMargin: { horizontal: 14, vertical: 8 },
    },
    stroke: {
      colors: ['#ffffff'],
      width: 6,
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: '26px',
              fontFamily: 'Inter Bold, sans-serif',
              color: '#182033',
              formatter: (value: string) => `${Math.round(Number(value) || 0)}`,
            },
            total: {
              show: true,
              label: 'Tareas',
              fontSize: '11px',
              fontFamily: 'Inter SemiBold, sans-serif',
              color: '#6c7a93',
              formatter: () => `${this.summary()?.stats.tasks ?? 0}`,
            },
          },
        },
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' }, allowMultipleDataPointsSelection: false },
    },
    responsive: [{ breakpoint: 1280, options: { chart: { height: 300 } } }],
  }));

  taskBarsChartOptions = computed<AxisChartOptions>(() => ({
    series: [
      {
        name: 'Tareas',
        data: this.taskSlices().map((item) => item.value),
      },
    ],
    chart: {
      type: 'bar',
      height: 340,
      toolbar: { show: false },
      fontFamily: 'Inter Regular, sans-serif',
      animations: { enabled: false },
    },
    colors: this.taskSlices().map((item) => item.color),
    plotOptions: {
      bar: {
        columnWidth: '42%',
        borderRadius: 8,
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: this.taskSlices().map((item) => item.shortLabel),
      labels: {
        style: {
          colors: '#6c7a93',
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
    },
    grid: {
      borderColor: '#eef2f7',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'light',
      shared: false,
      intersect: true,
      followCursor: false,
      marker: { show: true },
    },
    stroke: { show: false },
    legend: { show: false },
    fill: { opacity: 1 },
    markers: { size: 0 },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' }, allowMultipleDataPointsSelection: false },
    },
    responsive: [],
  }));

  alerts = computed<AlertItem[]>(() => {
    if (this.isConsultant()) {
      return [
        {
          client: 'Textiles del Sur',
          message: `${Math.max(2, this.summary()?.taskStatus.pendiente ?? 0)} tareas criticas vencen manana`,
          tone: 'danger',
        },
        { client: 'TecnoLogistica', message: 'Reunion de seguimiento no agendada', tone: 'warning' },
        { client: 'Alimentos SAC', message: 'Nuevo frente comercial requiere acompanamiento', tone: 'info' },
      ];
    }

    return [
      { client: 'Operacion', message: 'Pipeline comercial requiere seguimiento diario', tone: 'warning' },
      {
        client: 'Equipo',
        message: `${Math.max(1, this.summary()?.taskStatus.bloqueada ?? 0)} bloqueos necesitan destrabe esta semana`,
        tone: 'danger',
      },
      {
        client: 'Crecimiento',
        message: 'Tu red de consultores ya tiene disponibilidad para nuevas sesiones',
        tone: 'info',
      },
    ];
  });

  upcomingMeetings = computed(() => {
    const meetings = this.summary()?.upcomingMeetings ?? [];
    return meetings.map((meeting, index) => ({
      ...meeting,
      subtitle: this.isConsultant()
        ? ['Revision de estrategia', 'Workshop IA Marketing', 'Mesa de seguimiento', 'Planning trimestral'][index % 4]
        : ['Sesion consultiva', 'Revision operativa', 'Seguimiento comercial', 'Orden financiero'][index % 4],
      mode: meeting.status === 'solicitada' ? 'Por confirmar' : 'Virtual',
    }));
  });

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.loading.set(true);
    this.hubsme
      .dashboardSummary()
      .then((res) => this.summary.set(res.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  alertToneClasses(tone: AlertItem['tone']) {
    if (tone === 'danger') return 'border-danger/10 bg-danger/6 text-danger';
    if (tone === 'warning') return 'border-accent/15 bg-accent/6 text-amber-700';
    return 'border-secondary/10 bg-secondary/6 text-secondary';
  }

  trackByLabel(_: number, item: { label: string }) {
    return item.label;
  }
}
