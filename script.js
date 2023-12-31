const tabsContainer = document.querySelector('[role=tablist]');
const tabButtons = tabsContainer.querySelectorAll('[role=tab]');
const tabPanels = document.querySelectorAll('[role=tabpanel]');

tabsContainer.addEventListener('click', (e) => {
  const clickedTab = e.target.closest('button');
  const currentTab = tabsContainer.querySelector('[aria-selected="true"]');

  if (!clickedTab || clickedTab === currentTab) return;

  switchTab(clickedTab);
});

tabsContainer.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'Home':
      e.preventDefault();
      switchTab(tabButtons[0]);
      break;
    case 'End':
      e.preventDefault();
      switchTab(tabButtons[tabButtons.length - 1]);
      break;
  }
});

function moveLeft() {
  const currentTab = document.activeElement;

  if (!currentTab.previousElementSibling) {
    tabButtons.item(tabButtons.length - 1).focus();
  } else {
    currentTab.previousElementSibling.focus();
  }
}

function moveRight() {
  const currentTab = document.activeElement;
  if (!currentTab.nextElementSibling) {
    tabButtons.item(0).focus();
  } else {
    currentTab.nextElementSibling.focus();
  }
}

function switchTab(newTab) {
  const oldTab = tabsContainer.querySelector('[aria-selected="true"]');
  const activePanelId = newTab.getAttribute('aria-controls');
  const activePanel = tabsContainer.nextElementSibling.querySelector(
    '#' + CSS.escape(activePanelId)
  );
  tabButtons.forEach((button) => {
    button.setAttribute('aria-selected', false);
    button.setAttribute('tabindex', '-1');
  });

  tabPanels.forEach((panel) => {
    panel.setAttribute('hidden', true);
  });

  activePanel.removeAttribute('hidden', false);

  newTab.setAttribute('aria-selected', true);
  newTab.setAttribute('tabindex', '0');
  newTab.focus();
  moveIndicator(oldTab, newTab);
}

// move underline indicator
// The way the youtube tab move is stretch the underline bar to the position that cover both tabs first, and the shrink the underline bar to the correct start point or end point of the new tab.
function moveIndicator(oldTab, newTab) {
  // Very strange function, if newTab is on the right side of the oldTab, return 4; if newTab is on the left side of the oldTab, return 2;
  const newTabPosition = oldTab.compareDocumentPosition(newTab);
  // console.log(newTabPosition);
  let transitionWidth;

  // if the new tab is to the right
  if (newTabPosition === 4) {
    transitionWidth =
      newTab.offsetLeft + newTab.offsetWidth - oldTab.offsetLeft;
  } else {
    // if the tab is to the left
    transitionWidth =
      oldTab.offsetLeft + oldTab.offsetWidth - newTab.offsetLeft;
    // We need the 'left' position shift straight away, not wait for timeout.
    tabsContainer.style.setProperty('--_left', newTab.offsetLeft + 'px');
  }

  // Using scale instead of animating width just because it's better for animation performance
  const newTabWidth = newTab.offsetWidth / tabsContainer.offsetWidth;

  // tabsContainer.style.setProperty('--_left', newTab.offsetLeft + 'px');
  // tabsContainer.style.setProperty('--_width', newTabWidth);

  // Make it stretch to the correct end position (right side of the new tab) first
  // (you can see this by refreshing the page and click any tab for the first time)
  tabsContainer.style.setProperty(
    '--_width',
    transitionWidth / tabsContainer.offsetWidth
  );

  // After it finishes stretching, shrinks the width to the correct position
  setTimeout(() => {
    tabsContainer.style.setProperty('--_left', newTab.offsetLeft + 'px');
    tabsContainer.style.setProperty('--_width', newTabWidth);

    // if we keep the timeout the same figure as the animation, e.g. 200, you will see the bouncing effect of the underline when you switch between tabs. Make the timeout longer to resolve this problem
  }, 220);
}
