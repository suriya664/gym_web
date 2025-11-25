// Main JavaScript file with jQuery and AJAX functionality

$(document).ready(function() {
    
    // ===== Theme Toggle (Light/Dark Mode) =====
    const themeToggle = $('#themeToggle');
    const body = $('body');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.addClass('dark-mode');
        if (themeToggle.length) {
            themeToggle.find('i').removeClass('fa-moon').addClass('fa-sun');
        }
    }
    
    if (themeToggle.length) {
        themeToggle.on('click', function(e) {
            e.preventDefault();
            body.toggleClass('dark-mode');
            const isDark = body.hasClass('dark-mode');
            
            if (isDark) {
                localStorage.setItem('theme', 'dark');
                themeToggle.find('i').removeClass('fa-moon').addClass('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.find('i').removeClass('fa-sun').addClass('fa-moon');
            }
        });
    }
    
    // ===== Mobile Menu Toggle =====
    $('#mobileMenuToggle').on('click', function() {
        $('.main-nav').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.main-nav, .mobile-menu-toggle').length) {
            $('.main-nav').removeClass('active');
            $('#mobileMenuToggle').find('i').removeClass('fa-times').addClass('fa-bars');
        }
    });
    
    // ===== Set Active Page in Navigation =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-menu a').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            $(this).addClass('active');
        }
    });
    
    // ===== Form Validation and AJAX Submission =====
    $('form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const formData = form.serialize();
        const formType = form.attr('id') || form.attr('class');
        
        // Basic validation
        let isValid = true;
        form.find('input[required], textarea[required]').each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        
        // Email validation
        const emailInput = form.find('input[type="email"]');
        if (emailInput.length && emailInput.val()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.val())) {
                isValid = false;
                emailInput.addClass('error');
            }
        }
        
        // Password confirmation validation (for register form)
        const passwordInput = form.find('#registerPassword');
        const confirmPasswordInput = form.find('#registerConfirmPassword');
        if (passwordInput.length && confirmPasswordInput.length) {
            if (passwordInput.val() !== confirmPasswordInput.val()) {
                isValid = false;
                confirmPasswordInput.addClass('error');
                showFormMessage(form, 'Passwords do not match.', 'error');
            }
            if (passwordInput.val().length < 6) {
                isValid = false;
                passwordInput.addClass('error');
                showFormMessage(form, 'Password must be at least 6 characters long.', 'error');
            }
        }
        
        if (!isValid) {
            if (!form.find('.form-message').length) {
                showFormMessage(form, 'Please fill in all required fields correctly.', 'error');
            }
            return;
        }
        
        // AJAX form submission
        $.ajax({
            url: form.attr('action') || '#',
            type: form.attr('method') || 'POST',
            data: formData,
            success: function(response) {
                showFormMessage(form, 'Thank you! Your message has been sent successfully.', 'success');
                form[0].reset();
            },
            error: function() {
                showFormMessage(form, 'Sorry, there was an error. Please try again later.', 'error');
            }
        });
    });
    
    // Helper function to show form messages
    function showFormMessage(form, message, type) {
        let messageDiv = form.find('.form-message');
        if (!messageDiv.length) {
            messageDiv = $('<div class="form-message"></div>');
            form.prepend(messageDiv);
        }
        messageDiv.removeClass('success error').addClass(type).text(message).fadeIn();
        
        setTimeout(function() {
            messageDiv.fadeOut();
        }, 5000);
    }
    
    // ===== Smooth Scroll for Anchor Links =====
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
    // ===== Remove error class on input focus =====
    $('input, textarea').on('focus', function() {
        $(this).removeClass('error');
    });
    
    // ===== Lazy Loading Images =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== Initialize dropdowns on mobile =====
    $('.dropdown > a').on('click', function(e) {
        if ($(window).width() <= 768) {
            e.preventDefault();
            $(this).parent().find('.dropdown-menu').slideToggle();
        }
    });
    
});

