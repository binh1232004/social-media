'use client';
// Simple global event system for cross-component communication
const events = {};

export function subscribe(event, callback) {
  if (!events[event]) {
    events[event] = [];
  }
  events[event].push(callback);
  
  // Return unsubscribe function
  return () => {
    events[event] = events[event].filter(cb => cb !== callback);
  };
}

export function publish(event, data) {
  if (!events[event]) return;
  events[event].forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in event handler for ${event}:`, error);
    }
  });
}
