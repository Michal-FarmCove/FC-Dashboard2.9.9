// Budget data for Q1, Q2, and Q3
const budgetData = {
    q1: {
        equipment: 20000,
        props: 10000,
        locations: 15000,
        transport: 12000,
        catering: 7000
    },
    q2: {
        // Q2 budget values reduced by 25% compared to Q1
        equipment: 15000, // Reduced from 20000
        props: 7500,      // Reduced from 10000
        locations: 11250, // Reduced from 15000
        transport: 9000,  // Reduced from 12000
        catering: 5250    // Reduced from 7000
    },
    q3: {
        // Q3 budget values reduced by 35% compared to Q1 (following the pattern of reduction)
        equipment: 13000, // Further reduced from Q2
        props: 6500,      // Further reduced from Q2
        locations: 9750,  // Further reduced from Q2
        transport: 7800,  // Further reduced from Q2
        catering: 4550    // Further reduced from Q2
    }
};

// Function to show upload popup
function showUploadPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 61%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        text-align: center;
    `;
    
    popup.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #161616;">Please upload a CSV file</h3>
        <button id="uploadBtn" style="
            background: #32B8CD;
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            
        ">Upload</button>
    `;

    // Add overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Add click handlers
    overlay.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    document.getElementById('uploadBtn').addEventListener('click', () => {
        // Change popup content to success message
        popup.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #161616;">Budget successfully uploaded and selected</h3>
            <button id="okBtn" style="
                background: #32B8CD;
                color: white;
                padding: 8px 20px;
                border-radius: 5px;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
            ">OK</button>
        `;

        // Add click handler for OK button
        document.getElementById('okBtn').addEventListener('click', () => {
            // Select Q3 in the dropdown
            const budgetSelect = document.getElementById('budgetSelect');
            // Add Q3 option if it doesn't exist
            if (!Array.from(budgetSelect.options).some(opt => opt.value === 'q3')) {
                const q3Option = new Option('Q3 2024 Budget', 'q3');
                budgetSelect.add(q3Option);
            }
            // Select Q3
            budgetSelect.value = 'q3';
            // Update chart
            updateBudgetChart('q3');
            // Remove popup
            popup.remove();
            overlay.remove();
        });
    });
}

// Add click handler to upload button
document.querySelector('.upload-button').addEventListener('click', showUploadPopup);

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

// Function to update chart based on selected quarter
window.updateBudgetChart = (quarter) => {
    console.log('Updating budget for quarter:', quarter);
    const selectedBudget = budgetData[quarter];
    
    if (charts["chart1"]) {
        // Only update the budget dataset (index 0)
        charts["chart1"].data.datasets[0].data = [
            selectedBudget.equipment,
            selectedBudget.props,
            selectedBudget.locations,
            selectedBudget.transport,
            selectedBudget.catering
        ];
        
        // Force a redraw of the chart
        charts["chart1"].update();
        console.log('Budget updated:', {
            actualSpend: ACTUAL_SPEND,
            newBudget: selectedBudget
        });
    } else {
        console.error('Chart1 not found in charts object');
    }
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
const q1BudgetArray = [
    budgetData.q1.equipment,
    budgetData.q1.props,
    budgetData.q1.locations,
    budgetData.q1.transport,
    budgetData.q1.catering
];

// Create the initial chart with constant actual spend data
createChart("chart1", {
    type: "bar",
    data: {
        labels: ["Equipment", "Props", "Locations", "Transport", "Catering"],
        datasets: [
            {
                label: "Budget Available",
                data: q1BudgetArray,
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
createChart("chart3", {
    type: "line",
    data: {
        labels: getLast7Days(),
        datasets: [
            {
                label: "Crew Logs",
                data: [35, 42, 28, 45, 38, 41, 33],
                backgroundColor: "rgba(50, 184, 205, 0.2)",
                borderColor: "#32B8CD",
                borderWidth: 2,
                cubicInterpolationMode: 'monotone',
                fill: true
            },
            {
                label: "Driver Logs",
                data: [22, 28, 18, 30, 25, 27, 20],
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
                text: "Crew and Driver Logs",
                color: "#161616",
                font: {
                    size: 16
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
                    padding: 10
                },
                suggestedMax: 50
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
createChart("chart4", {
    type: "radar",
    data: {
        labels: getLast7Days().slice(2),
        datasets: [
            {
                label: "Processed Invoices",
                data: [8, 10, 6, 9, 7],
                backgroundColor: "rgba(50, 184, 205, 0.2)",
                borderColor: "#32B8CD",
                borderWidth: 2,
                pointBackgroundColor: "#32B8CD",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#32B8CD"
            },
            {
                label: "Pending Invoices",
                data: [3, 2, 1, 3, 2],
                backgroundColor: "rgba(112, 112, 112, 0.2)",
                borderColor: "#707070",
                borderWidth: 2,
                pointBackgroundColor: "#707070",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#707070"
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
            legend: {
                labels: {
                    color: "#161616"
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: "rgba(112, 112, 112, 0.2)",
                    lineWidth: 1
                },
                grid: {
                    color: "rgba(112, 112, 112, 0.2)",
                    circular: true
                },
                pointLabels: {
                    color: "#161616",
                    font: {
                        size: 12
                    },
                    padding: 10
                },
                ticks: {
                    color: "#161616",
                    backdropColor: "transparent",
                    stepSize: 5,
                    padding: 10,
                    font: {
                        size: 12
                    }
                },
                suggestedMin: 0,
                suggestedMax: 15
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
