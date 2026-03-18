import React, { Component } from 'react';
import Chart from 'chart.js';

// Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default class AgeChart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { data } = this.props;

    const drawPercentageLabels = {
      id: 'percentageLabels',
      afterDatasetsDraw(chart) {
        const { ctx, scales } = chart;

        if (!scales.y || !scales.x) return;

        const y = scales.y;
        const x = scales.x;

        ctx.save();
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';

        chart.data.labels.forEach((label, index) => {
          const yPos = y.getPixelForValue(index);
          const percentage = groupPercentages[index];
          ctx.fillText(`${percentage}%`, x.right + 5, yPos);
        });

        ctx.restore();
      }
    };

    const customOrder = [
      "under 20",
      "20-30",
      "30-40",
      "40-50",
      "50-60",
      "60+"
    ];

    const updatedData = data.map(item => {
      if (item.AgeGroup === "20-с доош") item.AgeGroup = "under 20";
      if (item.AgeGroup === "60-с дээш") item.AgeGroup = "60+";
      return item;
    });

    const sortedData = updatedData.slice().sort(
      (a, b) => customOrder.indexOf(b.AgeGroup) - customOrder.indexOf(a.AgeGroup)
    );

    const transformedData = sortedData.map(item => ({
      ...item,
      Female: -item.Female,
    }));

    const totalMale = transformedData.reduce((acc, item) => acc + item.Male, 0);
    const totalFemale = transformedData.reduce((acc, item) => acc + item.Female, 0);

    const groupTotals = transformedData.map(item => Math.abs(item.Male) + Math.abs(item.Female));
    const grandTotal = groupTotals.reduce((a, b) => a + b, 0);
    const groupPercentages = groupTotals.map(val => ((val / grandTotal) * 100).toFixed(1));

    this.chartInstance = new Chart(this.chartRef.current, {
      type: 'bar',
      data: {
        labels: transformedData.map(item => item.AgeGroup),
        datasets: [
          {
            label: `Woman (${-(totalFemale)})`,
            data: transformedData.map(item => item.Female),
            backgroundColor: '#FF69B4',
            barThickness: 15,
          },
          {
            label: `Man (${totalMale})`,
            data: transformedData.map(item => item.Male),
            backgroundColor: '#0088FE',
            barThickness: 15 ,
          }
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 40,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value) => Math.abs(value),
            },
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              title: () => '',
              label: (context) => `${Math.abs(context.raw)}`,
            },
          },
        },
      },
      plugins: [drawPercentageLabels], 
    });
  }

  componentWillUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  render() {
    return (
      <div style={{ height: '250px', width: '100%' }}>
        <canvas ref={this.chartRef}></canvas>
      </div>
    );
  }
}
