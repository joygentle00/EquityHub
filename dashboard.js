document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('#sidebar');
  const mainContent = document.querySelector('.main-content');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      mainContent.classList.toggle('sidebar-open');
    });
  }

  // Close sidebar when clicking outside or on a menu item
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
      }
    }
  });

  // Close sidebar when a menu item is clicked
  const menuItems = document.querySelectorAll('.sidebar nav ul li');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
      }
    });
  });
});