'use client';

import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarChartCompareProps {
  max: number;
  categories: string[];
  series: Scores[];
}

type Scores = {
  name: string;
  data: number[];
};

export const BarChartCompare = ({
  max,
  series,
  categories
}: BarChartCompareProps) => {
  const { theme } = useTheme();
  const apexChartTheme = theme === 'dark' ? 'dark' : 'light';
  
  // Brand color palette for comparison
  const colors = [
    '#6366f1', // Indigo (Primary)
    '#0ea5e9', // Sky (Secondary)
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899'  // Pink
  ];

  const options: ApexOptions = {
    theme: {
      mode: apexChartTheme
    },
    colors: colors,
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 700,
      labels: {
        colors: theme === 'dark' ? '#cbd5e1' : '#334155'
      },
      markers: {
        radius: 12,
        offsetX: -4
      },
      itemMargin: {
        horizontal: 15,
        vertical: 10
      }
    },
    chart: {
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    grid: {
      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      strokeDashArray: 4,
      padding: {
        top: 20,
        bottom: 20
      }
    },
    yaxis: {
      max,
      labels: {
        style: {
          colors: '#94a3b8',
          fontWeight: 600
        }
      }
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '12px',
          colors: '#94a3b8'
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    tooltip: {
      theme: apexChartTheme,
      y: {
        formatter: (val) => `${val}`
      }
    }
  };

  return (
    <div className="w-full min-h-[350px]">
      <ApexChart
        type='bar'
        options={options}
        series={series}
        height={400}
        width='100%'
      />
    </div>
  );
};
