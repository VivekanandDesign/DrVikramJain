/**
 * No-JS Fallback for Videos
 * 
 * This script adds a CSS class to the html element to indicate that JavaScript is enabled.
 * It helps provide a fallback for devices or browsers that don't support JavaScript or
 * when JavaScript is disabled.
 */
document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
