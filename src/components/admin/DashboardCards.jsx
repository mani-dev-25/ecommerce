import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { api } from '../../utils/api';
import './DashboardCards.css';

const DashboardCards = () => {
  const [stats, setStats] = useState({
    totalSales: '0',
    revenue: '₹0',
    ordersCount: '0',
    usersCount: '0'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await api.getAdminStats();

        setStats({
          totalSales: statsData.totalSales?.toString() || '0',
          revenue: '₹' + (statsData.revenue || 0).toLocaleString('en-IN'),
          ordersCount: statsData.ordersCount?.toString() || '0',
          usersCount: statsData.usersCount?.toString() || '0'
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);

  const cardsData = [
    {
      id: 1,
      title: 'Total Sales',
      value: stats.totalSales,
      icon: <FiTrendingUp />,
      color: '#ff6b00',
      bgGradient: 'linear-gradient(135deg, rgba(255,107,0,0.12), rgba(255,154,68,0.06))',
    },
    {
      id: 2,
      title: 'Revenue',
      value: stats.revenue,
      icon: <FiDollarSign />,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
    },
    {
      id: 3,
      title: 'Orders',
      value: stats.ordersCount,
      icon: <FiShoppingBag />,
      color: '#6366f1',
      bgGradient: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
    },
    {
      id: 4,
      title: 'Users',
      value: stats.usersCount,
      icon: <FiUsers />,
      color: '#f43f5e',
      bgGradient: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(244,63,94,0.04))',
    },
  ];

  return (
    <div className="dashboard-cards">
      <div className="row w-100 g-3 g-xl-4">
        {cardsData.map((card, index) => (
          <div className="col-6 col-xl-3" key={card.id}>
            <div
              className="stat-card"
              style={{
                '--card-color': card.color,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="stat-card-header">
                <div className="stat-icon" style={{ background: card.bgGradient, color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <div className="stat-card-body">
                <h3 className="stat-value">{card.value}</h3>
                <p className="stat-title">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
