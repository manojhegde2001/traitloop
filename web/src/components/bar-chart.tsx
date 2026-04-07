'use client';

import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartProps {
  max: number;
  results: any;
}

export const BarChart = ({ max, results }: BarChartProps) => {
  const { theme } = useTheme();
  const apexChartTheme = theme === 'dark' ? 'dark' : 'light';
  
  const options: ApexOptions = {
    theme: {
      mode: apexChartTheme
    },
    legend: {
      show: false
    },
    chart: {
      toolbar: {
        show: false
      },
      fontFamily: 'Outfit, Inter, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 200
        }
      }
    },
    grid: {
      show: true,
      borderColor: 'rgba(var(--nextui-divider-rgb), 0.05)',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 0,
        left: 20
      }
    },
    yaxis: {
      max,
      tickAmount: 4,
      labels: {
        style: {
          colors: 'rgba(var(--nextui-foreground-rgb), 0.4)',
          fontWeight: 600,
          fontSize: '11px'
        }
      }
    },
    xaxis: {
      categories: results.map((result: any) => result.title),
      labels: {
        style: {
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800,
          fontSize: '12px',
          colors: 'rgba(var(--nextui-foreground-rgb), 0.7)'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 12,
        columnWidth: '55%',
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    // Premium Vibrant Palette: Indigo, Sky, Rose, Amber, Emerald, Orange
    colors: ['#6366f1', '#0ea5e9', '#f43f5e', '#f59e0b', '#10b981', '#f97316'],
    dataLabels: {
      enabled: true,
      offsetY: -30,
      style: {
        fontSize: '14px',
        fontWeight: 900,
        fontFamily: 'Outfit, sans-serif',
        colors: ['rgba(var(--nextui-primary-rgb), 1)']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 6,
        borderRadius: 8,
        borderWidth: 0,
        opacity: 0.1,
        dropShadow: {
            enabled: false
        }
      }
    },
    tooltip: {
      theme: apexChartTheme,
      y: {
        formatter: (val) => `${val} / ${max}`,
        title: {
          formatter: () => 'Score'
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
    }
  };

  const series = [
    {
      name: 'Score',
      data: results.map((result: any) => result.score)
    }
  ];

  return (
    <div className="glass-card p-4 md:p-10 mb-12 border-divider/10 shadow-3xl bg-gradient-to-br from-white/5 to-transparent relative overflow-visible">
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />
      
      <ApexChart
        type='bar'
        options={options}
        series={series}
        height={450}
        width='100%'
      />
    </div>
  );
};
