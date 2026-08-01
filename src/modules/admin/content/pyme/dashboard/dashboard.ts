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
import { ThemeService } from '@service/theme.service';

type DashboardSummary = ApiResponse<'dashboard', 'summary'>;
type DashboardRole = 'admin' | 'pyme' | 'consultor';
type KpiCardAction = 'upcomingMeetings';

type KpiDetail = {
  label: string;
  value: string;
};

type KpiCard = {
  label: string;
  value: string;
  helper: string;
  badge: string;
  icon: string;
  iconClass: string;
  details?: KpiDetail[];
  action?: KpiCardAction;
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
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private hubsme = inject(HubsmeService);
  private sessionService = inject(SessionService);
  private toastService = inject(ToastService);
  private themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  summary = signal<DashboardSummary | null>(null);
  loading = signal(false);

  isBrowser = isPlatformBrowser(this.platformId);
  role = computed<DashboardRole>(
    () => (this.sessionService.session()?.user.role as DashboardRole) ?? 'admin',
  );
  userName = computed(() => this.sessionService.session()?.user.name ?? 'Hubsme');
  isConsultant = computed(() => this.role() === 'consultor');

  headerTitle = computed(() => 'Panel General');

  headerDescription = computed(() =>
    this.isConsultant()
      ? 'Vista global de tu cartera de clientes y compromisos.'
      : 'Aqui tienes un resumen de tu actividad de consultoria.',
  );

  isDark = computed(() => this.themeService.theme() === 'dark');

  chartTheme = computed(() => ({
    text: this.isDark() ? '#94a3b8' : '#6c7a93',
    grid: this.isDark() ? '#334155' : '#eef2f7',
    tooltip: (this.isDark() ? 'dark' : 'light') as 'dark' | 'light',
    surface: this.isDark() ? '#111b30' : '#ffffff',
    title: this.isDark() ? '#f1f5f9' : '#182033',
  }));

  productivityLabel = computed(() => {
    const totalTasks = this.summary()?.stats.tasks ?? 0;
    const completed = this.summary()?.taskStatus.completada ?? 0;
    const ratio = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    return `${ratio}% Productividad`;
  });

  healthScore = computed(() => {
    return this.summary()?.latestDiagnostic?.score ?? 0;
  });

  consultantHours = computed(() => {
    return this.summary()?.stats.billableHours ?? 0;
  });

  consultantCount = computed(() => {
    return this.summary()?.stats.clients ?? 0;
  });

  meetingStats = computed(
    () =>
      this.summary()?.meetingStats ?? {
        total: 0,
        confirmed: 0,
        requested: 0,
        pending: 0,
        completed: 0,
      },
  );

  kpiCards = computed<KpiCard[]>(() => {
    const stats = this.summary()?.stats ?? {
      clients: 0,
      meetings: 0,
      tasks: 0,
      diagnostics: 0,
      billableHours: 0,
    };

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
          label: 'Reuniones',
          value: `${this.meetingStats().total}`,
          helper: 'Total de reuniones',
          badge: `${this.upcomingMeetings().length} confirmadas esta semana`,
          icon: 'fas fa-calendar-days',
          iconClass: 'bg-accent/10 text-accent',
          details: [
            { label: 'Confirmadas', value: `${this.meetingStats().confirmed}` },
            { label: 'Solicitadas', value: `${this.meetingStats().requested}` },
            { label: 'Pendientes', value: `${this.meetingStats().pending}` },
            { label: 'Completadas', value: `${this.meetingStats().completed}` },
          ],
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
        badge: `${stats.diagnostics} registrados`,
        icon: 'fas fa-brain',
        iconClass: 'bg-secondary/8 text-secondary',
      },
      {
        label: 'Reuniones',
        value: `${this.meetingStats().total}`,
        helper: 'Total de reuniones',
        badge: `${this.upcomingMeetings().length} confirmadas esta semana`,
        icon: 'fas fa-calendar-days',
        iconClass: 'bg-accent/10 text-accent',
        details: [
          { label: 'Confirmadas', value: `${this.meetingStats().confirmed}` },
          { label: 'Solicitadas', value: `${this.meetingStats().requested}` },
          { label: 'Pendientes', value: `${this.meetingStats().pending}` },
          { label: 'Completadas', value: `${this.meetingStats().completed}` },
        ],
        action: 'upcomingMeetings',
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
        badge: `${this.consultantCount()} interacciones`,
        icon: 'fas fa-users',
        iconClass: 'bg-violet-500/10 text-violet-600',
      },
    ];
  });

  workloadRows = computed<WorkloadRow[]>(() => {
    const totalTasks = this.summary()?.stats.tasks ?? 0;
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
      {
        name: 'Diagnostico',
        total: this.summary()?.stats.diagnostics ?? 0,
        completed: this.summary()?.stats.diagnostics ?? 0,
      },
      {
        name: 'Reuniones',
        total: this.summary()?.stats.meetings ?? 0,
        completed: this.summary()?.stats.meetings ?? 0,
      },
      { name: 'Tareas', total: totalTasks, completed },
      { name: 'Consultores', total: this.consultantCount(), completed: this.consultantCount() },
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
      {
        label: 'En progreso',
        shortLabel: 'Progreso',
        value: taskStatus.enProgreso,
        color: '#3568ea',
      },
      {
        label: 'Completadas',
        shortLabel: 'Compl.',
        value: taskStatus.completada,
        color: '#16a34a',
      },
      { label: 'Bloqueadas', shortLabel: 'Bloq.', value: taskStatus.bloqueada, color: '#dc2626' },
    ];
  });

  activitySeries = computed(() => {
    const meetings = this.summary()?.stats.meetings ?? 0;
    const tasks = this.summary()?.stats.tasks ?? 0;

    return {
      labels: ['Actual'],
      meetings: [meetings],
      tasks: [tasks],
    };
  });

  hasActivity = computed(() => {
    const stats = this.summary()?.stats;
    return (stats?.meetings ?? 0) > 0 || (stats?.tasks ?? 0) > 0;
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
          colors: this.chartTheme().text,
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
          colors: this.chartTheme().text,
          fontSize: '11px',
          fontFamily: 'Inter SemiBold, sans-serif',
        },
      },
    },
    grid: {
      borderColor: this.chartTheme().grid,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: this.chartTheme().tooltip,
      shared: false,
      intersect: true,
      followCursor: false,
      marker: { show: true },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: this.chartTheme().text },
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
    colors: ['#2563eb', '#f59e0b'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [5, 4],
      lineCap: 'round',
    },
    xaxis: {
      categories: this.activitySeries().labels,
      labels: {
        style: {
          colors: this.chartTheme().text,
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
          colors: this.chartTheme().text,
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
    },
    grid: {
      borderColor: this.chartTheme().grid,
      strokeDashArray: 3,
    },
    tooltip: {
      theme: this.chartTheme().tooltip,
      shared: true,
      intersect: false,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      labels: { colors: this.chartTheme().text },
    },
    plotOptions: {},
    fill: { opacity: 1 },
    markers: {
      size: 5,
      strokeColors: '#ffffff',
      strokeWidth: 3,
      hover: { size: 6, sizeOffset: 0 },
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
      labels: { colors: this.chartTheme().text },
      itemMargin: { horizontal: 14, vertical: 8 },
    },
    stroke: {
      colors: [this.chartTheme().surface],
      width: 6,
    },
    dataLabels: { enabled: false },
    tooltip: { theme: this.chartTheme().tooltip },
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
              color: this.chartTheme().title,
              formatter: (value: string) => `${Math.round(Number(value) || 0)}`,
            },
            total: {
              show: true,
              label: 'Tareas',
              fontSize: '11px',
              fontFamily: 'Inter SemiBold, sans-serif',
              color: this.chartTheme().text,
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
          colors: this.chartTheme().text,
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
          colors: this.chartTheme().text,
          fontSize: '11px',
          fontFamily: 'Inter Medium, sans-serif',
        },
      },
    },
    grid: {
      borderColor: this.chartTheme().grid,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: this.chartTheme().tooltip,
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

  upcomingMeetings = computed(() => {
    const meetings = this.summary()?.upcomingMeetings ?? [];
    return meetings.map((meeting, index) => ({
      ...meeting,
      subtitle: this.isConsultant()
        ? [
            'Revision de estrategia',
            'Workshop IA Marketing',
            'Mesa de seguimiento',
            'Planning trimestral',
          ][index % 4]
        : ['Sesion consultiva', 'Revision operativa', 'Seguimiento comercial', 'Orden financiero'][
            index % 4
          ],
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

  onKpiCardClick(card: KpiCard): void {
    if (card.action !== 'upcomingMeetings' || !isPlatformBrowser(this.platformId)) return;

    document.getElementById('upcoming-sessions')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  onKpiCardKeydown(event: Event, card: KpiCard): void {
    const key = (event as KeyboardEvent).key;
    if (key !== 'Enter' && key !== ' ') return;

    event.preventDefault();
    this.onKpiCardClick(card);
  }

  trackByLabel(_: number, item: { label: string }) {
    return item.label;
  }
}
