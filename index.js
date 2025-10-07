document.addEventListener('DOMContentLoaded', () => {
    // Check if the required elements for the mockup exist
    const currentPriceElement = document.getElementById('current-price');
    if (!currentPriceElement) return; // Exit if not on the hero section

    const callButton = document.getElementById('call-button');
    const putButton = document.getElementById('put-button');
    const resultsLog = document.getElementById('results-log');
    const investmentInput = document.getElementById('investment-amount');
    const chartContainer = document.getElementById('chart-container');
    
    let basePrice = 1.09540;
    
    // --- 1. SIMULATE REAL-TIME PRICE UPDATES ---
    function updatePrice() {
        // Simulate a small, random change in the price
        const change = (Math.random() - 0.5) * 0.0001;
        basePrice = basePrice + change;
        
        // Ensure price is formatted to 5 decimal places
        const newPrice = basePrice.toFixed(5);
        currentPriceElement.textContent = newPrice;

        // Change color based on price movement
        if (change > 0) {
            currentPriceElement.style.color = '#4CAF50'; // Green
        } else if (change < 0) {
            currentPriceElement.style.color = '#F44336'; // Red
        } else {
             currentPriceElement.style.color = '#f0f0f0'; // White/Neutral
        }

        // --- CHART VISUALIZATION SIMULATION ---
        // Scale the price change to a pixel value for chart visualization
        // Assuming a range of 1.09500 +/- 0.00050 to fit the chart area
        const priceRange = 0.00100; // Total assumed price movement range
        const priceOffset = basePrice - (1.09540 - priceRange/2); 
        const chartHeight = chartContainer.clientHeight;
        
        // Normalize Y position (0% to 100%)
        let normalizedY = (priceOffset / priceRange) * chartHeight;
        
        // Clamp Y to stay within chart boundaries
        normalizedY = Math.min(Math.max(normalizedY, 5), chartHeight - 5);
        
        // Create a new data point (dot)
        const dot = document.createElement('div');
        dot.className = 'price-dot';
        dot.style.cssText = `
            position: absolute; 
            right: 0px; 
            top: ${chartHeight - normalizedY}px; 
            width: 5px; 
            height: 5px; 
            border-radius: 50%; 
            background-color: ${currentPriceElement.style.color};
            z-index: 50;
        `;
        chartContainer.appendChild(dot);

        // Move all existing dots one step to the left
        const step = 2; // pixel step for movement
        Array.from(chartContainer.children).forEach(child => {
            if (child.classList.contains('price-dot')) {
                let currentRight = parseFloat(child.style.right) || 0;
                child.style.right = (currentRight + step) + 'px';
                
                // Remove dots that have moved off the screen
                if (currentRight + step > chartContainer.clientWidth) {
                    chartContainer.removeChild(child);
                }
            }
        });
    }

    // Update price every 200 milliseconds
    setInterval(updatePrice, 200);

    // --- 2. TRADE EXECUTION SIMULATION ---
    function executeTrade(type) {
        const amount = parseFloat(investmentInput.value);
        const entryPrice = basePrice;
        const durationSeconds = parseInt(document.getElementById('expiry-time').value);
        
        if (isNaN(amount) || amount < 10) {
            alert("Please enter a valid investment amount (min $10).");
            return;
        }

        // Log the entry price and type
        logResult(`✅ Trade placed: ${type} at ${entryPrice.toFixed(5)} for $${amount}. Waiting ${durationSeconds}s...`);

        // Draw a line on the chart to show the entry price
        const chartHeight = chartContainer.clientHeight;
        const priceRange = 0.00100;
        const priceOffset = entryPrice - (1.09540 - priceRange/2); 
        let normalizedY = (priceOffset / priceRange) * chartHeight;
        normalizedY = Math.min(Math.max(normalizedY, 5), chartHeight - 5);
        
        const entryLine = document.createElement('div');
        entryLine.className = 'entry-line';
        entryLine.style.top = `${chartHeight - normalizedY}px`;
        chartContainer.appendChild(entryLine);
        
        // Set up the expiration timer
        setTimeout(() => {
            const exitPrice = basePrice;
            let resultMessage = "";
            let isWin = false;
            
            // Check win/loss condition
            if (type === 'CALL' && exitPrice > entryPrice) {
                isWin = true;
            } else if (type === 'PUT' && exitPrice < entryPrice) {
                isWin = true;
            }

            // Calculate profit/loss
            if (isWin) {
                const profit = amount * 0.85; 
                resultMessage = `<span style="color:#4CAF50;">🎉 WIN! Profit: $${profit.toFixed(2)}</span> (Exit: ${exitPrice.toFixed(5)})`;
            } else {
                const loss = amount;
                resultMessage = `<span style="color:#F44336;">❌ LOSS! -$${loss.toFixed(2)}</span> (Exit: ${exitPrice.toFixed(5)})`;
            }

            // Log the final result
            logResult(resultMessage);
            
            // Remove the entry line after the trade is complete
            if (chartContainer.contains(entryLine)) {
                 chartContainer.removeChild(entryLine);
            }

        }, durationSeconds * 1000); // Convert seconds to milliseconds
    }

    // --- 3. EVENT LISTENERS ---
    callButton.addEventListener('click', () => executeTrade('CALL'));
    putButton.addEventListener('click', () => executeTrade('PUT'));

    // --- 4. LOGGING UTILITY ---
    function logResult(message) {
        const p = document.createElement('p');
        p.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        resultsLog.prepend(p);
        
        // Keep the log clean
        while (resultsLog.children.length > 10) {
            resultsLog.removeChild(resultsLog.lastChild);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (Keep existing chart and trading logic) ...

    // --- RESPONSIVE NAVIGATION LOGIC (New) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksMenu = document.getElementById('nav-links-menu');

    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            // Toggles the 'active' class on the menu container
            navLinksMenu.classList.toggle('active');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (Keep existing chart, trading, and navigation logic) ...

    // -------------------------------------------
    // TESTIMONIAL CAROUSEL LOGIC (New)
    // -------------------------------------------
    const wrapper = document.getElementById('testimonials-wrapper');
    const dotsContainer = document.getElementById('carousel-dots');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (wrapper && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        const slideDuration = 6000; // Time each slide is visible (6 seconds)

        // Function to update the view
        function updateCarousel() {
            // Calculate the required horizontal shift
            const offset = -currentIndex * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            
            // Update active dot
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
            });
        }
        
        // Function for auto-sliding
        function autoSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        // Start the automatic rotation
        setInterval(autoSlide, slideDuration);
        
        // Optional: Add event listeners to dots for manual navigation
        if (dotsContainer) {
            dotsContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('dot')) {
                    const slideIndex = parseInt(event.target.dataset.slide);
                    if (!isNaN(slideIndex)) {
                        currentIndex = slideIndex;
                        updateCarousel();
                    }
                }
            });
        }
    }
});