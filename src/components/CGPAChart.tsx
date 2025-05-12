import React, { useEffect, useRef } from 'react';

interface ChartData {
  labels: string[];
  values: number[];
}

interface CGPAChartProps {
  data: ChartData;
  height?: number;
}

const CGPAChart: React.FC<CGPAChartProps> = ({ data, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data.labels.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { values, labels } = data;
    const maxValue = Math.max(...values, 10); // Max of values or 10 (max GPA)
    const minValue = Math.max(0, Math.min(...values) - 1); // Min value with some padding
    
    const paddingX = 50;
    const paddingY = 30;
    const availableWidth = canvas.width - (paddingX * 2);
    const availableHeight = canvas.height - (paddingY * 2);
    
    const barWidth = availableWidth / labels.length;
    
    // Draw background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color') || '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.moveTo(paddingX, paddingY);
    ctx.lineTo(paddingX, canvas.height - paddingY);
    ctx.lineTo(canvas.width - paddingX, canvas.height - paddingY);
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    
    labels.forEach((label, i) => {
      const x = paddingX + (i * barWidth) + (barWidth / 2);
      ctx.fillText(label, x, canvas.height - (paddingY / 2));
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    const step = (maxValue - minValue) / 5;
    
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (i * step);
      const y = canvas.height - paddingY - ((value - minValue) / (maxValue - minValue) * availableHeight);
      ctx.fillText(value.toFixed(1), paddingX - 10, y + 4);
      
      // Draw grid line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
      ctx.moveTo(paddingX, y);
      ctx.lineTo(canvas.width - paddingX, y);
      ctx.stroke();
    }
    
    // Draw line chart
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3b82f6';
    
    values.forEach((value, i) => {
      const x = paddingX + (i * barWidth) + (barWidth / 2);
      const y = canvas.height - paddingY - ((value - minValue) / (maxValue - minValue) * availableHeight);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    values.forEach((value, i) => {
      const x = paddingX + (i * barWidth) + (barWidth / 2);
      const y = canvas.height - paddingY - ((value - minValue) / (maxValue - minValue) * availableHeight);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw value above point
      ctx.fillStyle = '#3b82f6';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(2), x, y - 15);
    });
    
  }, [data]);

  return (
    <div className="w-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
};

export default CGPAChart;