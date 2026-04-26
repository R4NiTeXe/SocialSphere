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
    { label: "Total Followers", value: stats?.totalFollowers, color: "#6366f1", icon: "👥" },
    { label: "Likes Received", value: stats?.totalLikes, color: "#f43f5e", icon: "❤️" },
    { label: "Posts Created", value: stats?.totalPosts, color: "#10b981", icon: "📝" },
    { label: "Engagement Rate", value: `${stats?.engagementRate}%`, color: "#f59e0b", icon: "📈" }
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
              <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
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
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-faint)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="var(--text-faint)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-elevated)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="posts" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPosts)" 
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
