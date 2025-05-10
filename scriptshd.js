document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    const roomItems = document.querySelectorAll('.room-list li');
    const categoryItems = document.querySelectorAll('.category-list li');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const currentRoomBadge = document.getElementById('current-room');
    const tabTriggerButtons = document.querySelectorAll('[data-tab-trigger]');

    // State
    let devices = null;
    let currentRoom = 'all';
    let isLoading = true;

    // Initialize
    init();

    // Functions
    function init() {
        setupEventListeners();
        fetchDevices();
    }

    function setupEventListeners() {
        // Sidebar toggle
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);

        // Room selection
        roomItems.forEach(item => {
            item.addEventListener('click', () => {
                const room = item.getAttribute('data-room');
                setActiveRoom(room);
            });
        });

        // Category selection
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                setActiveTab(category);
            });
        });

        // Tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                setActiveTab(tab);
            });
        });

        // Tab trigger buttons
        tabTriggerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab-trigger');
                setActiveTab(tab);
            });
        });
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }

    function toggleMobileSidebar() {
        sidebar.classList.toggle('mobile-open');
    }

    function setActiveRoom(room) {
        currentRoom = room;
        
        // Update UI
        roomItems.forEach(item => {
            if (item.getAttribute('data-room') === room) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        currentRoomBadge.textContent = room === 'all' ? 'All Rooms' : 
            room.charAt(0).toUpperCase() + room.slice(1);

        // Refresh device displays
        renderDevices();

        // Close mobile sidebar after selection
        sidebar.classList.remove('mobile-open');
    }

    function setActiveTab(tab) {
        // Update tab buttons
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tab) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update tab panes
        tabPanes.forEach(pane => {
            if (pane.id === tab) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        // Close mobile sidebar after selection
        sidebar.classList.remove('mobile-open');
    }

    async function fetchDevices() {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulated API response
            devices = {
                lights: [
                    { id: 'light-1', name: 'Living Room', state: true, brightness: 80, room: 'living' },
                    { id: 'light-2', name: 'Kitchen', state: false, brightness: 60, room: 'kitchen' },
                    { id: 'light-3', name: 'Bedroom', state: true, brightness: 40, room: 'bedroom' },
                    { id: 'light-4', name: 'Bathroom', state: false, brightness: 70, room: 'bathroom' },
                ],
                thermostats: [
                    { id: 'therm-1', name: 'Living Room', state: true, temperature: 72, mode: 'heat', room: 'living' },
                    { id: 'therm-2', name: 'Bedroom', state: true, temperature: 68, mode: 'cool', room: 'bedroom' },
                ],
                cameras: [
                    { id: 'cam-1', name: 'Front Door', state: true, recording: false, room: 'exterior' },
                    { id: 'cam-2', name: 'Back Yard', state: true, recording: true, room: 'exterior' },
                    { id: 'cam-3', name: 'Garage', state: false, recording: false, room: 'garage' },
                ],
                security: [
                    { id: 'sec-1', name: 'Alarm System', state: true, armed: true },
                    { id: 'sec-2', name: 'Door Locks', state: true, locked: true },
                    { id: 'sec-3', name: 'Motion Sensors', state: true, triggered: false },
                ],
            };

            isLoading = false;
            renderDevices();
        } catch (error) {
            console.error('Failed to fetch devices:', error);
            showToast('Error', 'Failed to load your devices. Please try again.', 'error');
            isLoading = false;
        }
    }

    function renderDevices() {
        if (isLoading) return;

        // Render overview cards
        renderOverviewCards();

        // Render detailed device cards
        renderLights();
        renderThermostats();
        renderSecurity();
        renderCameras();
    }

    function renderOverviewCards() {
        // Lights overview
        const lightsOverviewStatus = document.getElementById('lights-overview-status');
        const lightsOverviewContent = document.getElementById('lights-overview-content');
        
        const filteredLights = filterDevicesByRoom(devices.lights, currentRoom);
        const activeLights = filteredLights.filter(light => light.state).length;
        
        lightsOverviewStatus.textContent = `${activeLights} of ${filteredLights.length} active`;
        
        lightsOverviewContent.innerHTML = '';
        filteredLights.slice(0, 2).forEach(light => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            deviceItem.innerHTML = `
                <div class="device-info">
                    <div class="device-status ${light.state ? 'on' : ''}"></div>
                    <span class="device-name">${light.name}</span>
                </div>
                <label class="switch">
                    <input type="checkbox" ${light.state ? 'checked' : ''} data-device-id="${light.id}" data-device-type="lights">
                    <span class="slider-switch"></span>
                </label>
            `;
            lightsOverviewContent.appendChild(deviceItem);
        });

        // Climate overview
        const climateOverviewStatus = document.getElementById('climate-overview-status');
        const climateOverviewContent = document.getElementById('climate-overview-content');
        
        const filteredThermostats = filterDevicesByRoom(devices.thermostats, currentRoom);
        const activeThermostats = filteredThermostats.filter(therm => therm.state).length;
        
        climateOverviewStatus.textContent = `${activeThermostats} of ${filteredThermostats.length} active`;
        
        climateOverviewContent.innerHTML = '';
        filteredThermostats.slice(0, 2).forEach(thermostat => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            deviceItem.innerHTML = `
                <div class="device-info">
                    <div class="device-status ${thermostat.state ? 'on' : ''}"></div>
                    <div>
                        <span class="device-name">${thermostat.name}</span>
                        <div class="device-meta">${thermostat.temperature}°F • ${thermostat.mode === 'heat' ? 'Heating' : 'Cooling'}</div>
                    </div>
                </div>
                <label class="switch">
                    <input type="checkbox" ${thermostat.state ? 'checked' : ''} data-device-id="${thermostat.id}" data-device-type="thermostats">
                    <span class="slider-switch"></span>
                </label>
            `;
            climateOverviewContent.appendChild(deviceItem);
        });

        // Security overview
        const securityOverviewStatus = document.getElementById('security-overview-status');
        const securityOverviewContent = document.getElementById('security-overview-content');
        
        const activeSecurity = devices.security.filter(sec => sec.state).length;
        
        securityOverviewStatus.textContent = `${activeSecurity} of ${devices.security.length} active`;
        
        securityOverviewContent.innerHTML = '';
        devices.security.slice(0, 2).forEach(security => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            deviceItem.innerHTML = `
                <div class="device-info">
                    <div class="device-status ${security.state ? 'on' : ''}"></div>
                    <div>
                        <span class="device-name">${security.name}</span>
                        ${security.id === 'sec-1' ? 
                            `<div class="device-meta">${security.armed ? 'Armed' : 'Disarmed'}</div>` : ''}
                        ${security.id === 'sec-2' ? 
                            `<div class="device-meta">${security.locked ? 'Locked' : 'Unlocked'}</div>` : ''}
                    </div>
                </div>
                <label class="switch">
                    <input type="checkbox" ${security.state ? 'checked' : ''} data-device-id="${security.id}" data-device-type="security">
                    <span class="slider-switch"></span>
                </label>
            `;
            securityOverviewContent.appendChild(deviceItem);
        });

        // Add event listeners to toggle switches
        document.querySelectorAll('.switch input').forEach(toggle => {
            toggle.addEventListener('change', handleDeviceToggle);
        });
    }

    function renderLights() {
        const lightsGrid = document.getElementById('lights-grid');
        const filteredLights = filterDevicesByRoom(devices.lights, currentRoom);
        
        lightsGrid.innerHTML = '';
        
        filteredLights.forEach(light => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="flex-between">
                        <h2>${light.name}</h2>
                        <label class="switch">
                            <input type="checkbox" ${light.state ? 'checked' : ''} data-device-id="${light.id}" data-device-type="lights">
                            <span class="slider-switch"></span>
                        </label>
                    </div>
                    <p class="card-description">${light.state ? 'On' : 'Off'} • Brightness: ${light.brightness}%</p>
                </div>
                <div class="card-content">
                    <div class="light-display ${light.state ? 'on' : 'off'}" style="${light.state ? `background-color: hsl(48, ${light.brightness}%, ${Math.min(50 + light.brightness/2, 90)}%);` : ''}">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="slider-container">
                        <div class="slider-header">
                            <span>Brightness</span>
                            <span>${light.brightness}%</span>
                        </div>
                        <input type="range" min="1" max="100" value="${light.brightness}" class="slider" 
                            ${!light.state ? 'disabled' : ''} 
                            data-device-id="${light.id}" 
                            data-control-type="brightness">
                    </div>
                </div>
            `;
            lightsGrid.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('#lights-grid .switch input').forEach(toggle => {
            toggle.addEventListener('change', handleDeviceToggle);
        });

        document.querySelectorAll('#lights-grid input[type="range"]').forEach(slider => {
            slider.addEventListener('input', handleBrightnessChange);
            slider.addEventListener('change', () => {
                // When slider is released, show toast
                const deviceId = slider.getAttribute('data-device-id');
                const light = devices.lights.find(l => l.id === deviceId);
                if (light) {
                    showToast('Brightness Updated', `${light.name} brightness set to ${light.brightness}%`, 'success');
                }
            });
        });
    }

    function renderThermostats() {
        const climateGrid = document.getElementById('climate-grid');
        const filteredThermostats = filterDevicesByRoom(devices.thermostats, currentRoom);
        
        climateGrid.innerHTML = '';
        
        filteredThermostats.forEach(thermostat => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="flex-between">
                        <h2>${thermostat.name}</h2>
                        <label class="switch">
                            <input type="checkbox" ${thermostat.state ? 'checked' : ''} data-device-id="${thermostat.id}" data-device-type="thermostats">
                            <span class="slider-switch"></span>
                        </label>
                    </div>
                    <p class="card-description">${thermostat.state ? 'On' : 'Off'} • Mode: ${thermostat.mode === 'heat' ? 'Heating' : 'Cooling'}</p>
                </div>
                <div class="card-content">
                    <div class="thermostat-display">
                        <div class="thermostat-circle ${thermostat.state ? thermostat.mode : 'off'}">
                            <div class="thermostat-temp">${thermostat.temperature}°</div>
                            <div class="thermostat-label">Target</div>
                        </div>
                    </div>
                    <div class="slider-container">
                        <div class="slider-header">
                            <span>Temperature</span>
                            <span>${thermostat.temperature}°F</span>
                        </div>
                        <input type="range" min="60" max="85" value="${thermostat.temperature}" class="slider" 
                            ${!thermostat.state ? 'disabled' : ''} 
                            data-device-id="${thermostat.id}" 
                            data-control-type="temperature">
                        <div class="slider-header">
                            <span>60°F</span>
                            <span>85°F</span>
                        </div>
                    </div>
                    <div class="mode-buttons">
                        <button class="btn ${thermostat.mode === 'heat' ? 'btn-primary' : 'btn-outline'}" 
                            ${!thermostat.state ? 'disabled' : ''} 
                            data-device-id="${thermostat.id}" 
                            data-mode="heat">Heat</button>
                        <button class="btn ${thermostat.mode === 'cool' ? 'btn-primary' : 'btn-outline'}" 
                            ${!thermostat.state ? 'disabled' : ''} 
                            data-device-id="${thermostat.id}" 
                            data-mode="cool">Cool</button>
                    </div>
                </div>
            `;
            climateGrid.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('#climate-grid .switch input').forEach(toggle => {
            toggle.addEventListener('change', handleDeviceToggle);
        });

        document.querySelectorAll('#climate-grid input[type="range"]').forEach(slider => {
            slider.addEventListener('input', handleTemperatureChange);
            slider.addEventListener('change', () => {
                // When slider is released, show toast
                const deviceId = slider.getAttribute('data-device-id');
                const thermostat = devices.thermostats.find(t => t.id === deviceId);
                if (thermostat) {
                    showToast('Temperature Updated', `${thermostat.name} temperature set to ${thermostat.temperature}°F`, 'success');
                }
            });
        });

        document.querySelectorAll('#climate-grid button[data-mode]').forEach(button => {
            button.addEventListener('click', handleModeChange);
        });
    }

    function renderSecurity() {
        const securityGrid = document.getElementById('security-grid');
        
        securityGrid.innerHTML = '';
        
        devices.security.forEach(security => {
            const card = document.createElement('div');
            card.className = 'card';
            
            let displayClass = 'on';
            if (!security.state) {
                displayClass = 'off';
            } else if (security.id === 'sec-1' && security.armed) {
                displayClass = 'armed';
            } else if (security.id === 'sec-2' && security.locked) {
                displayClass = 'locked';
            } else if (security.id === 'sec-3' && security.triggered) {
                displayClass = 'alert';
            }
            
            let actionButtons = '';
            if (security.id === 'sec-1') {
                actionButtons = `
                    <div class="btn-group">
                        <button class="btn ${security.armed ? 'btn-primary' : 'btn-outline'}" 
                            ${!security.state ? 'disabled' : ''} 
                            data-device-id="${security.id}" 
                            data-security-action="arm">Armed</button>
                        <button class="btn ${!security.armed ? 'btn-primary' : 'btn-outline'}" 
                            ${!security.state ? 'disabled' : ''} 
                            data-device-id="${security.id}" 
                            data-security-action="disarm">Disarmed</button>
                    </div>
                `;
            } else if (security.id === 'sec-2') {
                actionButtons = `
                    <div class="btn-group">
                        <button class="btn ${security.locked ? 'btn-primary' : 'btn-outline'}" 
                            ${!security.state ? 'disabled' : ''} 
                            data-device-id="${security.id}" 
                            data-security-action="lock">Locked</button>
                        <button class="btn ${!security.locked ? 'btn-primary' : 'btn-outline'}" 
                            ${!security.state ? 'disabled' : ''} 
                            data-device-id="${security.id}" 
                            data-security-action="unlock">Unlocked</button>
                    </div>
                `;
            } else if (security.id === 'sec-3') {
                actionButtons = `
                    <button class="btn btn-outline full-width" 
                        ${!security.state ? 'disabled' : ''} 
                        data-device-id="${security.id}" 
                        data-security-action="${security.triggered ? 'reset' : 'test'}">
                        ${security.triggered ? 'Reset Sensors' : 'Test Sensors'}
                    </button>
                `;
            }
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="flex-between">
                        <h2>${security.name}</h2>
                        <label class="switch">
                            <input type="checkbox" ${security.state ? 'checked' : ''} data-device-id="${security.id}" data-device-type="security">
                            <span class="slider-switch"></span>
                        </label>
                    </div>
                    <p class="card-description">${security.state ? 'Active' : 'Inactive'}</p>
                </div>
                <div class="card-content">
                    <div class="security-display ${displayClass}">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    ${actionButtons}
                </div>
            `;
            securityGrid.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('#security-grid .switch input').forEach(toggle => {
            toggle.addEventListener('change', handleDeviceToggle);
        });

        document.querySelectorAll('#security-grid [data-security-action]').forEach(button => {
            button.addEventListener('click', handleSecurityAction);
        });
    }

    function renderCameras() {
        const camerasGrid = document.getElementById('cameras-grid');
        const filteredCameras = filterDevicesByRoom(devices.cameras, currentRoom);
        
        camerasGrid.innerHTML = '';
        
        filteredCameras.forEach(camera => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="flex-between">
                        <h2>${camera.name}</h2>
                        <label class="switch">
                            <input type="checkbox" ${camera.state ? 'checked' : ''} data-device-id="${camera.id}" data-device-type="cameras">
                            <span class="slider-switch"></span>
                        </label>
                    </div>
                    <p class="card-description">${camera.state ? 'Online' : 'Offline'} • ${camera.recording ? 'Recording' : 'Standby'}</p>
                </div>
                <div class="card-content">
                    <div class="camera-feed ${camera.state ? '' : 'offline'}">
                        ${camera.state ? 
                            `<img src="https://placehold.co/800x450/111827/FFFFFF/png?text=${camera.name}" alt="${camera.name} feed">` : 
                            `<div class="offline-message">Camera Offline</div>`
                        }
                        ${camera.recording && camera.state ? 
                            `<div class="recording-badge">
                                <div class="recording-dot"></div>
                                <span>REC</span>
                            </div>` : ''
                        }
                    </div>
                    <div class="btn-group">
                        <button class="btn ${camera.recording ? 'btn-primary' : 'btn-outline'}" 
                            ${!camera.state ? 'disabled' : ''} 
                            data-device-id="${camera.id}" 
                            data-camera-action="record">Record</button>
                        <button class="btn btn-outline" 
                            ${!camera.state ? 'disabled' : ''} 
                            data-device-id="${camera.id}" 
                            data-camera-action="snapshot">Snapshot</button>
                    </div>
                </div>
            `;
            camerasGrid.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('#cameras-grid .switch input').forEach(toggle => {
            toggle.addEventListener('change', handleDeviceToggle);
        });

        document.querySelectorAll('#cameras-grid [data-camera-action]').forEach(button => {
            button.addEventListener('click', handleCameraAction);
        });
    }

    function filterDevicesByRoom(deviceList, room) {
        if (!deviceList) return [];
        if (room === 'all') return deviceList;
        return deviceList.filter(device => device.room === room);
    }

    // Event Handlers
    async function handleDeviceToggle(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const deviceType = event.target.getAttribute('data-device-type');
        const newState = event.target.checked;
        
        try {
            // Find the device
            const deviceIndex = devices[deviceType].findIndex(d => d.id === deviceId);
            if (deviceIndex === -1) return;
            
            const device = devices[deviceType][deviceIndex];
            const oldState = device.state;
            
            // Optimistically update UI
            device.state = newState;
            renderDevices();
            
            // Simulate API call
            const success = await simulateApiCall(deviceId, 'toggle', newState);
            
            if (success) {
                showToast('Device Updated', `${device.name} turned ${newState ? 'on' : 'off'}`, 'success');
            } else {
                // Revert on failure
                device.state = oldState;
                renderDevices();
                showToast('Error', 'Failed to update device. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Failed to toggle device:', error);
            showToast('Error', 'Failed to update device. Please try again.', 'error');
        }
    }

    async function handleBrightnessChange(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const newBrightness = parseInt(event.target.value);
        
        try {
            // Find the light
            const lightIndex = devices.lights.findIndex(l => l.id === deviceId);
            if (lightIndex === -1) return;
            
            // Update the brightness
            devices.lights[lightIndex].brightness = newBrightness;
            
            // Update UI immediately for smooth slider
            const lightDisplay = event.target.closest('.card-content').querySelector('.light-display');
            if (lightDisplay) {
                lightDisplay.style.backgroundColor = `hsl(48, ${newBrightness}%, ${Math.min(50 + newBrightness/2, 90)}%)`;
            }
            
            const brightnessValue = event.target.previousElementSibling.querySelector('span:last-child');
            if (brightnessValue) {
                brightnessValue.textContent = `${newBrightness}%`;
            }
            
            // We don't show a toast here because it would be too frequent during sliding
            // The toast is shown when the slider is released (in the event listener in renderLights)
            
            // Simulate API call (debounced)
            clearTimeout(this.brightnessTimeout);
            this.brightnessTimeout = setTimeout(async () => {
                await simulateApiCall(deviceId, 'brightness', newBrightness);
            }, 300);
        } catch (error) {
            console.error('Failed to update brightness:', error);
        }
    }

    async function handleTemperatureChange(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const newTemperature = parseInt(event.target.value);
        
        try {
            // Find the thermostat
            const thermostatIndex = devices.thermostats.findIndex(t => t.id === deviceId);
            if (thermostatIndex === -1) return;
            
            // Update the temperature
            devices.thermostats[thermostatIndex].temperature = newTemperature;
            
            // Update UI immediately for smooth slider
            const tempDisplay = event.target.closest('.card-content').querySelector('.thermostat-temp');
            if (tempDisplay) {
                tempDisplay.textContent = `${newTemperature}°`;
            }
            
            const tempValue = event.target.previousElementSibling.querySelector('span:last-child');
            if (tempValue) {
                tempValue.textContent = `${newTemperature}°F`;
            }
            
            // We don't show a toast here because it would be too frequent during sliding
            // The toast is shown when the slider is released (in the event listener in renderThermostats)
            
            // Simulate API call (debounced)
            clearTimeout(this.temperatureTimeout);
            this.temperatureTimeout = setTimeout(async () => {
                await simulateApiCall(deviceId, 'temperature', newTemperature);
            }, 300);
        } catch (error) {
            console.error('Failed to update temperature:', error);
        }
    }

    async function handleModeChange(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const newMode = event.target.getAttribute('data-mode');
        
        try {
            // Find the thermostat
            const thermostatIndex = devices.thermostats.findIndex(t => t.id === deviceId);
            if (thermostatIndex === -1) return;
            
            const thermostat = devices.thermostats[thermostatIndex];
            const oldMode = thermostat.mode;
            
            // Don't do anything if the mode is already set
            if (oldMode === newMode) return;
            
            // Update the mode
            thermostat.mode = newMode;
            
            // Update UI
            renderThermostats();
            
            // Simulate API call
            const success = await simulateApiCall(deviceId, 'mode', newMode);
            
            if (success) {
                showToast('Mode Updated', `${thermostat.name} mode set to ${newMode === 'heat' ? 'Heating' : 'Cooling'}`, 'success');
            } else {
                // Revert on failure
                thermostat.mode = oldMode;
                renderThermostats();
                showToast('Error', 'Failed to update mode. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Failed to update mode:', error);
            showToast('Error', 'Failed to update mode. Please try again.', 'error');
        }
    }

    async function handleSecurityAction(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const action = event.target.getAttribute('data-security-action');
        
        try {
            // Find the security device
            const securityIndex = devices.security.findIndex(s => s.id === deviceId);
            if (securityIndex === -1) return;
            
            const security = devices.security[securityIndex];
            
            // Handle different actions
            if (action === 'arm') {
                security.armed = true;
                showToast('Security Updated', `${security.name} is now armed`, 'success');
            } else if (action === 'disarm') {
                security.armed = false;
                showToast('Security Updated', `${security.name} is now disarmed`, 'success');
            } else if (action === 'lock') {
                security.locked = true;
                showToast('Security Updated', `${security.name} are now locked`, 'success');
            } else if (action === 'unlock') {
                security.locked = false;
                showToast('Security Updated', `${security.name} are now unlocked`, 'success');
            } else if (action === 'test') {
                security.triggered = true;
                showToast('Security Alert', `${security.name} have been triggered!`, 'error');
            } else if (action === 'reset') {
                security.triggered = false;
                showToast('Security Updated', `${security.name} have been reset`, 'success');
            }
            
            // Update UI
            renderSecurity();
            
            // Simulate API call
            await simulateApiCall(deviceId, action, true);
        } catch (error) {
            console.error('Failed to update security:', error);
            showToast('Error', 'Failed to update security. Please try again.', 'error');
        }
    }

    async function handleCameraAction(event) {
        const deviceId = event.target.getAttribute('data-device-id');
        const action = event.target.getAttribute('data-camera-action');
        
        try {
            // Find the camera
            const cameraIndex = devices.cameras.findIndex(c => c.id === deviceId);
            if (cameraIndex === -1) return;
            
            const camera = devices.cameras[cameraIndex];
            
            if (action === 'record') {
                camera.recording = !camera.recording;
                showToast('Camera Updated', `${camera.name} recording ${camera.recording ? 'started' : 'stopped'}`, 'success');
                renderCameras();
            } else if (action === 'snapshot') {
                showToast('Snapshot Taken', `Snapshot from ${camera.name} saved`, 'success');
            }
            
            // Simulate API call
            await simulateApiCall(deviceId, action, true);
        } catch (error) {
            console.error('Failed to update camera:', error);
            showToast('Error', 'Failed to update camera. Please try again.', 'error');
        }
    }

    // Helper Functions
    async function simulateApiCall(deviceId, action, value) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
        
        // Simulate success (95% of the time)
        return Math.random() > 0.05;
    }

    function showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    // Add flex-between class for flex layouts
    const style = document.createElement('style');
    style.textContent = `
        .flex-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `;
    document.head.appendChild(style);
});