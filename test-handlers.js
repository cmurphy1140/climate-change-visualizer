// Test Event Handlers for E2E Tests

document.addEventListener('DOMContentLoaded', () => {
    
    // Carbon Calculator Handler
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const electricity = parseFloat(document.getElementById('electricity').value) || 0;
            const milesDriven = parseFloat(document.getElementById('milesDriven').value) || 0;
            const gasUsage = parseFloat(document.getElementById('gasUsage').value) || 0;
            const flights = parseFloat(document.getElementById('flights').value) || 0;
            
            const resultPanel = document.getElementById('carbonResult');
            const errorMsg = resultPanel.querySelector('.error-message');
            
            // Validation
            if (electricity < 0 || milesDriven < 0 || gasUsage < 0 || flights < 0) {
                errorMsg.textContent = 'Please enter positive numbers only';
                errorMsg.style.display = 'block';
                resultPanel.style.display = 'block';
                return;
            }
            
            // Calculate carbon footprint (simplified formula)
            const electricityCarbon = electricity * 0.92 * 12 / 2000; // tons CO2/year
            const drivingCarbon = milesDriven * 12 * 0.411 / 1000; // tons CO2/year
            const gasCarbon = gasUsage * 12 * 0.0053; // tons CO2/year
            const flightCarbon = flights * 0.9; // tons CO2/year
            
            const totalCarbon = electricityCarbon + drivingCarbon + gasCarbon + flightCarbon;
            
            resultPanel.querySelector('.result-value').textContent = 
                `${totalCarbon.toFixed(2)} tons CO2/year`;
            errorMsg.style.display = 'none';
            resultPanel.style.display = 'block';
        });
    }
    
    // Export Handlers
    const exportCSV = document.getElementById('exportCSV');
    if (exportCSV) {
        exportCSV.addEventListener('click', () => {
            const csvContent = "Date,Temperature,SeaLevel,Emissions\n" +
                "2020,1.2,3.3,36.4\n" +
                "2021,1.3,3.4,36.8\n" +
                "2022,1.4,3.5,37.1\n" +
                "2023,1.5,3.6,37.5";
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'climate-data.csv';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    
    const exportPNG = document.getElementById('exportPNG');
    if (exportPNG) {
        exportPNG.addEventListener('click', () => {
            // Find the first visible canvas
            const canvas = document.querySelector('.visualization-section.active canvas');
            if (canvas) {
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'climate-chart.png';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            }
        });
    }
    
    // Comparison Handler
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            const regionA = document.getElementById('regionA').value;
            const regionB = document.getElementById('regionB').value;
            const comparisonChart = document.querySelector('.comparison-chart');
            
            if (comparisonChart) {
                comparisonChart.style.display = 'block';
                
                // Create or update chart
                const canvas = document.getElementById('comparisonChart');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    // Simple placeholder visualization
                    ctx.fillStyle = 'rgba(10, 132, 255, 0.5)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#f2f2f7';
                    ctx.font = '16px -apple-system';
                    ctx.fillText(`Comparing ${regionA} vs ${regionB}`, 20, 30);
                }
            }
        });
    }
    
    // Globe Controls
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    let isPlaying = false;
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            isPlaying = true;
            console.log('Globe rotation started');
        });
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            isPlaying = false;
            console.log('Globe rotation paused');
        });
    }
    
    // Year slider labels update
    const yearStart = document.getElementById('yearStart');
    const yearEnd = document.getElementById('yearEnd');
    const yearStartLabel = document.getElementById('yearStartLabel');
    const yearEndLabel = document.getElementById('yearEndLabel');
    
    if (yearStart && yearStartLabel) {
        yearStart.addEventListener('input', (e) => {
            yearStartLabel.textContent = e.target.value;
        });
    }
    
    if (yearEnd && yearEndLabel) {
        yearEnd.addEventListener('input', (e) => {
            yearEndLabel.textContent = e.target.value;
        });
    }
});