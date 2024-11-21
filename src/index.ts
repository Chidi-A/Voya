import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

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
  const moveText = new SplitType('.move-text'); // Update this selector to match your heading
  const moveParagraph = new SplitType('.move-paragraph');

  // Create scroll-triggered animations for move section
  gsap.set(moveText.lines || [], { opacity: 0, yPercent: 100 });
  gsap.set(moveParagraph.lines || [], { opacity: 0, xPercent: 20 });

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

  // Mouse follow animation for blur layer
  const blurLayer = document.querySelector('.layer-blur');
  const section = document.querySelector('.section_home-locations');

  if (section && blurLayer) {
    section.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = section.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - blurLayer.clientWidth / 2;
      const y = mouseEvent.clientY - blurLayer.clientHeight / 2;

      gsap.to('.layer-blur', {
        x: x,
        y: y,
        scale: 1.2, // Scale up on movement
        opacity: 0.8, // Fade slightly
        duration: 0.8,
        ease: 'power2.out',
        transformOrigin: 'center center',
        onComplete: () => {
          // Scale and fade back to normal
          gsap.to('.layer-blur', {
            scale: 1,
            opacity: 0.5,
            duration: 0.4,
            ease: 'power2.out',
          });
        },
      });
    });
  }

  // Mouse hover animation for location columns
  const locationColumns = document.querySelectorAll('.home-locations_column');

  if (locationColumns) {
    locationColumns.forEach((column) => {
      column.addEventListener('mouseenter', () => {
        gsap.to(column, {
          scale: 1.05, // Scale up slightly
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      column.addEventListener('mouseleave', () => {
        gsap.to(column, {
          scale: 1, // Return to original size
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
    featureColumns.forEach((column) => {
      const mockup = column.querySelector('.features_mockup');

      // Set initial state
      if (mockup) {
        gsap.set(mockup, {
          scale: 0.8,
          opacity: 0,
          xPercent: 20,
          yPercent: 20,
        });
      }

      column.addEventListener('mouseenter', () => {
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
      });

      column.addEventListener('mouseleave', () => {
        if (mockup) {
          gsap.to(mockup, {
            scale: 0.8,
            opacity: 0,
            xPercent: 20,
            yPercent: 20,
            duration: 0.6,
            ease: 'power3.in',
          });
        }
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

  // Subtle pulsing motion for layer-blur-2
  gsap.to('.layer-blur-2', {
    scale: 1.1,
    opacity: 0.8,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.3,
    transformOrigin: 'center center',
  });
});

function animateWords(): void {
  const textElement = document.querySelector<HTMLElement>('.primary-h1-span');

  if (!textElement) {
    console.error("Could not find element with class 'primary-h1-span'");
    return;
  }

  const words: string[] = ['secure', 'visa-ready', 'comfortably', 'anywhere', 'beyond'];
  let currentIndex = 0;
  let split: SplitType | null = null;

  function updateText(): void {
    if (!textElement) return;
    textElement.textContent = words[currentIndex];
    split = new SplitType(textElement, { types: 'chars' });
    if (split.chars) {
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
