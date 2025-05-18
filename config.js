(function (){
  'use strict';

  var session = require("express-session");
  var RedisStore;
  var redis;

  // Check if we're running in a development environment without Redis
  try {
    RedisStore = require('connect-redis')(session);
    redis = require('redis');
  } catch (e) {
    console.warn("Redis modules not available or not installed - using memory store for session");
  }

  module.exports = {
    session: {
      name: 'md.sid',
      secret: 'sooper secret',
      resave: false,
      saveUninitialized: true
    },

    // Check if Redis is available before creating a Redis store
    getSessionConfig: function(useRedis) {
      if (useRedis && RedisStore && redis) {
        try {
          var redisClient = redis.createClient({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            legacyMode: true
          });
          
          return {
            store: new RedisStore({ client: redisClient }),
            name: 'md.sid',
            secret: 'sooper secret',
            resave: false,
            saveUninitialized: true
          };
        } catch (e) {
          console.error("Failed to create Redis client:", e);
          // Fall through to memory store
        }
      }
      
      // Use memory store if Redis is unavailable
      return this.session;
    }
  };
}());
