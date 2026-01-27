# Real-time Data Visualization with React and WebSockets

Building real-time dashboards and data visualization requires efficient data streaming, performant rendering, and smooth animations. This guide covers implementing production-ready real-time visualizations.

## Table of Contents

1. [WebSocket Fundamentals](#websockets)
2. [React Integration](#react-integration)
3. [Chart Libraries](#chart-libraries)
4. [Performance Optimization](#performance)
5. [Real-time Dashboard](#dashboard)
6. [Error Handling & Reconnection](#error-handling)
7. [Production Considerations](#production)

---

## WebSocket Fundamentals {#websockets}

### Basic WebSocket Connection

```typescript
// lib/websocket.ts
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string) {}

  connect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      this.handleReconnect(onMessage, onError);
    };
  }

  private handleReconnect(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(onMessage, onError), delay);
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
```

---

## React Integration {#react-integration}

### Custom WebSocket Hook

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";
import { WebSocketClient } from "@/lib/websocket";

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const client = new WebSocketClient(url);
    clientRef.current = client;

    client.connect(
      (data) => {
        setLastMessage(data);
        options.onMessage?.(data);
      },
      (error) => {
        setIsConnected(false);
        options.onError?.(error);
      },
    );

    setIsConnected(true);
    options.onConnect?.();

    return () => {
      client.disconnect();
      setIsConnected(false);
      options.onDisconnect?.();
    };
  }, [url]);

  const sendMessage = (data: any) => {
    clientRef.current?.send(data);
  };

  return { isConnected, lastMessage, sendMessage };
}
```

### Real-time Data Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface DataPoint {
  timestamp: number;
  value: number;
}

export function RealtimeChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const maxDataPoints = 50;

  const { isConnected, lastMessage } = useWebSocket('ws://localhost:8080/data', {
    onMessage: (message) => {
      console.log('Received:', message);
    },
  });

  useEffect(() => {
    if (lastMessage) {
      setData((prev) => {
        const newData = [...prev, lastMessage];
        // Keep only the latest N points
        return newData.slice(-maxDataPoints);
      });
    }
  }, [lastMessage]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      <LineChart data={data} />
    </div>
  );
}
```

---

## Chart Libraries {#chart-libraries}

### Recharts Implementation

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  timestamp: number;
  value: number;
}

export function RealtimeLineChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Chart.js with React

```typescript
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function StreamingChart({ data }: { data: number[] }) {
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Real-time Data',
        data: data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Disable animation for smooth real-time updates
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Line data={chartData} options={options} height={400} />;
}
```

---

## Performance Optimization {#performance}

### Throttling Updates

```typescript
import { useRef, useEffect, useState } from 'react';

export function useThrottledValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now - lastUpdate.current >= delay) {
      setThrottledValue(value);
      lastUpdate.current = now;
    } else {
      const timeoutId = setTimeout(() => {
        setThrottledValue(value);
        lastUpdate.current = Date.now();
      }, delay - (now - lastUpdate.current));

      return () => clearTimeout(timeoutId);
    }
  }, [value, delay]);

  return throttledValue;
}

// Usage
export function OptimizedChart() {
  const [data, setData] = useState<number[]>([]);
  const throttledData = useThrottledValue(data, 100); // Update every 100ms

  return <StreamingChart data={throttledData} />;
}
```

### Virtual Scrolling for Large Datasets

```typescript
'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface DataPoint {
  id: string;
  timestamp: number;
  value: number;
}

export function VirtualizedDataList({ data }: { data: DataPoint[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = data[virtualRow.index];
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="flex items-center justify-between border-b p-4"
            >
              <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              <span className="font-mono">{item.value.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Canvas-based Rendering

```typescript
'use client';

import { useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

export function CanvasChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return;

    // Find min/max for scaling
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Draw line
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * canvas.width;
      const y = canvas.height - ((point.value - minValue) / range) * canvas.height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [data]);

  return <canvas ref={canvasRef} width={800} height={400} className="w-full" />;
}
```

---

## Real-time Dashboard {#dashboard}

### Complete Dashboard Implementation

```typescript
'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RealtimeLineChart } from '@/components/RealtimeLineChart';
import { VirtualizedDataList } from '@/components/VirtualizedDataList';

interface Metric {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: number;
}

export function RealtimeDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [stats, setStats] = useState({
    messagesReceived: 0,
    avgLatency: 0,
  });

  const { isConnected } = useWebSocket('ws://localhost:8080/metrics', {
    onMessage: (data: Metric) => {
      setMetrics((prev) => [...prev.slice(-99), data]);
      setStats((prev) => ({
        messagesReceived: prev.messagesReceived + 1,
        avgLatency: (prev.avgLatency + (Date.now() - data.timestamp)) / 2,
      }));
    },
  });

  return (
    <div className="space-y-6 p-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">System Metrics</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
          <span className="text-sm text-gray-600">
            Messages: {stats.messagesReceived}
          </span>
          <span className="text-sm text-gray-600">
            Latency: {stats.avgLatency.toFixed(0)}ms
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">CPU Usage</h2>
          <RealtimeLineChart
            data={metrics.map((m) => ({ timestamp: m.timestamp, value: m.cpu }))}
          />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Memory Usage</h2>
          <RealtimeLineChart
            data={metrics.map((m) => ({ timestamp: m.timestamp, value: m.memory }))}
          />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Disk I/O</h2>
          <RealtimeLineChart
            data={metrics.map((m) => ({ timestamp: m.timestamp, value: m.disk }))}
          />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Network Traffic</h2>
          <RealtimeLineChart
            data={metrics.map((m) => ({ timestamp: m.timestamp, value: m.network }))}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Data</h2>
        <VirtualizedDataList
          data={metrics.map((m, i) => ({
            id: `${i}`,
            timestamp: m.timestamp,
            value: m.cpu,
          }))}
        />
      </div>
    </div>
  );
}
```

---

## Error Handling & Reconnection {#error-handling}

### Robust Connection Manager

```typescript
export class ResilientWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageQueue: any[] = [];
  private isIntentionallyClosed = false;

  constructor(
    private url: string,
    private options: {
      maxReconnectAttempts?: number;
      reconnectInterval?: number;
      onConnect?: () => void;
      onDisconnect?: () => void;
      onMessage?: (data: any) => void;
      onError?: (error: Event) => void;
    } = {},
  ) {}

  connect() {
    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("Connected");
      this.options.onConnect?.();
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.options.onMessage?.(data);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.options.onError?.(error);
    };

    this.ws.onclose = () => {
      console.log("Disconnected");
      this.options.onDisconnect?.();

      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect() {
    const interval = this.options.reconnectInterval || 3000;

    this.reconnectTimer = setTimeout(() => {
      console.log("Attempting to reconnect...");
      this.connect();
    }, interval);
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  close() {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
  }
}
```

---

## Production Considerations {#production}

### Monitoring & Metrics

```typescript
export class WebSocketMonitor {
  private metrics = {
    messagesReceived: 0,
    messagesSent: 0,
    errors: 0,
    reconnections: 0,
    averageLatency: 0,
    latencies: [] as number[],
  };

  recordMessage(type: "sent" | "received", latency?: number) {
    if (type === "sent") {
      this.metrics.messagesSent++;
    } else {
      this.metrics.messagesReceived++;
      if (latency) {
        this.metrics.latencies.push(latency);
        this.metrics.averageLatency =
          this.metrics.latencies.reduce((a, b) => a + b, 0) /
          this.metrics.latencies.length;
      }
    }
  }

  recordError() {
    this.metrics.errors++;
  }

  recordReconnection() {
    this.metrics.reconnections++;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      messagesReceived: 0,
      messagesSent: 0,
      errors: 0,
      reconnections: 0,
      averageLatency: 0,
      latencies: [],
    };
  }
}
```

---

## Conclusion

Real-time data visualization requires careful consideration of performance, error handling, and user experience. Use WebSockets for efficient bidirectional communication, optimize rendering with throttling and canvas, and implement robust reconnection strategies for production reliability.
