const message = document.querySelector(".message");


// Check if dark mode is already enabled (using localStorage)
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
  }

  //remove dark mode onload
  window.onload = function() {
    document.body.classList.remove('dark-mode');
    message.classList.remove('active');
  };
  
  
  // Handle the form-switch toggle
  document.getElementById('darkSwitch').addEventListener('change', function() {
    if (this.checked) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
  
  // Function to enable dark mode
  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    
    message.classList.add('active');
    setTimeout(function(){
      message.classList.remove('active')
    }, 2000)
    localStorage.setItem('darkMode', 'enabled');
  }
  
  // Function to disable dark mode
  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
  