// options.js

const siteInput = document.getElementById('siteInput');
const userAgentInput = document.getElementById('userAgentInput');
const addButton = document.getElementById('addButton');
const userAgentsList = document.getElementById('userAgentsList');

function loadUserAgents() {
  browser.storage.sync.get('userAgents').then(result => {
    const userAgents = result.userAgents || {};
    userAgentsList.innerHTML = '';
    for (const site in userAgents) {
      const item = document.createElement('div');
      item.textContent = `${site}: ${userAgents[site]}`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        delete userAgents[site];
        browser.storage.sync.set({userAgents : userAgents})
            .then(loadUserAgents);
      });
      item.appendChild(deleteButton);
      userAgentsList.appendChild(item);
    }
  });
}

loadUserAgents();

addButton.addEventListener('click', () => {
  const site = siteInput.value.trim();
  const userAgent = userAgentInput.value.trim();
  if (site && userAgent) {
    browser.storage.sync.get('userAgents').then(result => {
      const userAgents = result.userAgents || {};
      userAgents[site] = userAgent;
      browser.storage.sync.set({userAgents : userAgents}).then(loadUserAgents);
      siteInput.value = '';
      userAgentInput.value = '';
    });
  }
});
