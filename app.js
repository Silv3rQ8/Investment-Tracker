// ============= STATE MANAGEMENT =============
let state = {
    groups: [],
    currentGroupId: null
};

// ============= INITIALIZATION =============
function init() {
    loadFromStorage();
    renderGroupSelect();
    if (state.groups.length > 0) {
        state.currentGroupId = state.groups[0].id;
        switchGroup();
    } else {
        showEmptyState();
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}

// ============= STORAGE FUNCTIONS =============
function saveToStorage() {
    localStorage.setItem('investmentTrackerData', JSON.stringify(state));
}

function loadFromStorage() {
    const saved = localStorage.getItem('investmentTrackerData');
    if (saved) {
        state = JSON.parse(saved);
    }
}

// ============= GROUP MANAGEMENT =============
function showCreateGroupModal() {
    document.getElementById('groupModal').classList.remove('hidden');
    document.getElementById('groupNameInput').focus();
}

function closeGroupModal() {
    document.getElementById('groupModal').classList.add('hidden');
    document.getElementById('groupNameInput').value = '';
}

function createGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    
    if (!name) {
        alert('Please enter a group name');
        return;
    }

    const group = {
        id: Date.now().toString(),
        name: name,
        contributions: [],
        createdAt: new Date().toISOString()
    };

    state.groups.push(group);
    state.currentGroupId = group.id;
    saveToStorage();
    renderGroupSelect();
    switchGroup();
    closeGroupModal();
}

function deleteCurrentGroup() {
    if (!state.currentGroupId) return;
    
    if (!confirm('Delete this investment group? This cannot be undone.')) {
        return;
    }

    state.groups = state.groups.filter(g => g.id !== state.currentGroupId);
    state.currentGroupId = null;
    saveToStorage();
    renderGroupSelect();
    showEmptyState();
}

function switchGroup() {
    const select = document.getElementById('groupSelect');
    state.currentGroupId = select.value || null;
    
    if (state.currentGroupId) {
        renderMainContent();
    } else {
        showEmptyState();
    }
}

function renderGroupSelect() {
    const select = document.getElementById('groupSelect');
    select.innerHTML = '<option value="">Select a group...</option>';
    
    state.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        select.appendChild(option);
    });
}

function showEmptyState() {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('deleteGroupBtn').style.display = 'none';
}

function hideEmptyState() {
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('deleteGroupBtn').style.display = 'inline-block';
}

function getCurrentGroup() {
    return state.groups.find(g => g.id === state.currentGroupId);
}

// ============= CONTRIBUTION MANAGEMENT =============
function addContribution() {
    const name = document.getElementById('nameInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);

    if (!name) {
        alert('Please enter a name');
        return;
    }

    if (isNaN(amount)) {
        alert('Please enter a valid amount (positive for deposit, negative for withdrawal)');
        return;
    }

    const group = getCurrentGroup();
    if (!group) return;

    group.contributions.push({
        id: Date.now().toString(),
        name: name,
        amount: amount,
        date: new Date().toISOString(),
        timestamp: Date.now()
    });

    document.getElementById('nameInput').value = '';
    document.getElementById('amountInput').value = '';
    
    saveToStorage();
    renderMainContent();
}

// ============= CALCULATIONS =============
function getContributionsSummary() {
    const group = getCurrentGroup();
    if (!group || group.contributions.length === 0) {
        return {};
    }

    const summary = {};
    let totalAmount = 0;

    group.contributions.forEach(contrib => {
        if (!summary[contrib.name]) {
            summary[contrib.name] = {
                name: contrib.name,
                total: 0,
                count: 0,
                transactions: []
            };
        }
        summary[contrib.name].total += contrib.amount;
        summary[contrib.name].count += 1;
        summary[contrib.name].transactions.push(contrib);
        totalAmount += contrib.amount;
    });

    // Add percentage
    Object.keys(summary).forEach(name => {
        summary[name].percentage = (summary[name].total / totalAmount) * 100;
    });

    return { summary, totalAmount };
}

function getTotalContributions() {
    const group = getCurrentGroup();
    if (!group) return 0;
    return group.contributions.reduce((sum, c) => sum + c.amount, 0);
}

// ============= TAB MANAGEMENT =============
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// ============= RENDERING =============
function populateNameDatalist() {
    const group = getCurrentGroup();
    if (!group) return;

    const existingNames = new Set();
    group.contributions.forEach(contrib => {
        existingNames.add(contrib.name);
    });

    const datalist = document.getElementById('existingNames');
    datalist.innerHTML = '';

    Array.from(existingNames).sort().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

function renderMainContent() {
    hideEmptyState();
    const group = getCurrentGroup();
    if (!group) return;

    // Update header
    document.getElementById('groupTitle').textContent = group.name;
    const data = getContributionsSummary();
    const summary = data.summary || {};
    const totalAmount = data.totalAmount || 0;
    const peopleCount = Object.keys(summary).length;
    
    document.getElementById('groupStats').innerHTML = 
        `Total Investment: <strong>د.ك ${totalAmount.toFixed(2)}</strong> | Contributors: <strong>${peopleCount}</strong> people`;

    // Populate name dropdown
    populateNameDatalist();

    // Render contributions
    renderContributionsSummary();
    renderHistory();
}

function renderContributionsSummary() {
    const { summary, totalAmount } = getContributionsSummary();
    const container = document.getElementById('contributionsSummary');

    if (!summary || Object.keys(summary).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No contributions yet</p>';
        return;
    }

    const cards = Object.values(summary).map(person => {
        const isNegative = person.total < 0;
        const totalClass = isNegative ? 'negative-balance' : '';
        
        return `
            <div class="person-card ${isNegative ? 'negative' : ''}">
                <h4>${escapeHtml(person.name)}</h4>
                <div class="person-stats">
                    <div class="stat">
                        <div class="stat-label">Total</div>
                        <div class="stat-value ${totalClass}">د.ك ${person.total.toFixed(2)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Percentage</div>
                        <div class="stat-value">${person.percentage.toFixed(1)}%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Payments</div>
                        <div class="stat-value">${person.count}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = cards;
}

function renderHistory() {
    const group = getCurrentGroup();
    if (!group || group.contributions.length === 0) {
        document.getElementById('historyList').innerHTML = '<p style="text-align: center; color: #999;">No transaction history</p>';
        return;
    }

    // Sort by date (newest first)
    const sorted = [...group.contributions].sort((a, b) => b.timestamp - a.timestamp);

    const historyHTML = sorted.map(contrib => {
        const date = new Date(contrib.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const isWithdrawal = contrib.amount < 0;
        const amountClass = isWithdrawal ? 'withdrawal' : 'deposit';
        const amountPrefix = isWithdrawal ? '-' : '+';
        const amountText = `${amountPrefix} د.ك ${Math.abs(contrib.amount).toFixed(2)}`;
        const transactionType = isWithdrawal ? 'Withdrawal' : 'Deposit';

        return `
            <div class="history-item ${amountClass}">
                <div class="history-item-info">
                    <div class="history-item-name">${escapeHtml(contrib.name)} <span class="transaction-type">(${transactionType})</span></div>
                    <div class="history-item-date">${date}</div>
                </div>
                <div class="history-item-amount">${amountText}</div>
            </div>
        `;
    }).join('');

    document.getElementById('historyList').innerHTML = historyHTML;
}

// ============= RETURNS CALCULATION =============
function calculateReturns() {
    const totalNow = parseFloat(document.getElementById('totalReturnInput').value);

    if (isNaN(totalNow) || totalNow < 0) {
        alert('Please enter a valid amount');
        return;
    }

    const { summary, totalAmount } = getContributionsSummary();
    
    if (totalAmount === 0) {
        alert('No contributions to calculate returns');
        return;
    }

    if (totalNow < totalAmount) {
        alert('Total now must be greater than or equal to initial investment');
        return;
    }

    const breakdown = document.getElementById('returnsBreakdown');
    const detailsDiv = document.getElementById('returnsDetails');
    const gainedAmount = totalNow - totalAmount;

    // Calculate distribution
    const distribution = Object.values(summary).map(person => {
        const share = (person.total / totalAmount) * 100;
        const personReturn = (share / 100) * totalNow;
        const personProfit = personReturn - person.total;
        
        return {
            name: person.name,
            initialInvestment: person.total,
            share: share,
            totalReturn: personReturn,
            profit: personProfit
        };
    });

    // Generate HTML
    const cardsHTML = distribution.map(d => {
        return `
            <div class="return-card">
                <h4>💰 ${escapeHtml(d.name)}</h4>
                <div class="return-detail">
                    <label>Initial Investment</label>
                    <div class="value">د.ك ${d.initialInvestment.toFixed(2)}</div>
                </div>
                <div class="return-detail">
                    <label>Share (%)</label>
                    <div class="value">${d.share.toFixed(2)}%</div>
                </div>
                <div class="return-detail">
                    <label>Profit Gained</label>
                    <div class="value">د.ك ${d.profit.toFixed(2)}</div>
                </div>
                <div class="return-detail" style="background: #e8f8f5; padding: 10px; margin: -5px -5px -5px -5px; border-radius: 8px; border: none; padding: 10px;">
                    <label>Total to Receive</label>
                    <div class="value" style="font-size: 22px;">د.ك ${d.totalReturn.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');

    const summaryHTML = `
        <div style="background: linear-gradient(135deg, #e8f8f5 0%, #f0fdf4 100%); padding: 20px; border-radius: 12px; border: 2px solid #27ae60; margin-bottom: 20px;">
            <h4 style="color: #27ae60; margin-bottom: 15px;">📊 Summary</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                <div>
                    <strong>Initial Total:</strong><br>
                    <span style="font-size: 18px; color: #27ae60;">د.ك ${totalAmount.toFixed(2)}</span>
                </div>
                <div>
                    <strong>Total Gained:</strong><br>
                    <span style="font-size: 18px; color: #27ae60;">د.ك ${gainedAmount.toFixed(2)}</span>
                </div>
                <div>
                    <strong>Total Distribution:</strong><br>
                    <span style="font-size: 18px; color: #27ae60;">د.ك ${totalNow.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;

    detailsDiv.innerHTML = summaryHTML + '<div class="returns-breakdown">' + cardsHTML + '</div>';
    breakdown.style.display = 'block';
}

// ============= EXPORT FUNCTIONS =============
function exportAsJSON() {
    const group = getCurrentGroup();
    if (!group) return;

    const { summary, totalAmount } = getContributionsSummary();

    const exportData = {
        groupName: group.name,
        exportedAt: new Date().toISOString(),
        totalInvestment: totalAmount,
        contributors: Object.values(summary).map(p => ({
            name: p.name,
            totalContribution: p.total,
            percentage: p.percentage,
            paymentCount: p.count
        })),
        transactions: group.contributions.sort((a, b) => b.timestamp - a.timestamp)
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    downloadFile(dataStr, `${group.name}-investment.json`, 'application/json');
}

function exportAsCSV() {
    const group = getCurrentGroup();
    if (!group) return;

    const { summary, totalAmount } = getContributionsSummary();

    let csv = `Investment Tracker Report\n`;
    csv += `Group: ${group.name}\n`;
    csv += `Exported: ${new Date().toLocaleString()}\n`;
    csv += `\n`;
    csv += `Contributors Summary\n`;
    csv += `Name,Total Contribution,Percentage,Payment Count\n`;
    
    Object.values(summary).forEach(p => {
        csv += `${p.name},د.ك ${p.total.toFixed(2)},${p.percentage.toFixed(2)}%,${p.count}\n`;
    });

    csv += `\n`;
    csv += `Transaction History\n`;
    csv += `Date,Name,Amount\n`;
    
    group.contributions
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(c => {
            const date = new Date(c.date).toLocaleDateString();
            csv += `${date},${c.name},د.ك ${c.amount.toFixed(2)}\n`;
        });

    downloadFile(csv, `${group.name}-investment.csv`, 'text/csv');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// ============= UTILITY FUNCTIONS =============
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============= ENTRY POINT =============
document.addEventListener('DOMContentLoaded', () => {
    init();
});
