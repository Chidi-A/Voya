import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Swiper from 'swiper';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';

const isMobile = () => window.innerWidth < 768;

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  orientation: 'vertical', // vertical, horizontal
  gestureOrientation: 'vertical', // vertical, horizontal, both
  smoothWheel: true,
});

// Get time for animation
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

// Integrate GSAP ScrollTrigger with Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Start the animation
requestAnimationFrame(raf);

window.Webflow ||= [];
window.Webflow.push(() => {
  animateWords();
  initializeSwiper();

  // Paste testimonial animation here, outside if/else
  // Testimonial vertical scroll animation
  const testimonialContainer = document.querySelector('.testimonial-container');
  const testimonialWrapper = document.querySelector('.testimonial-collection_wrapper');

  if (testimonialContainer && testimonialWrapper) {
    const containerHeight = (testimonialContainer as HTMLElement).offsetHeight;
    const wrapperHeight = (testimonialWrapper as HTMLElement).offsetHeight;
    const scrollDistance = containerHeight - wrapperHeight;

    // Create the scrolling animation
    gsap.to(testimonialContainer, {
      y: -scrollDistance,
      duration: isMobile() ? 60 : 45, // Slower on mobile
      ease: 'none',
      repeat: -1,
      scrollTrigger: {
        trigger: testimonialWrapper,
        start: 'top center',
        end: 'bottom center',
      },
      onRepeat: () => {
        gsap.set(testimonialContainer, { y: 0 });
      },
    });
  }

  if (isMobile()) {
    // Completely disable ScrollTrigger for certain animations on mobile
    ScrollTrigger.getAll().forEach((trigger) => {
      const triggerElement = trigger.vars.trigger;
      if (
        typeof triggerElement === 'string' &&
        (triggerElement.includes('features') || triggerElement.includes('locations'))
      ) {
        trigger.kill();
      }
    });

    // Simpler animations for features section on mobile
    const featuresElements = document.querySelectorAll(
      '.features-svg, .features-heading, .home-features_bottom-grid'
    );
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            clearProps: 'transform', // Clear transform after animation
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    featuresElements.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 20 });
      observer.observe(el);
    });

    // Simpler animations for locations section on mobile
    const locationColumns = document.querySelectorAll('.home-locations_column');
    const locationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            clearProps: 'transform',
          });
          locationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    locationColumns.forEach((column) => {
      gsap.set(column, { opacity: 0, x: 20 });
      locationObserver.observe(column);
    });

    // Disable unnecessary effects on mobile
    gsap.killTweensOf('.layer-blur, .layer-blur-2');
    gsap.killTweensOf('.cta-mockup-wrapper');

    // Add touch-specific optimizations
    const touchOptimizations = document.createElement('style');
    touchOptimizations.textContent = `
      @media (max-width: 767px) {
        .features-svg,
        .home-features_bottom-grid,
        .home-locations_column {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .section_home-features,
        .section_home-locations {
          transform: translate3d(0,0,0);
          -webkit-transform: translate3d(0,0,0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
      }
    `;
    document.head.appendChild(touchOptimizations);
  } else {
    animateWords();
    // Initialize split text elements
    const headingText = new SplitType('h1');
    const paragraphText = new SplitType('.hero-paragraph');
    const tl = gsap.timeline();

    // Set initial states for all elements
    gsap.set('.navbar6_component', { opacity: 0 });
    gsap.set('.home-header_image-wrapper', { opacity: 0, scale: 1.02 });
    gsap.set('.home-header_form-container', { opacity: 0, yPercent: 20 });
    if (headingText?.lines) gsap.set(headingText.lines, { yPercent: 100, opacity: 0 });
    if (paragraphText?.lines) gsap.set(paragraphText.lines, { yPercent: 100, opacity: 0 });

    // Set initial scale for parallax
    gsap.set('.hero-image', {
      scale: 1.2, // Increased scale for more room to move
    });

    // Build animation timeline
    tl
      // 1. Fade in navigation and hero image simultaneously
      .to('.navbar6_component', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
      })
      .to(
        '.home-header_image-wrapper',
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
        },
        '<'
      )
      // Add label for text animations
      .addLabel('textAnimations', '<+=0.2')
      // 2. Animate heading text
      .to(
        headingText?.lines || [],
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        },
        'textAnimations'
      )
      // 3. Animate paragraph text
      .to(
        paragraphText?.lines || [],
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        },
        'textAnimations+=0.5'
      )
      // Add form container animation
      .to(
        '.home-header_form-container',
        {
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: 'power3.out',
        },
        'textAnimations+=0.8'
      );

    // Separate parallax scroll effect
    gsap.to('.hero-image', {
      yPercent: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-header_section',
        start: 'top top',
        end: 'bottom center',
        scrub: 0.5,
      },
    });

    // Split texts for scroll animations

    const aboutParagraph = new SplitType('.about-paragraph');
    const teamParagraph = new SplitType('.team-paragraph');

    // Create scroll-triggered animations for move section

    gsap.set(aboutParagraph.lines || [], { opacity: 0, xPercent: 20 });
    gsap.set(teamParagraph.lines || [], { opacity: 0, xPercent: 20 });

    // Animate about paragraph lines from right
    gsap.to(aboutParagraph.lines || [], {
      opacity: 1,
      xPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-paragraph',
        start: 'top+=20% 60%',
      },
    });

    // Animate team paragraph lines from right
    gsap.to(teamParagraph.lines || [], {
      opacity: 1,
      xPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team-paragraph',
        start: 'top+=20% 60%',
      },
    });

    // Mouse hover animation for location columns
    // const locationColumns = document.querySelectorAll('.home-locations_column');

    // if (locationColumns) {
    //   locationColumns.forEach((column) => {
    //     column.addEventListener('mouseenter', () => {
    //       gsap.to(column, {
    //         scale: 1.05,
    //         duration: 0.4,
    //         ease: 'power2.out'
    //       });
    //     });

    //     column.addEventListener('mouseleave', () => {
    //       gsap.to(column, {
    //         scale: 1,
    //         duration: 0.4,
    //         ease: 'power2.out'
    //       });
    //     });
    //   });
    // }

    // Set initial states
    gsap.set('.sticky-heading-2', { yPercent: 0 });
    gsap.set('.border-line_active', { width: 0 });

    // First item animations
    gsap.to('.sticky-heading-2', {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(1)',
        start: 'top center',
        end: 'bottom+=100% center',
        scrub: true,
      },
    });

    gsap.to('.home-why_item:nth-child(1) .border-line_active', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(1)',
        start: 'top center',
        end: 'bottom+=100% center',
        scrub: true,
      },
    });

    // Second item animations
    gsap.to('.sticky-heading-2', {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(2)',
        start: 'top+=0% center',
        end: 'bottom+=100% center',
        scrub: true,
      },
    });

    gsap.to('.home-why_item:nth-child(2) .border-line_active', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(2)',
        start: 'top+=100% center',
        end: 'bottom+=200% center',
        scrub: true,
      },
    });

    // Third item animations
    gsap.to('.sticky-heading-2', {
      yPercent: -66.6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(3)',
        start: 'top center',
        end: 'bottom+=100% center',
        scrub: true,
      },
    });

    gsap.to('.home-why_item:nth-child(3) .border-line_active', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-why_item:nth-child(3)',
        start: 'top+=120% center',
        end: 'bottom+=200% center',
        scrub: true,
      },
    });

    // CTA section animations
    gsap.set('.cta-mockup-wrapper.is-1', { yPercent: 100, opacity: 0 }); // Start below
    gsap.set('.cta-mockup-wrapper:not(.is-1)', { yPercent: -100, opacity: 0 }); // Start above

    gsap.to('.cta-mockup-wrapper.is-1', {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section_cta',
        start: 'top 70%',
      },
    });

    gsap.to('.cta-mockup-wrapper:not(.is-1)', {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section_cta',
        start: 'top 70%',
      },
    });

    // Subtle pulsing motion for CTA mockups
    gsap.to('.cta-mockup-wrapper', {
      scale: 1.05,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.3,
      transformOrigin: 'center center',
    });

    // Add grayscale effect for logos
    const logos = document.querySelectorAll('.logo3_logo');

    // Add the CSS styles programmatically
    const logoStyleSheet = document.createElement('style');
    logoStyleSheet.textContent = `
      .logo3_logo {
        filter: grayscale(100%);
        opacity: 0.6;
        transition: all 0.4s ease;
      }
      
      .logo3_logo:hover {
        filter: grayscale(0%);
        opacity: 1;
      }
    `;
    document.head.appendChild(logoStyleSheet);

    // Optional: Add JavaScript hover effect if you want more control
    logos.forEach((logo) => {
      logo.addEventListener('mouseenter', () => {
        gsap.to(logo, {
          filter: 'grayscale(0%)',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      logo.addEventListener('mouseleave', () => {
        gsap.to(logo, {
          filter: 'grayscale(100%)',
          opacity: 0.6,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });

    // Subtle floating animation for blur layers
    gsap.to('.layer-blur', {
      x: 30,
      y: 30,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center center',
    });

    gsap.to('.layer-blur-2', {
      x: -30,
      y: -30,
      duration: 5.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center center',
    });

    // Set initial state for image wrapper
    gsap.set('.header15_image-wrapper', {
      opacity: 0,
      y: 50,
    });
    gsap.set('.team4_item', {
      opacity: 0,
      y: 50,
    });

    // Animate image wrapper when it comes into view
    gsap.to('.header15_image-wrapper', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.header15_image-wrapper',
        start: 'top 80%',
      },
    });

    // Animate team items with stagger when they come into view
    gsap.to('.team4_item', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team4_item',
        start: 'top 80%',
      },
    });

    // Add performance optimization styles
    const performanceStyles = document.createElement('style');
    performanceStyles.textContent = `
      .hero-image,
      .home-locations_column,
      .features-svg,
      .home-features_bottom-grid {
        will-change: transform;
      }
    `;
    document.head.appendChild(performanceStyles);
  }
});

function animateWords(): void {
  const textElement = document.querySelector<HTMLElement>('.primary-h1-span');

  if (!textElement) {
    console.error("Could not find element with class 'primary-h1-span'");
    return;
  }

  // Define the words with their colors using an interface
  interface ColoredWord {
    text: string;
    color: string;
  }

  const words: ColoredWord[] = [
    { text: 'Secure', color: '#7abfea' },
    { text: 'Visa-Ready', color: '#7abfea' },
    { text: 'Comfortably', color: '#7abfea' },
    { text: 'Anywhere', color: '#7abfea' },
    { text: 'Beyond', color: '#7abfea' },
  ];

  let currentIndex = 0;
  let split: SplitType | null = null;

  function updateText(): void {
    if (currentIndex >= words.length) {
      currentIndex = 0;
    }

    if (split) {
      split.revert();
    }

    const word = words[currentIndex];
    if (!textElement) return;
    textElement.textContent = word.text;

    // Create new split after setting text
    split = new SplitType(textElement, {
      types: 'chars',
      tagName: 'span',
    });

    if (split?.chars) {
      animateChars(split.chars);
    }

    currentIndex = currentIndex + 1;
  }

  function animateChars(chars: Element[]): void {
    // First, ensure any previous animation is complete
    gsap.killTweensOf(chars);

    // Simple fade in with stagger
    gsap.fromTo(
      chars,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: {
          each: 0.09, // Increased stagger time between each char
          from: 'start',
        },
        duration: 1, // Increased overall animation duration
        ease: 'power2.out',
      }
    );
  }

  // Adjust timing
  setInterval(updateText, 2500);
}

// Add CSS for light beam effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .nav-image-wrapper-2 {
    position: relative;
    overflow: hidden;
  }
  
  .nav-image-wrapper-2::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
    opacity: 0;
  }
`;
document.head.appendChild(styleSheet);

// Pulse animation with light beam effect
gsap.to('.nav-image-wrapper-2', {
  scale: 1.2,
  duration: 0.8,
  ease: 'power1.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center',
});

// Light beam animation
gsap.to('.nav-image-wrapper-2::before', {
  opacity: 0.5,
  duration: 0.8,
  ease: 'power1.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center',
});

interface CityResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

function initializeCityAutocomplete(): void {
  // Add CSS styles programmatically
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .city-suggestion {
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .city-suggestion:hover {
      background-color: #f5f5f5;
      transform: translateX(4px);
      color: #000000;
    }
  `;
  document.head.appendChild(styleSheet);

  const cityInput = document.querySelector<HTMLInputElement>('.city-input');
  const suggestionsDiv = document.querySelector<HTMLDivElement>('.city-suggestions');

  if (!cityInput || !suggestionsDiv) return;

  let debounceTimer: NodeJS.Timeout;
  const OPENWEATHER_API_KEY = '91c9225f1177a02fcfd2aedc5b7786c0';

  cityInput.addEventListener('input', async (e) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    clearTimeout(debounceTimer);

    if (!value) {
      suggestionsDiv.innerHTML = '';
      suggestionsDiv.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${OPENWEATHER_API_KEY}`
        );

        const data: CityResult[] = await response.json();

        suggestionsDiv.innerHTML = '';

        if (data.length > 0) {
          suggestionsDiv.style.display = 'block';

          data.forEach((city) => {
            const div = document.createElement('div');
            div.className = 'city-suggestion';
            // Include state if available
            const displayText = city.state
              ? `${city.name}, ${city.state}, ${city.country}`
              : `${city.name}, ${city.country}`;
            div.textContent = displayText;

            div.addEventListener('click', () => {
              cityInput.value = displayText;
              suggestionsDiv.style.display = 'none';
            });

            suggestionsDiv.appendChild(div);
          });
        } else {
          suggestionsDiv.style.display = 'none';
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }, 300);
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target as Node)) {
      suggestionsDiv.style.display = 'none';
    }
  });
}

// Add to your existing DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', initializeCityAutocomplete);

// Add this helper function at the top
const elementExists = (selector: string): boolean => document.querySelector(selector) !== null;

window.Webflow ||= [];
window.Webflow.push(() => {
  // Remove or update the nav-image-wrapper-2 animation if the element doesn't exist
  if (elementExists('.nav-image-wrapper-2')) {
    gsap.to('.nav-image-wrapper-2', {
      scale: 1.2,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: 'center center',
    });
  }

  // Separate parallax effect
  if (elementExists('.hero-image') && elementExists('.home-header_section')) {
    gsap.to('.hero-image', {
      yPercent: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-header_section',
        start: 'top top',
        end: 'bottom center',
        scrub: 0.5,
      },
    });
  }

  // Split texts for scroll animations - Add checks
  const moveText = elementExists('.move-text') ? new SplitType('.move-text') : null;
  const moveParagraph = elementExists('.move-paragraph') ? new SplitType('.move-paragraph') : null;
  const aboutParagraph = elementExists('.about-paragraph')
    ? new SplitType('.about-paragraph')
    : null;
  const teamParagraph = elementExists('.team-paragraph') ? new SplitType('.team-paragraph') : null;

  // Create scroll-triggered animations for move section - with checks
  if (!isMobile() && moveText?.lines) {
    gsap.set(moveText.lines, { opacity: 0, yPercent: 100 });
    gsap.to(moveText.lines, {
      opacity: 1,
      yPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section_home-locations',
        start: 'top+=20% 70%',
      },
    });
  }

  if (!isMobile() && moveParagraph?.lines) {
    gsap.set(moveParagraph.lines, { opacity: 0, xPercent: 20 });
    gsap.to(moveParagraph.lines, {
      opacity: 1,
      xPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section_home-locations',
        start: 'top+=20% 60%',
      },
    });
  }

  if (!isMobile() && aboutParagraph?.lines) {
    gsap.set(aboutParagraph.lines, { opacity: 0, xPercent: 20 });
    gsap.to(aboutParagraph.lines, {
      opacity: 1,
      xPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-paragraph',
        start: 'top+=20% 60%',
      },
    });
  }

  if (teamParagraph?.lines) {
    gsap.set(teamParagraph.lines, { opacity: 0, xPercent: 20 });
    gsap.to(teamParagraph.lines, {
      opacity: 1,
      xPercent: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team-paragraph',
        start: 'top+=20% 60%',
      },
    });
  }

  // Header and team animations - Add checks
  if (elementExists('.header15_image-wrapper')) {
    gsap.set('.header15_image-wrapper', {
      opacity: 0,
      y: 50,
    });
    gsap.to('.header15_image-wrapper', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.header15_image-wrapper',
        start: 'top 80%',
      },
    });
  }

  if (elementExists('.team4_item')) {
    gsap.set('.team4_item', {
      opacity: 0,
      y: 50,
    });
    gsap.to('.team4_item', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.team4_item',
        start: 'top 80%',
      },
    });
  }
});

// Time ago function for testimonials
function initializeTimeAgo(): void {
  function timeAgo(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      // Return appropriate time string
      if (seconds < 60) {
        return 'just now';
      }

      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
      }

      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      }

      const days = Math.floor(hours / 24);
      if (days < 7) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
      }

      const weeks = Math.floor(days / 7);
      if (weeks < 4) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      }

      const months = Math.floor(days / 30.44);
      if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
      }

      const years = Math.floor(months / 12);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    } catch {
      return 'Invalid date';
    }
  }

  function updateTimes(): void {
    const timeElements = document.querySelectorAll<HTMLElement>('.time-ago');

    timeElements.forEach((el) => {
      // Get or store original date
      let originalDate = el.getAttribute('data-original-date');

      if (!originalDate) {
        // First time - store the original date
        originalDate = el.textContent?.trim() ?? null;
        if (originalDate) {
          el.setAttribute('data-original-date', originalDate);
        }
      }

      if (originalDate) {
        const timeAgoText = timeAgo(originalDate);
        el.textContent = timeAgoText;
      }
    });
  }

  // Initial update
  updateTimes();

  // Update every minute
  setInterval(updateTimes, 60000);
}

// Add to your Webflow.push
window.Webflow ||= [];
window.Webflow.push(() => {
  initializeTimeAgo();
});

// Create a separate function for Swiper initialization
function initializeSwiper(): void {
  const sliderComponents = document.querySelectorAll<HTMLElement>('.slider-main_component');

  sliderComponents.forEach((component) => {
    const loopMode = component.getAttribute('loop-mode') === 'true';
    const swiperElement = component.querySelector<HTMLElement>('.swiper');
    if (!swiperElement) return;

    const swiper = new Swiper(swiperElement, {
      modules: [Autoplay, Pagination, Navigation, Mousewheel, Keyboard],
      loop: loopMode,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      freeMode: true,
      slideToClickedSlide: false,
      slidesPerView: 1,
      spaceBetween: '4%',
      rewind: false,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
      pagination: {
        el: component.querySelector<HTMLElement>('.swiper-bullet-wrapper')!,
        bulletActiveClass: 'is-active',
        bulletClass: 'swiper-bullet',
        bulletElement: 'button',
        clickable: true,
      },
      navigation: {
        nextEl: component.querySelector<HTMLElement>('.swiper-next')!,
        prevEl: component.querySelector<HTMLElement>('.swiper-prev')!,
        disabledClass: 'is-disabled',
      },
      slideActiveClass: 'is-active',
      effect: 'slide',
      speed: 600,
    });

    // Intersection Observer for autoplay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            swiper.autoplay?.start();
          } else {
            swiper.autoplay?.stop();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(swiperElement);
  });
}
