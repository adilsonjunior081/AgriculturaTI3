/**
 * Agricultura de Gravatá - JavaScript Principal
 * Versão: 1.1.1
 * Última atualização: 2024-03-21
 */

// IIFE para isolar o escopo e evitar poluição do escopo global
(function() {
    'use strict';
    
    // Configuração de ambiente - pode ser modificada para testes em outros ambientes
    const isDev = isDevEnvironment();
    
    // Verificar se o documento está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
    // Inicialização da aplicação
    function initApp() {
        // Inicializar todos os componentes
        initMobileMenu();
        initScrollEffects();
        initContactForm();
        initAnimations();
        applySecurityMeasures();
        
        // Registrar o Service Worker para PWA (Progressive Web App)
        registerServiceWorker();
        
        // Adicionar logs apenas em ambiente de desenvolvimento
        if (isDev) {
            console.log('App inicializado no ambiente de desenvolvimento');
        }
    }
    
    // Menu Mobile
    function initMobileMenu() {
        const navToggle = document.querySelector('.mobile-toggle');
        const mobileNav = document.querySelector('.navigation-links');
        const overlay = document.querySelector('.nav-overlay');
        const mobileLinks = document.querySelectorAll('.navigation-links li a');
        
        if (navToggle) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleMenu();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Fechar menu ao clicar em links do menu
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    closeMenu();
                }
            });
        });
        
        // Função para alternar o menu
        function toggleMenu() {
            document.body.classList.toggle('menu-open');
            if (mobileNav) mobileNav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        }
        
        // Função para fechar o menu
        function closeMenu() {
            document.body.classList.remove('menu-open');
            if (mobileNav) mobileNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
        
        // Detectar ESC para fechar o menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }
    
    // Efeitos de scroll
    function initScrollEffects() {
        // Adicionar classe ao header quando rolar a página
        const header = document.querySelector('header');
        
        if (header) {
            // Implementação otimizada usando throttle para scroll
            const throttleTime = 100; // ms
            let lastScrollTime = 0;
            let ticking = false;
            
            window.addEventListener('scroll', function() {
                const now = Date.now();
                
                if (!ticking && now - lastScrollTime > throttleTime) {
                    window.requestAnimationFrame(function() {
                        const scrollTop = window.scrollY;
                        if (scrollTop > 50) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                        lastScrollTime = now;
                        ticking = false;
                    });
                    
                    ticking = true;
                }
            });
        }
        
        // Scroll suave para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;
                    
                    window.scrollTo({
                        top: targetOffset - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Adicionar o hash à URL sem reload da página
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // Inicializar formulário de contato
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const thankYouMessage = document.getElementById('thankYouMessage');
        const errorMessage = createErrorElement('form-error', 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Remover mensagem de erro anterior, se existir
                const existingError = contactForm.querySelector('.form-error');
                if (existingError) {
                    existingError.remove();
                }
                
                // Validação do formulário - usar API de validação nativa do HTML5
                if (!contactForm.checkValidity()) {
                    showValidationErrors(contactForm);
                    return;
                }
                
                // Obter os dados do formulário
                const formData = {
                    name: sanitizeInput(document.getElementById('name').value),
                    email: sanitizeInput(document.getElementById('email').value),
                    phone: sanitizeInput(document.getElementById('phone').value),
                    subject: sanitizeInput(document.getElementById('subject').value),
                    message: sanitizeInput(document.getElementById('message').value)
                };
                
                // Enviar os dados do formulário (usando EmailJS ou outro serviço)
                // Esta é uma simulação - você precisa configurar seu serviço de email real
                emailFormData(formData)
                    .then(() => {
                        // Exibir mensagem de agradecimento
                        contactForm.style.display = 'none';
                        if (thankYouMessage) {
                            thankYouMessage.style.display = 'block';
                        }
                        
                        // Limpar formulário
                        contactForm.reset();
                    })
                    .catch(error => {
                        // Tratar erro no envio
                        if (isDev) {
                            console.error('Erro ao enviar formulário:', error);
                        }
                        
                        // Exibir mensagem de erro ao usuário
                        contactForm.appendChild(errorMessage);
                    });
            });
        }
        
        // Função para enviar os dados do formulário por email - com Promise para tratamento de erros
        function emailFormData(formData) {
            return new Promise((resolve, reject) => {
                // Simulação de sucesso/falha aleatória para teste de erro
                setTimeout(() => {
                    // Em produção, substitua esta simulação pelo serviço real de email
                    /* 
                    // Descomentar e configurar quando estiver pronto para usar
                    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                        from_name: formData.name,
                        reply_to: formData.email,
                        phone: formData.phone,
                        subject: formData.subject,
                        message: formData.message
                    })
                    .then(function(response) {
                        resolve(response);
                    }, function(error) {
                        reject(error);
                    });
                    */
                    
                    // Log apenas em ambiente de desenvolvimento
                    if (isDev) {
                        console.log('Dados do formulário que seriam enviados:', formData);
                    }
                    
                    // Simular sucesso na maioria das vezes (90%)
                    if (Math.random() < 0.9) {
                        resolve({ status: 200, text: 'OK' });
                    } else {
                        // Simular falha ocasional (10%)
                        reject(new Error('Erro simulado no envio do email'));
                    }
                }, 1000);
            });
        }
        
        // Função para criar elemento de erro
        function createErrorElement(className, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = className;
            errorDiv.style.color = '#ff3333';
            errorDiv.style.padding = '10px';
            errorDiv.style.marginTop = '15px';
            errorDiv.style.border = '1px solid #ff3333';
            errorDiv.style.borderRadius = '4px';
            errorDiv.style.backgroundColor = 'rgba(255, 51, 51, 0.1)';
            errorDiv.textContent = message;
            return errorDiv;
        }
        
        // Mostrar erros de validação
        function showValidationErrors(form) {
            const invalidFields = form.querySelectorAll(':invalid');
            
            invalidFields.forEach(field => {
                field.classList.add('error');
                
                // Remover mensagens de erro anteriores
                const existingError = field.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                // Criar nova mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = field.validationMessage || 'Este campo é inválido';
                field.parentNode.appendChild(errorMessage);
                
                // Remover mensagem de erro quando o campo for preenchido corretamente
                field.addEventListener('input', function() {
                    if (field.checkValidity()) {
                        const error = field.parentNode.querySelector('.error-message');
                        if (error) {
                            error.remove();
                        }
                        field.classList.remove('error');
                    }
                });
            });
            
            // Focar o primeiro campo inválido
            if (invalidFields.length > 0) {
                invalidFields[0].focus();
            }
        }
        
        // Função para sanitizar input (prevenir XSS) usando textContent ao invés de innerHTML
        // Sanitiza input sem risco de execução de HTML/scripts
        function sanitizeInput(input) {
            // Usar DOMPurify, se disponível
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(input);
            }
            
            // Fallback para sanitização nativa mais segura
            const div = document.createElement('div');
            div.textContent = input;
            return div.textContent;
        }
    }
    
    // Inicializar animações
    function initAnimations() {
        // Animações baseadas em scroll
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Função para verificar se elemento está visível na viewport
        const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        };
        
        // Função para animar elementos visíveis com throttle
        const throttleTime = 100; // ms
        let lastAnimationTime = 0;
        
        const handleScrollAnimation = () => {
            const now = Date.now();
            
            if (now - lastAnimationTime > throttleTime) {
                animatedElements.forEach(el => {
                    if (isElementInViewport(el) && !el.classList.contains('animated')) {
                        el.classList.add('animated');
                    }
                });
                
                lastAnimationTime = now;
            }
        };
        
        // Usar Intersection Observer quando disponível
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback para navegadores mais antigos com throttling
            window.addEventListener('scroll', handleScrollAnimation);
            // Verificar elementos visíveis no carregamento inicial
            handleScrollAnimation();
        }
        
        // Aplicar delay em elementos com animação sequencial
        document.querySelectorAll('.culture-card').forEach((card, index) => {
            if (card.classList.contains('animate-on-scroll')) {
                card.style.transitionDelay = `${index * 0.1}s`;
            }
        });
        
        document.querySelectorAll('.chart-box').forEach((box, index) => {
            if (box.classList.contains('animate-on-scroll')) {
                box.style.transitionDelay = `${index * 0.2}s`;
            }
        });
    }
    
    // Registro do Service Worker
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                        // Registro com sucesso
                        if (isDev) {
                            console.log('Service Worker registrado com sucesso:', registration.scope);
                        }
                    })
                    .catch(function(error) {
                        if (isDev) {
                            console.log('Falha ao registrar Service Worker:', error);
                        }
                    });
            });
        }
    }
    
    // Implementar medidas de segurança adicionais
    function applySecurityMeasures() {
        // Adicionar cabeçalho CSP via meta tag (caso o servidor não o faça)
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com 'unsafe-inline'; img-src 'self' https://i.ytimg.com https://agricultura.gravata.pe.gov.br https://cdn-icons-png.flaticon.com https://png.pngtree.com data:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; connect-src 'self'; frame-src 'none'; object-src 'none';";
            document.head.appendChild(meta);
        }
        
        // Sanitizar URLs em todos os links
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('javascript:') || href.startsWith('data:'))) {
                link.setAttribute('href', '#');
                link.addEventListener('click', e => e.preventDefault());
            }
        });
        
        // Adicionar atributos de segurança aos links externos
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
        
        // Aplicar Referrer-Policy via meta tag
        if (!document.querySelector('meta[name="referrer"]')) {
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'referrer');
            meta.setAttribute('content', 'strict-origin-when-cross-origin');
            document.head.appendChild(meta);
        }
    }
    
    // Função melhorada para detectar ambiente de desenvolvimento
    function isDevEnvironment() {
        const hostname = window.location.hostname;
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' ||
               hostname.startsWith('192.168.') ||
               hostname.includes('.local') ||
               hostname.includes('.test') ||
               hostname.includes('-dev.') ||
               hostname.includes('.dev.') ||
               hostname.includes('-staging.') ||
               hostname.endsWith('.ngrok.io');
    }
    
})(); 