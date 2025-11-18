# Background Animations Guide

This portfolio now includes dynamic background animations for each section, similar to GitHub's homepage effect.

## Animation Components

### 1. **ParticleBackground** (Hero Section)
- Creates animated particles that float across the screen
- Particles are connected with lines when they're close to each other
- Customizable particle count (default: 60)
- Responsive to dark/light mode

### 2. **GridBackground** (About Section)
- Animated grid of dots with wave effect
- Creates a ripple pattern emanating from the center
- Subtle and professional appearance
- Grid spacing: 50px

### 3. **WaveBackground** (Projects Section)
- Multiple layered sine waves
- Each wave has different amplitude, frequency, and speed
- Creates a flowing, dynamic effect
- Uses gradient opacity for smooth transitions

### 4. **AnimatedGradient** (Experience & Contact Sections)
- Smooth, animated gradient transitions
- Customizable color schemes
- Different colors for Experience and Contact sections
- Blend modes adapt to dark/light themes

### 5. **GeometricBackground** (Education Section)
- Animated geometric shapes (squares, circles, triangles)
- Shapes rotate and float across the screen
- Outline-only design for modern look
- Responsive particle density based on screen size

## Color Schemes

All animations use your portfolio's color palette:
- **Primary**: Teal (#0f9eb0)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Purple (#8b5cf6)
- **Contact Special**: Pink (#ec4899)

## Performance Optimizations

- Uses `requestAnimationFrame` for smooth 60fps animations
- Canvas-based rendering for efficiency
- `pointer-events: none` to prevent interaction interference
- Automatic cleanup on component unmount
- Responsive to window resize events

## Customization

You can easily customize each background:

```jsx
// Adjust particle count
<ParticleBackground darkMode={darkMode} particleCount={100} />

// Custom color scheme
<AnimatedGradient
  darkMode={darkMode}
  colors={[
    { r: 255, g: 0, b: 0, a: 0.2 },
    { r: 0, g: 255, b: 0, a: 0.2 },
    { r: 0, g: 0, b: 255, a: 0.2 }
  ]}
/>
```

## Section Breakdown

| Section | Animation Type | Effect |
|---------|---------------|--------|
| **Hero** | Particle Network | Connected floating particles |
| **About** | Grid Waves | Pulsing grid pattern |
| **Projects** | Layered Waves | Flowing wave layers |
| **Experience** | Animated Gradient | Smooth color transitions |
| **Education** | Geometric Shapes | Rotating floating shapes |
| **Contact** | Animated Gradient | Vibrant multi-color gradient |

## Browser Compatibility

All animations are built with modern web standards:
- HTML5 Canvas API
- RequestAnimationFrame
- CSS blend modes
- Fully responsive

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## View the Live Demo

Your portfolio is now running at: **http://localhost:5174/myport/**

Scroll through each section to see the unique background animation for each part of your portfolio!
