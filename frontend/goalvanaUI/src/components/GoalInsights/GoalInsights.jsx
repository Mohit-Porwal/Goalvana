 import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const CustomCircularProgress = ({ value, color, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ 
        position: 'absolute', 
        transform: 'rotate(-90deg)',
        top: 0,
        left: 0,
        zIndex: 1
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function GoalInsights() {
    const [insights, setInsights] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:5000/goalInsights?user_id=1');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setInsights(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    const renderCircularCard = (label, value, color, isPercentage = false) => {
        const size = 200;
        const strokeWidth = 15; // Adjust this value to change the thickness of the border

        return (
            <Box sx={{ position: 'relative', width: size, height: size, margin: '6% 16px 0', backgroundColor: '' }}>
                <Card
                    sx={{
                        width: size,
                        height: size,
                        backgroundColor: 'transparent',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 16px rgba(31, 38, 135, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {isPercentage && (
                        <CustomCircularProgress
                            value={value}
                            color={color}
                            size={size}
                            strokeWidth={strokeWidth}
                        />
                    )}
                    <CardContent 
                        sx={{ 
                            padding: '16px !important', 
                            position: 'relative', 
                            zIndex: 2,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
                            {label}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                            {isPercentage ? `${value.toFixed(1)}%` : value}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    };

    return (
        <Box sx={{ padding: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center',  alignItems: 'center', gap: 3,}}>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    {renderCircularCard('Total Goal Types', insights.total_goal_types, 'transparent')}
                    {renderCircularCard('Total Goals', insights.total_goals, 'transparent')}
                    {renderCircularCard(
                        'Not Started',
                        insights.percent_of_not_started || 0,
                        'red',
                        true
                    )}
                    {renderCircularCard(
                        'In Progress',
                        insights.percent_of_in_progress || 0,
                        '#007BFF',
                        true
                    )}
                    {renderCircularCard(
                        'Completed',
                        insights.percent_of_completed || 0,
                        '#28A745',
                        true
                    )}
                </>
            )}
        </Box>
    );
}