// Constant actual spend data that should never change
const ACTUAL_SPEND = Object.freeze([15000, 11500, 12000, 9500, 5000]);

// Store chart instances
let charts = {};

// Initialize all charts
const createChart = (chartId, chartData) => {
    const ctx = document.getElementById(chartId).getContext('2d');
    // Store the chart instance
    charts[chartId] = new Chart(ctx, chartData);
    return charts[chartId];
};

// Helper function to generate last 7 days
const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
    }
    return days;
};

// Production Expenses Breakdown (Now Chart 1)
const budgetArray = [20000, 10000, 15000, 12000, 7000];

// Calculate totals
const totalBudget = budgetArray.reduce((acc, curr) => acc + curr, 0);
const totalSpend = ACTUAL_SPEND.reduce((acc, curr) => acc + curr, 0);

// Create the initial chart with constant actual spend data
createChart("chart1", {
    type: "bar",
    data: {
        labels: ["Equipment", "Props", "Locations", "Transport", "Catering"],
        datasets: [
            {
                label: "Budget Available",
                data: budgetArray,
                backgroundColor: "rgba(112, 112, 112, 0.2)",
                borderColor: "#707070",
                borderWidth: 1
            },
            {
                label: "Actual Spend",
                data: [...ACTUAL_SPEND], // Use spread to create new array from frozen constant
                backgroundColor: function(context) {
                    // Get the budget value for this index
                    const budgetValue = context.chart.data.datasets[0].data[context.dataIndex];
                    const actualValue = context.raw;
                    // If actual spend exceeds budget, use red color with 0.2 opacity
                    return actualValue > budgetValue ? 'rgba(249, 90, 90, 0.2)' : 'rgba(50, 184, 205, 0.2)';
                },
                borderColor: function(context) {
                    // Match border color to fill color
                    const budgetValue = context.chart.data.datasets[0].data[context.dataIndex];
                    const actualValue = context.raw;
                    return actualValue > budgetValue ? '#F95A5A' : '#32B8CD';
                },
                borderWidth: 1
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Production Expenses Breakdown",
                color: "#161616",
                font: {
                    size: 16
                },
                padding: {
                    bottom: 15
                }
            },
            subtitle: {
                display: true,
                position: 'bottom',
                text: ['Total Budget: £' + totalBudget.toLocaleString() + '                              Total Spend: £' + totalSpend.toLocaleString()],
                color: '#161616',
                font: {
                    size: 14,
                    family: "'Arial', sans-serif",
                    weight: 'bold'
                },
                padding: {
                    top: 25,
                    bottom: 10
                }
            },
            // Add custom plugin for colored rectangles
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const subtitle = chart.options.plugins.subtitle;
                if (subtitle.display) {
                    const x = chart.chartArea.left;
                    const y = chart.height - 30;
                    
                    // Draw budget rectangle with exact legend style
                    ctx.fillStyle = "rgba(112, 112, 112, 0.2)";
                    ctx.strokeStyle = "#707070";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 5, y + 4, 25, 4);
                    ctx.strokeRect(x + 5, y + 4, 25, 4);
                    
                    // Draw spend rectangle with exact legend style
                    const spendColor = totalSpend > totalBudget ? 'rgba(249, 90, 90, 0.2)' : 'rgba(50, 184, 205, 0.2)';
                    const spendBorder = totalSpend > totalBudget ? '#F95A5A' : '#32B8CD';
                    ctx.fillStyle = spendColor;
                    ctx.strokeStyle = spendBorder;
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 350, y + 4, 25, 4);
                    ctx.strokeRect(x + 350, y + 4, 25, 4);
                }
            },
            legend: {
                labels: {
                    color: "#161616",
                    padding: 20
                },
                margin: 40
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: £${context.raw.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
            x: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10
                }
            },
            y: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10,
                    callback: function(value) {
                        return '£' + value.toLocaleString();
                    },
                    stepSize: 4000 // Set step size to £4,000
                },
                min: 0,          // Start at £0
                max: 20000,      // End at £20,000
                suggestedMax: 20000
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    }
});

// Expenses Submitted and VAT Claimed (Now Chart 2)
const expensesData = [4250.00, 3600.00, 5200.00, 4800.00, 3900.00, 4700.00, 4100.00];
const vatData = expensesData.map(amount => amount * 0.2); // 20% VAT

// Calculate totals for expenses
const totalExpenses = expensesData.reduce((acc, curr) => acc + curr, 0);
const totalVAT = vatData.reduce((acc, curr) => acc + curr, 0);

createChart("chart2", {
    type: "bar",
    data: {
        labels: getLast7Days(),
        datasets: [
            {
                label: "Total Expenses Submitted",
                data: expensesData,
                backgroundColor: "rgba(50, 184, 205, 0.2)",
                borderColor: "#32B8CD",
                borderWidth: 1,
                stack: 'Stack 0'
            },
            {
                label: "VAT Claimed",
                data: vatData,
                backgroundColor: "rgba(112, 112, 112, 0.2)",
                borderColor: "#707070",
                borderWidth: 1,
                stack: 'Stack 0'
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Expenses Submitted and VAT Claimed",
                color: "#161616",
                font: {
                    size: 16
                }
            },
            subtitle: {
                display: true,
                position: 'bottom',
                text: ['Total Expenses: £' + totalExpenses.toLocaleString() + '                              Total VAT: £' + totalVAT.toLocaleString()],
                color: '#161616',
                font: {
                    size: 14,
                    family: "'Arial', sans-serif",
                    weight: 'bold'
                },
                padding: {
                    top: 25,
                    bottom: 10
                }
            },
            // Add custom plugin for colored rectangles
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const subtitle = chart.options.plugins.subtitle;
                if (subtitle.display) {
                    const x = chart.chartArea.left;
                    const y = chart.height - 30;
                    
                    // Draw expenses rectangle
                    ctx.fillStyle = "rgba(50, 184, 205, 0.2)";
                    ctx.strokeStyle = "#32B8CD";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 5, y + 4, 25, 4);
                    ctx.strokeRect(x + 5, y + 4, 25, 4);
                    
                    // Draw VAT rectangle
                    ctx.fillStyle = "rgba(112, 112, 112, 0.2)";
                    ctx.strokeStyle = "#707070";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 350, y + 4, 25, 4);
                    ctx.strokeRect(x + 350, y + 4, 25, 4);
                }
            },
            legend: {
                labels: {
                    color: "#161616",
                    padding: 20
                },
                margin: 40
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: £${context.raw.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
            x: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10
                }
            },
            y: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10,
                    callback: function(value) {
                        return '£' + value.toLocaleString();
                    }
                },
                suggestedMax: function() {
                    const max = Math.max(...expensesData);
                    return max * 1.2;
                }()
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    }
});

// Crew and Driver Logs (Now Chart 3)
const crewHours = [11.0, 13.0, 10.5, 13.0, 11.5, 12.0, 11.0]; // Hours worked per day
const driverHours = [6.5, 8.0, 10.0, 7.5, 9.0, 8.5, 7.0]; // Independent variation but generally less than crew

// Calculate totals for hours
const totalCrewHours = crewHours.reduce((acc, curr) => acc + curr, 0);
const totalDriverHours = driverHours.reduce((acc, curr) => acc + curr, 0);

createChart("chart3", {
    type: "line",
    data: {
        labels: getLast7Days(),
        datasets: [
            {
                label: "Crew Hours",
                data: crewHours,
                backgroundColor: "rgba(50, 184, 205, 0.2)",
                borderColor: "#32B8CD",
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
                fill: true
            },
            {
                label: "Driver Hours",
                data: driverHours,
                backgroundColor: "rgba(112, 112, 112, 0.2)",
                borderColor: "#707070",
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
                fill: true
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Crew and Driver Hours",
                color: "#161616",
                font: {
                    size: 16
                }
            },
            subtitle: {
                display: true,
                position: 'bottom',
                text: ['Total Crew Hours: ' + totalCrewHours.toFixed(1) + ' hrs                              Total Driver Hours: ' + totalDriverHours.toFixed(1) + ' hrs'],
                color: '#161616',
                font: {
                    size: 14,
                    family: "'Arial', sans-serif",
                    weight: 'bold'
                },
                padding: {
                    top: 25,
                    bottom: 10
                }
            },
            // Add custom plugin for colored rectangles
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const subtitle = chart.options.plugins.subtitle;
                if (subtitle.display) {
                    const x = chart.chartArea.left;
                    const y = chart.height - 30;
                    
                    // Draw crew rectangle
                    ctx.fillStyle = "rgba(50, 184, 205, 0.2)";
                    ctx.strokeStyle = "#32B8CD";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 5, y + 4, 25, 4);
                    ctx.strokeRect(x + 5, y + 4, 25, 4);
                    
                    // Draw driver rectangle
                    ctx.fillStyle = "rgba(112, 112, 112, 0.2)";
                    ctx.strokeStyle = "#707070";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 350, y + 4, 25, 4);
                    ctx.strokeRect(x + 350, y + 4, 25, 4);
                }
            },
            legend: {
                labels: {
                    color: "#161616",
                    padding: 20
                },
                margin: 40
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw.toFixed(1)} hrs`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
            x: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10
                }
            },
            y: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10,
                    callback: function(value) {
                        return value + ' hrs';
                    }
                },
                min: 0,
                max: 18,
                stepSize: 3
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    }
});

// Invoice Processing (Now Chart 4)
const processedInvoices = [32, 40, 24, 36, 28];
const pendingInvoices = [12, 8, 4, 12, 8];

// Calculate totals for invoices
const totalProcessed = processedInvoices.reduce((acc, curr) => acc + curr, 0);
const totalPending = pendingInvoices.reduce((acc, curr) => acc + curr, 0);

createChart("chart4", {
    type: "bar",
    data: {
        labels: getLast7Days().slice(2),
        datasets: [
            {
                label: "Processed Invoices",
                data: processedInvoices,
                backgroundColor: "rgba(50, 184, 205, 0.2)",
                borderColor: "#32B8CD",
                borderWidth: 1,
                stack: 'Stack 0'
            },
            {
                label: "Pending Invoices",
                data: pendingInvoices,
                backgroundColor: "rgba(112, 112, 112, 0.2)",
                borderColor: "#707070",
                borderWidth: 1,
                stack: 'Stack 0'
            }
        ]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: "Invoice Processing by Day",
                color: "#161616",
                font: {
                    size: 16
                }
            },
            subtitle: {
                display: true,
                position: 'bottom',
                text: ['Total Processed: ' + totalProcessed + '                              Total Pending: ' + totalPending],
                color: '#161616',
                font: {
                    size: 14,
                    family: "'Arial', sans-serif",
                    weight: 'bold'
                },
                padding: {
                    top: 25,
                    bottom: 10
                }
            },
            // Add custom plugin for colored rectangles
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const subtitle = chart.options.plugins.subtitle;
                if (subtitle.display) {
                    const x = chart.chartArea.left;
                    const y = chart.height - 30;
                    
                    // Draw processed rectangle
                    ctx.fillStyle = "rgba(50, 184, 205, 0.2)";
                    ctx.strokeStyle = "#32B8CD";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 5, y + 4, 25, 4);
                    ctx.strokeRect(x + 5, y + 4, 25, 4);
                    
                    // Draw pending rectangle
                    ctx.fillStyle = "rgba(112, 112, 112, 0.2)";
                    ctx.strokeStyle = "#707070";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x + 350, y + 4, 25, 4);
                    ctx.strokeRect(x + 350, y + 4, 25, 4);
                }
            },
            legend: {
                labels: {
                    color: "#161616",
                    padding: 20
                },
                margin: 40
            }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
            x: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10
                }
            },
            y: {
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    drawBorder: false
                },
                ticks: {
                    color: "#161616",
                    padding: 10,
                    stepSize: 8
                },
                min: 0,
                max: 56,
                suggestedMax: 56
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    }
});
