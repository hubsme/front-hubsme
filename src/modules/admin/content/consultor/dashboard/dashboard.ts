import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import { PATH, buildPath } from '@route/path.route';

type DashboardSummary = ApiResponse<'dashboard', 'summary'>;
type UpcomingMeeting = DashboardSummary['upcomingMeetings'][number];
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
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  private hubsme = inject(HubsmeService);
  private sessionService = inject(SessionService);
  private toastService = inject(ToastService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private liveClock: ReturnType<typeof setInterval> | null = null;

  summary = signal<DashboardSummary | null>(null);
  loading = signal(false);
  now = signal(Date.now());

  isBrowser = isPlatformBrowser(this.platformId);
  role = computed<DashboardRole>(
    () => (this.sessionService.session()?.user.role as DashboardRole) ?? 'admin',
  );
  userName = computed(() => this.sessionService.session()?.user.name ?? 'Hubsme');
  isConsultant = computed(() => this.role() === 'consultor');
  meetingDetailsPath = buildPath(PATH.admin.consultor.meetings);

  headerTitle = computed(() => 'Panel de control');

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
    const stats = this.summary()?.stats;
    if (!stats) return 0;
    return Math.max(1, Math.min(6, Math.ceil((stats.meetings || 1) / 3)));
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
    const taskStatus = this.summary()?.taskStatus ?? {
      pendiente: 0,
      enProgreso: 0,
      completada: 0,
      bloqueada: 0,
    };

    if (this.isConsultant()) {
      return [
        {
          label: 'Clientes activos',
          value: `${stats.clients}`,
          helper: 'PYMES bajo asesoria',
          badge: `${stats.clients} aceptados`,
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
          action: 'upcomingMeetings',
        },
        {
          label: 'Tareas pendientes',
          value: `${taskStatus.pendiente}`,
          helper: 'Acciones por ejecutar',
          badge: `${taskStatus.bloqueada} bloqueadas`,
          icon: 'fas fa-square-check',
          iconClass: 'bg-success/10 text-success',
        },
        {
          label: 'Horas facturables',
          value: `${this.consultantHours()}`,
          helper: 'Acumuladas este mes',
          badge: 'Este mes',
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
        badge: 'Activos en tu red',
        icon: 'fas fa-users',
        iconClass: 'bg-violet-500/10 text-violet-600',
      },
    ];
  });

  workloadRows = computed<WorkloadRow[]>(() => {
    if (this.isConsultant()) {
      return this.summary()?.workloadByClient ?? [];
    }

    const totalTasks = this.summary()?.stats.tasks ?? 0;
    const completed = this.summary()?.taskStatus.completada ?? 0;

    return [
      {
        name: 'Diagnostico',
        total: 10,
        completed: Math.max(5, Math.round(this.healthScore() / 10)),
      },
      {
        name: 'Reuniones',
        total: Math.max(4, totalTasks),
        completed: Math.max(2, Math.round((this.summary()?.stats.meetings ?? 0) * 0.6)),
      },
      { name: 'Tareas', total: Math.max(6, totalTasks), completed: Math.max(2, completed) },
      {
        name: 'Consultores',
        total: Math.max(3, this.consultantCount() + 1),
        completed: this.consultantCount(),
      },
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
    fill: {
      type: 'gradient',
      gradient: {
        shade: this.isDark() ? 'dark' : 'light',
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

  upcomingMeetings = computed(() => this.summary()?.upcomingMeetings ?? []);

  ngOnInit() {
    this.loadSummary();
    if (this.isBrowser) {
      this.liveClock = setInterval(() => this.now.set(Date.now()), 30_000);
    }
  }

  ngOnDestroy(): void {
    if (this.liveClock) clearInterval(this.liveClock);
  }

  loadSummary() {
    this.loading.set(true);
    this.hubsme
      .dashboardSummary()
      .then((res) => this.summary.set(res.data))
      .catch((error) => this.toastService.error(this.hubsme.getErrorMessage(error)))
      .finally(() => this.loading.set(false));
  }

  isMeetingLive(meeting: UpcomingMeeting): boolean {
    const startTime = new Date(meeting.startTime).getTime();
    if (!Number.isFinite(startTime)) return false;

    const endTime = startTime + meeting.durationMinutes * 60_000;
    return this.now() >= startTime && this.now() <= endTime;
  }

  openMeetingInNewTab(meeting: UpcomingMeeting): void {
    if (!this.isBrowser) return;

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/${buildPath(PATH.meetingAccess)}`, meeting.id]),
    );
    window.open(url, '_blank', 'noopener,noreferrer');
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
