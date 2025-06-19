import { useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

const SavingsDistribution = () => {
  const [chartData] = useState([
    { name: 'Épargne de précaution', value: 3200 },
    { name: 'Projets', value: 2800 },
    { name: 'Investissements', value: 1500 }
  ]);

  const COLORS = ['#10B981', '#60A5FA', '#8B5CF6'];

  // Calcul du total pour les pourcentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center gap-6 flex-wrap">
        {payload.map((entry, index) => {
          const percentage = ((chartData[index].value / total) * 100).toFixed(1);
          return (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {chartData[index].name}: {chartData[index].value}€ ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  CustomLegend.propTypes = {
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        value: PropTypes.string
      })
    )
  };

  return (
    <div className="w-full h-96">
      <div className="text-lg text-emerald-700 mb-4 text-center">
        — Objectifs d'épargne —
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Legend content={CustomLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsDistribution;