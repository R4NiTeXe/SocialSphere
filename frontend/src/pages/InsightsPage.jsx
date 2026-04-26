import { useState, useEffect } from "react";
import { getUserStats, getUserActivity } from "../api/user.api";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import "./InsightsPage.css";

export default function InsightsPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          getUserStats(),
          getUserActivity()
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const statCards = [
    { 
      label: "Total Followers", 
      value: stats?.totalFollowers, 
      color: "#4f46e5", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ) 
    },
    { 
      label: "Likes Received", 
      value: stats?.totalLikes, 
      color: "#dc2626", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ) 
    },
    { 
      label: "Posts Created", 
      value: stats?.totalPosts, 
      color: "#059669", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ) 
    },
    { 
      label: "Engagement Rate", 
      value: `${stats?.engagementRate}%`, 
      color: "#d97706", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ) 
    }
  ];

  return (
    <div className="app-container">
      <Header />
      <main className="insights-main">
        <div className="insights-header">
          <h1>Social Insights</h1>
          <p>Track your growth and engagement over time.</p>
        </div>

        <div className="stats-grid">
          {statCards.map((card, i) => (
            <div key={i} className="stat-card glass">
              <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
                {card.icon}
              </div>
              <div className="stat-info">
                <h3>{card.value}</h3>
                <p>{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-container">
          <div className="chart-card glass">
            <h3>Posting Activity (Last 7 Days)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-elevated)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text)',
                      boxShadow: 'var(--shadow-md)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="posts" 
                    stroke="var(--accent)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPosts)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
