import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';


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
  // Initialize split text elements
  const headingText = new SplitType('h1');
  const paragraphText = new SplitType('.hero-paragraph');
  const tl = gsap.timeline();

  // Set initial states for all elements
  gsap.set('.navbar6_component', { opacity: 0 });
  gsap.set('.home-header_image-wrapper', { opacity: 0, scale: 1.02 });
  gsap.set('.home-header_form-container', { opacity: 0, yPercent: 20 });
  if (headingText.lines) gsap.set(headingText.lines, { yPercent: 100, opacity: 0 });
  if (paragraphText.lines) gsap.set(paragraphText.lines, { yPercent: 100, opacity: 0 });

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
      headingText.lines || [],
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
      paragraphText.lines || [],
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
    yPercent: -120, // Increased movement range
    ease: 'none',
    scrollTrigger: {
      trigger: '.home-header_section',
      start: 'top top',
      end: 'bottom center', // Adjusted end point for more pronounced effect
      scrub: 0.5, // Reduced scrub for more immediate response
    },
  });

  // Split texts for scroll animations
  const moveText = new SplitType('.move-text');
  const moveParagraph = new SplitType('.move-paragraph');
  const aboutParagraph = new SplitType('.about-paragraph');
  const teamParagraph = new SplitType('.team-paragraph');

  // Create scroll-triggered animations for move section
  gsap.set(moveText.lines || [], { opacity: 0, yPercent: 100 });
  gsap.set(moveParagraph.lines || [], { opacity: 0, xPercent: 20 });
  gsap.set(aboutParagraph.lines || [], { opacity: 0, xPercent: 20 });
  gsap.set(teamParagraph.lines || [], { opacity: 0, xPercent: 20 });

  // Animate move text from bottom
  gsap.to(moveText.lines || [], {
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

  // Animate paragraph lines from right
  gsap.to(moveParagraph.lines || [], {
    opacity: 1,
    xPercent: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section_home-locations',
      start: 'top+=20% 60%', // Slightly after the heading
    },
  });

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

  // Animate location cards from right
  gsap.set('.home-locations_column', { opacity: 0, xPercent: 100 });

  gsap.to('.home-locations_column', {
    opacity: 1,
    xPercent: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'back.out(1.3)',
    scrollTrigger: {
      trigger: '.section_home-locations',
      start: 'top+=30% 60%',
    },
  });


  // Mouse hover animation for location columns
  const locationColumns = document.querySelectorAll('.home-locations_column');

  if (locationColumns) {
    // Add the CSS styles programmatically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .gleam-effect {
        position: relative;
        overflow: hidden;
      }

      .gleam-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transform: translateX(var(--gleam-position, -100%));
        pointer-events: none;
      }
    `;
    document.head.appendChild(styleSheet);

    locationColumns.forEach((column) => {
      // Add the gleam class to enable the shine effect
      column.classList.add('gleam-effect');
      
      column.addEventListener('mouseenter', () => {
        // Original scale animation
        gsap.to(column, {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out',
        });
        
        // Animate the gleam effect
        gsap.fromTo(
          column,
          {
            '--gleam-position': '-100%',
          },
          {
            '--gleam-position': '200%',
            duration: 1,
            ease: 'power2.inOut',
          }
        );
      });

      column.addEventListener('mouseleave', () => {
        gsap.to(column, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });
  }

  // Split text for features heading
  const featuresHeading = new SplitType('.features-heading');

  // Set initial states
  gsap.set('.features-svg', { opacity: 0, y: 50 });
  gsap.set(featuresHeading.lines || [], { opacity: 0, y: 50 });
  gsap.set('.home-features_bottom-grid', { opacity: 0, y: 30 });

  // Create timeline for features section
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section_home-features',
        start: 'top 70%',
      },
    })
    // 1. Animate SVG
    .to('.features-svg', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    })
    // 2. Animate heading lines
    .to(
      featuresHeading.lines || [],
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      },
      '-=0.5'
    ) // Start slightly before SVG animation completes
    // 3. Animate bottom grid
    .to(
      '.home-features_bottom-grid',
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.5'
    ); // Start slightly before heading animation completes

  // Features column hover animations
  const featureColumns = document.querySelectorAll('.features-locations_column');

  if (featureColumns) {
    // Add the CSS styles programmatically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .features-locations_column {
        transition: background-color 0.6s ease;
      }
      .features-locations_column * {
        transition: color 0.6s ease;
      }
    `;
    document.head.appendChild(styleSheet);

    featureColumns.forEach((column) => {
      const mockup = column.querySelector('.features_mockup');
      const textElements = column.querySelectorAll('.feature-column-heading, .feature-column-paragraph');

      // Set initial state - mockup slightly visible
      if (mockup) {
        gsap.set(mockup, {
          scale: 0.9,
          opacity: 0.2,
          xPercent: 10,
          yPercent: 10,
        });
      }

      column.addEventListener('mouseenter', () => {
        // Animate mockup
        if (mockup) {
          gsap.to(mockup, {
            scale: 1,
            opacity: 1,
            xPercent: 0,
            yPercent: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        }

        // Change background and text colors
        gsap.to(column, {
          backgroundColor: '#DDF1FF',
          duration: 0.6,
          ease: 'power3.out',
        });

        textElements.forEach(element => {
          gsap.to(element, {
            color: '#000000',
            duration: 0.6,
            ease: 'power3.out',
          });
        });
      });

      column.addEventListener('mouseleave', () => {
        // Animate mockup back
        if (mockup) {
          gsap.to(mockup, {
            scale: 0.9,
            opacity: 0.2,
            xPercent: 10,
            yPercent: 10,
            duration: 0.6,
            ease: 'power3.in',
          });
        }

        // Revert background and text colors
        gsap.to(column, {
          backgroundColor: 'transparent',
          duration: 0.6,
          ease: 'power3.in',
        });

        textElements.forEach(element => {
          gsap.to(element, {
            color: '#ffffff',
            duration: 0.6,
            ease: 'power3.in',
          });
        });
      });
    });
  }

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
      start: 'top+=40% center',
      end: 'bottom+=100% center',
      scrub: true,
    },
  });

  gsap.to('.home-why_item:nth-child(2) .border-line_active', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.home-why_item:nth-child(2)',
      start: 'top+=120% center',
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
  logos.forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      gsap.to(logo, {
        filter: 'grayscale(0%)',
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    logo.addEventListener('mouseleave', () => {
      gsap.to(logo, {
        filter: 'grayscale(100%)',
        opacity: 0.6,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });

  // Subtle floating animation for blur layers
  gsap.to('.layer-blur', {
    x: 40,
    y: 40,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    transformOrigin: 'center center'
  });

  gsap.to('.layer-blur-2', {
    x: -40,
    y: -30,
    duration: 3.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    transformOrigin: 'center center'
  });

  // Testimonial vertical scroll animation
  const testimonialContainer = document.querySelector('.testimonial-container');
  const testimonialWrapper = document.querySelector('.testimonial-collection_wrapper');

  if (testimonialContainer && testimonialWrapper) {
    // Get the distance that needs to be scrolled
    // This is the difference between container height and wrapper height
    const containerHeight = (testimonialContainer as HTMLElement).offsetHeight;
    const wrapperHeight = (testimonialWrapper as HTMLElement).offsetHeight;
    const scrollDistance = containerHeight - wrapperHeight;

    // Create the scrolling animation
    gsap.to(testimonialContainer, {
      y: -scrollDistance, // Negative value for upward motion
      duration: 45, // Adjust duration as needed
      ease: 'none',
      repeat: -1,
      scrollTrigger: {
        trigger: testimonialWrapper,
        start: 'top center',
        end: 'bottom center',
      },
      onRepeat: () => {
        // Jump back to start when animation repeats
        gsap.set(testimonialContainer, { y: 0 });
      }
    });
  }

  // Set initial state for image wrapper
  gsap.set('.header15_image-wrapper', { 
    opacity: 0,
    y: 50
  });
  gsap.set('.team4_item', { 
    opacity: 0,
    y: 50
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
    }
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
    }
  });
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
    { text: 'Secure', color: '#0fa4ff' },        // Coral red
    { text: 'Visa-Ready', color: '#218491' },    // Turquoise
    { text: 'Comfortably', color: '#36e7cb' },   // Sky blue
    { text: 'Anywhere', color: '#0fa4ff' },      // Sage green
    { text: 'Beyond', color: '#218491' }         // Purple
  ];

  function displayWords() {
    // First, get your container element (add an id to your HTML element)
    const containerElement = document.getElementById('words-container');
    
    if (containerElement) {
      words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word.text;
        span.style.color = word.color;
        span.style.fontWeight = 'bold';
        span.style.marginRight = '10px'; // Add some spacing between words
        containerElement.appendChild(span);
      });
    }
  }

  let currentIndex = 0;
  let split: SplitType | null = null;

  function updateText(): void {
    if (!textElement) return;
    
    // Set both text and color
    textElement.textContent = words[currentIndex].text;
    textElement.style.color = words[currentIndex].color;
    textElement.style.fontWeight = 'medium';
    
    split = new SplitType(textElement, { types: 'chars' });
    if (split.chars) {
      // Ensure each character inherits the color
      split.chars.forEach(char => {
        (char as HTMLElement).style.color = words[currentIndex].color;
      });
      animateChars(split.chars);
    }
    currentIndex = (currentIndex + 1) % words.length;
  }

  function animateChars(chars: Element[]): void {
    gsap.from(chars, {
      yPercent: 100,
      stagger: 0.03,
      duration: 1.5,
      ease: 'power4.out',
      onComplete: () => {
        if (split) {
          split.revert();
        }
      },
    });
  }

  setInterval(updateText, 3000);
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
  transformOrigin: 'center center'
});

// Light beam animation
gsap.to('.nav-image-wrapper-2::before', {
  opacity: 0.5,
  duration: 0.8,
  ease: 'power1.inOut',
  yoyo: true,
  repeat: -1,
  transformOrigin: 'center center'
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
    const value = target.value;

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



