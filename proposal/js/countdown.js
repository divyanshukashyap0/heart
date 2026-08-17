/**
 * A Journey For Mahima - Romantic Live Relationship Countdown
 * Reads relationshipStart from localStorage and updates Years, Months, Days, Hours, Minutes, Seconds every second.
 */

document.addEventListener('DOMContentLoaded', () => {
  const yearsEl = document.getElementById('count-years');
  const monthsEl = document.getElementById('count-months');
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  // Milestone startDate (Reads relationshipStart from localStorage if set upon clicking YES)
  const savedStart = localStorage.getItem('relationshipStart');
  const startDate = savedStart ? new Date(savedStart) : new Date('2023-02-14T00:00:00');

  // Update timestamp display on page
  const timestampEl = document.getElementById('relationship-timestamp');
  if (timestampEl) {
    const formattedStart = startDate.toLocaleString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).replace(' at ', '\n<br/>'); // e.g., "09 August 2026<br/>18:42:17"
    timestampEl.innerHTML = formattedStart;
  }

  function updateCounter() {
    const now = new Date();

    if (now < startDate) {
      if (yearsEl) yearsEl.textContent = '00';
      if (monthsEl) monthsEl.textContent = '00';
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    if (yearsEl) yearsEl.textContent = String(years).padStart(2, '0');
    if (monthsEl) monthsEl.textContent = String(months).padStart(2, '0');
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);
});

